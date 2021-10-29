from . import db, redis_client
from .auth import token_auth, permission_required
from .models import (
    Project, File, User, Checkpoint, CheckpointFile, USER_TYPE, FILE_TYPE, PROJECT_STATUS, user_project_joining_table
)
from flask import g, abort, stream_with_context, current_app as app
from collections import defaultdict
from json import dumps, loads
from sqlalchemy import or_, and_

########################################################################################################################


@token_auth.login_required
def get_projects():
    user_id = g.current_user.get_id()
    user_type = g.current_user.get_permissions()
    join_relationship = []

    if user_type == USER_TYPE['ADMIN']:
        projects = Project.query.all()
    elif user_type == USER_TYPE['HUMANITARIAN']:
        projects = Project.query.filter(or_(
            Project.status == PROJECT_STATUS['APPROVED'],
            Project.project_owner == user_id
        )).all()
    else:
        projects = Project.query.filter(Project.status == PROJECT_STATUS['APPROVED']).all()
        join_relationship = db.session.query(user_project_joining_table) \
            .filter(user_project_joining_table.columns.user_id == user_id)

    return get_projects_helper(projects)


@token_auth.login_required
@permission_required(USER_TYPE['HUMANITARIAN'])
def upload_project(data):
    # TODO remove the code duplication for the try blocks
    # TODO change error handling for organisation logo
    try:
        if not data['title']:
            raise ValueError('title')
        if not data['shortDescription']:
            raise ValueError('short description')
        if not data['detailedDescription']:
            raise ValueError('detailed description')
        if not data['organisationName']:
            data['organisationName'] = 'dummy'
        if not data['organisationLogo']:
            data['organisationLogo'] = 'dummy'

        project = Project(
            title=data['title'],
            short_description=data['shortDescription'],
            long_description=data['detailedDescription'],
            location=data['location'],
            project_owner=g.current_user.get_id(),
            organisation_name=data['organisationName'],
            organisation_logo=data['organisationLogo']
        )
        project.save()
        app.logger.info('project uploaded')

        # TODO exceptions for bad links
        if data.get("documents") is not None:
            for link in data['documents']:
                file = File(project_id=project.id, link=link, type=FILE_TYPE['DOCUMENT'])
                file.save()
            for link in data['images']:
                file = File(project_id=project.id, link=link, type=FILE_TYPE['IMAGE'])
                file.save()

        # Create dashboard link for humanitarians
        g.current_user.projects.append(project)
        db.session.commit()

        _project_json, _int = get_projects_helper([project])
        project_json = _project_json.get('projects')[0]
        response = {'message': 'Project added to db!', 'project': project_json}

        app.logger.info('upload project published to channel projects')
        redis_client.publish('projects', dumps(response))
        return response, 201
    except ValueError as e:
        return abort(400, 'Bad {} provided!'.format(e.__str__()))
    except Exception as e:
        return abort(400, '{} not valid!'.format(e.__str__()))


@token_auth.login_required
@permission_required(USER_TYPE['HUMANITARIAN'])
def delete_project(project_id):
    project = db.session.query(Project).filter(Project.id == project_id).first()
    if project is None:
        return {'message': 'Project does not exist!'}, 404
    if project in g.current_user.projects or g.current_user.is_admin():
        response = {'message': 'Project deleted!', 'project': {'id': project_id, 'projectOwner': project.project_owner}}
        app.logger.info('project deleted')
        app.logger.info('delete project published to channel projects')
        redis_client.publish('projects', dumps(response))

        # TODO create tests
        from .models import Comment, Checkpoint, CheckpointFile
        from .comments import delete_comment

        [delete_comment(comment.id) for comment in Comment.query.filter(Comment.project_id == project_id).all()]

        for checkpoint in Checkpoint.query.filter(Checkpoint.project_id == project_id).all():
            [x.delete() for x in CheckpointFile.query.filter(Checkpoint.id == checkpoint.id).all()]
            checkpoint.delete()


        # TODO delete files in s3 & test
        [file.delete() for file in File.query.filter(File.project_id == project_id).all()]

        project.delete()
        return response, 200
    else:
        return {'message': 'Insufficient permissions!'}, 403


@token_auth.login_required
@permission_required(USER_TYPE['HUMANITARIAN'])
def update_project(data, project_id):
    p = db.session.query(Project).filter(Project.id == project_id).first()
    if p is None:
        return {'message': 'Project does not exist!'}, 404
    if p in g.current_user.projects or g.current_user.is_admin():
        project_json = {'id': p.id, 'projectOwner': p.project_owner}

        if not data.items():
            return {'message': 'No changes!'}, 204

        for k, v in data.items():
            if k not in ['title', 'shortDescription', 'detailedDescription', 'location', 'organisationName',
                         'organisationLogo']:
                return {'message': 'Bad request!'}, 400
            if v is not '':
                if k == 'title':
                    project_json['title'] = v
                    p.title = v
                if k == 'shortDescription':
                    project_json['shortDescription'] = v
                    p.short_description = v
                if k == 'detailedDescription':
                    project_json['detailedDescription'] = v
                    p.long_description = v
                if k == 'location':
                    project_json['location'] = v
                    p.location = v
                if k == 'organisationName':
                    project_json['organisationName'] = v
                    p.organisation_name = v
                if k == 'organisationLogo':
                    project_json['organisationLogo'] = v
                    p.organisation_logo = v

        app.logger.info('project updated')
        db.session.commit()
        response = {'message': 'Project updated!', 'project': project_json}
        app.logger.info('update project published to channel projects')
        redis_client.publish('projects', dumps(response))
        return response, 200
    else:
        return {'message': 'Insufficient permissions!'}, 403


########################################################################################################################
# Project Dashboard


@token_auth.login_required
def get_dashboard_projects():
    if g.current_user.get_permissions() == USER_TYPE['HUMANITARIAN']:
        return get_projects_helper(Project.query.filter(Project.project_owner == g.current_user.get_id()).all())
    if g.current_user.get_permissions() == USER_TYPE['ADMIN']:
        return get_projects_helper(Project.query.filter(Project.status == PROJECT_STATUS['NEEDS_APPROVAL']).all())
    return get_projects_helper(g.current_user.projects)


@token_auth.login_required
def select_project(data):
    project = Project.query.filter(Project.id == data['projectId']).first()
    g.current_user.projects.append(project)
    db.session.commit()
    return {'message': 'Project selection requested!'}, 201

@token_auth.login_required
def deselect_project(data):
    project = Project.query.filter(Project.id == data['projectId']).first()
    db.session.query(user_project_joining_table).filter(and_(user_project_joining_table.columns.project_id == data['projectId'], user_project_joining_table.columns.user_id == data['userId'])).delete(synchronize_session=False)

#     g.current_user.projects.remove(project)
    db.session.commit()
    return {'message': 'Project deselected!'}, 201


########################################################################################################################
# Project Checkpoints


@token_auth.login_required
def upload_checkpoint(data, project_id):
    if not project_id:
        return {'message': "No project id"}

    checkpoint = Checkpoint(
        project_id=project_id,
        owner_id=g.current_user.get_id(),
        text=data['text'],
        title=data['title'],
        subtitle=data['subtitle'],
        owner_first_name=g.current_user.first_name,
        owner_last_name=g.current_user.last_name,
    )

    checkpoint.save()
    for c in data['documents']:
        checkpoint_file = CheckpointFile(
            checkpoint_id=checkpoint.id,
            link=c,
            type=FILE_TYPE['DOCUMENT']
        )

        checkpoint_file.save()

    for c in data['images']:
        checkpoint_file = CheckpointFile(
            checkpoint_id=checkpoint.id,
            link=c,
            type=FILE_TYPE['IMAGE']
        )

        checkpoint_file.save()

    return {'message': 'Checkpoint added!'}, 201


########################################################################################################################
# Project Approval


@token_auth.login_required
@permission_required(USER_TYPE['ADMIN'])
def approve_project(data):
    project = Project.query.filter_by(id=data['projectId']).first()
    if project.status == PROJECT_STATUS['APPROVED']:
        project.status = PROJECT_STATUS['NEEDS_APPROVAL']
        message = "Project disapproved!"
        status = "Needs Approval"
    else:
        project.status = PROJECT_STATUS['APPROVED']
        message = "Project approved!"
        status = "Approved"
    project.save()
    app.logger.info('project approval')

    response = {
            'message': message, 
            'project': {'id': project.id, 'status': status, 'projectOwner': project.project_owner}
        }

    app.logger.info('project approval published to channel projects')
    redis_client.publish('projects', dumps(response))

    return response, 200


@token_auth.login_required
@permission_required(USER_TYPE['ADMIN'])
def approve_project_join(data):
    stm = user_project_joining_table.update().where(
        and_(
            user_project_joining_table.c.user_id == data['userId'],
            user_project_joining_table.c.project_id == data['projectId'])). \
        values({user_project_joining_table.c.approved: 1 - user_project_joining_table.c.approved})

    db.session.execute(stm)
    db.session.commit()

    return {"message": "Approved value flipped."}, 200


@token_auth.login_required
@permission_required(USER_TYPE['ADMIN'])
def get_joining_requests():
    requests = db.session.query(user_project_joining_table, User, Project) \
        .filter_by(approved=0) \
        .join(User, User.id == user_project_joining_table.c.user_id) \
        .join(Project, Project.id == user_project_joining_table.c.project_id) \
        .all()

    requests_json = [{
        "project_id": request.project_id,
        "user_id": request.user_id,
        "user_profile_pic": request.profile_picture,
        "user_first_name": request.User.first_name,
        "user_profile_pic": request.User.profile_picture,
        "user_last_name": request.User.last_name,
        "project_title": request.Project.title,
        "project_short_description": request.Project.short_description,
        "request_date_time": request.date_time
    } for request in requests]

    return {"requests": requests_json}, 200


########################################################################################################################
# Project Stream

@stream_with_context
@token_auth.login_required
def project_stream():
    from datetime import datetime, timedelta
    now = datetime.utcnow()
    pub_sub = redis_client.pubsub()
    pub_sub.subscribe('projects')
    app.logger.info('subscribed to projects')
    for message in pub_sub.listen():
        if message.get('type') == 'subscribe':
            continue

        byte_data = message.get('data')
        try:
            string_data = byte_data.decode('utf-8')
            app.logger.info(string_data)
            data = loads(string_data)
            message = data.get('message')
            user = g.current_user
            project = data.get('project')
            if (
                    user.is_admin() or
                    project.get('status') == PROJECT_STATUS['APPROVED'] or
                    int(project.get('projectOwner')) == user.get_id() or
                    message == 'Project disapproved!'
                    ):
                yield 'event: project-stream\ndata: {}\n\n'.format(dumps(dict(project=project, message=message)))
        except (UnicodeDecodeError, AttributeError) as e:
            # yield 'event: error\ndata: {}, {}\n\n'.format(e, data)
            pass
        finally:
            if datetime.utcnow() > now + timedelta(seconds=45):
                break


########################################################################################################################


def get_projects_helper(projects):
    files = File.query.all()
    checkpoints = Checkpoint.query.all()
    checkpoint_files = CheckpointFile.query.all()
    join_relationship = []
    user_type = g.current_user.get_permissions()
    if user_type == USER_TYPE['STUDENT'] or user_type == USER_TYPE['ACADEMIC']:
        join_relationship = db.session.query(user_project_joining_table) \
            .filter(user_project_joining_table.columns.user_id == g.current_user.get_id())

    documents_map = defaultdict(list)
    images_map = defaultdict(list)
    checkpoints_map = defaultdict(list)
    checkpoint_documents_map = defaultdict(list)
    checkpoint_images_map = defaultdict(list)
    joined_projects = {}

    for f in files:
        if f.type == FILE_TYPE['DOCUMENT']:
            documents_map[f.project_id].append(f.link)
        elif f.type == FILE_TYPE['IMAGE']:
            images_map[f.project_id].append(f.link)

    for f in checkpoint_files:
        if f.type == FILE_TYPE['DOCUMENT']:
            checkpoint_documents_map[f.checkpoint_id].append(f.link)
        elif f.type == FILE_TYPE['IMAGE']:
            checkpoint_images_map[f.checkpoint_id].append(f.link)

    for r in join_relationship:
        if r.approved == 1:
            joined_projects[r.project_id] = 2
        else:
            joined_projects[r.project_id] = 1

    for c in checkpoints:
        cJson = {
            "firstName": c.owner_first_name,
            "lastName": c.owner_last_name,
            "date": c.date_time,
            "title": c.title,
            "subtitle": c.subtitle,
            "text": c.text,
            "documents": checkpoint_documents_map[c.id],
            "images": checkpoint_images_map[c.id]
        }
        checkpoints_map[c.project_id].append(cJson)

    projects_json = [{
        "id": project.id,
        "title": project.title,
        "shortDescription": project.short_description,
        "detailedDescription": project.long_description,
        "location": project.location,
        "projectOwner": project.project_owner,
        "documents": documents_map[project.id],
        "organisationName": project.organisation_name,
        "organisationLogo": project.organisation_logo,
        "status": project.status,
        # 0 = not requested, 1 = needs approval, 2 = approved
        "joined": 0 if project.id not in joined_projects else joined_projects[project.id],
        "images": images_map[project.id],
        "checkpoints": checkpoints_map[project.id],
    } for project in projects]

    return {'projects': projects_json}, 200
