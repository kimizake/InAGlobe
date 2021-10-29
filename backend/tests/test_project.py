import json
import pytest
import os
import sys

sys.path.append('.')
from backend.src.models import Project, File, User, FILE_TYPE
from conftests import db, app, auth, client
from flask import g



def get_projects(client, auth, email='humanitarian@charity.org'):
    token = auth.get_token(email=email)
    return client.get('/projects/', headers={
        'Authorization': 'Bearer ' + token
    })


def upload_project(client, auth, email='humanitarian@charity.org', file='no_files.json'):
    token = auth.get_token(email=email)
    json_file = load_json_file(file, 'test_files/projects')
    return client.post('/projects/', headers={
        'Authorization': 'Bearer ' + token
    }, json=json_file)


def delete_project(client, auth, email, project_id):
    token = auth.get_token(email=email)
    return client.delete('/projects/{}/'.format(project_id), headers={
        'Authorization': 'Bearer ' + token
    })

def modify_project(client, auth, email, project_id, file):
    token = auth.get_token(email=email)
    json_file = load_json_file(file, 'test_files/projects/modify_projects')
    return client.patch('/projects/{}/'.format(project_id), headers={
        'Authorization': 'Bearer ' + token
    }, json=json_file)

def load_json_file(filename, directory):
    relative_path = os.path.join(directory, filename)
    absolute_path = os.path.join(os.path.dirname(__file__), relative_path)

    with open(absolute_path) as json_file:
        return json.loads(json_file.read())

########################################################################################################################
# Upload project tests

@pytest.mark.parametrize(('file', 'number_of_documents', 'number_of_images', 'message', 'code'), (
        ('no_files.json', 0, 0, b'Project added to db!', 201),
        ('one_document_no_images.json', 1, 0,  b'Project added to db!', 201),
        ('one_image_no_documents.json', 0, 1, b'Project added to db!', 201),
        ('many_documents_no_images.json', 3, 0, b'Project added to db!', 201),
        ('many_images_no_documents.json', 0, 3, b'Project added to db!', 201),
        ('many_files.json', 3, 3, b'Project added to db!', 201),
))
def test_project_upload(app, client, auth, file, number_of_documents, number_of_images, message, code):
    with app.app_context():
        # We check that there are no projects in an empty database
        assert (
                db.session.query(Project).first()
                is None
        )
        # And that there are no file links either
        assert (
            db.session.query(File).first()
            is None
        )
        # Upload a project using our default humanitarian user
        rv = upload_project(client, auth, file=file)

        p_query = db.session.query(Project)
        # After uploading one file we check that there is only one project in the database
        assert p_query.count() == 1
        # And we make sure that this project belongs to our humanitarian user
        assert(
            p_query.filter(Project.project_owner == g.current_user.get_id()).first()
            is not None
        )

        f_query = db.session.query(File)
        # If documents have been attached to this project...
        if number_of_documents > 0:
            # We make sure they have all been properly assigned
            files = f_query.filter(File.type == FILE_TYPE['DOCUMENT']).all()
            assert len(files) == number_of_documents
            for file in files:
                assert file is not None
                assert file.project_id == p_query.first().id
        # Do the same for images that are attached
        if number_of_images > 0:
            files = f_query.filter(File.type == FILE_TYPE['IMAGE']).all()
            assert len(files) == number_of_images
            for file in files:
                assert file is not None
                assert file.project_id == p_query.first().id

        # Finally check that HTTP response is appropriate
        assert code == rv.status_code
        assert message in rv.data


# TODO: create more 'bad' test files, test cases here such as the commented out one (including bad filelinks), and add error handling
@pytest.mark.parametrize(('file', 'email', 'message', 'code'), (
        ('no_files.json', 'student@ic.ac.uk', b'Insufficient permissions!', 403),
        ('missing_title.json', 'student@ic.ac.uk', b'Insufficient permissions!', 403),
        ('missing_title.json', 'humanitarian@charity.org', b'Bad title provided!', 400),
))
def test_bad_project_upload(app, auth, client, file, email, message, code):
    with app.app_context():
        rv = upload_project(client, auth, email=email, file=file)
        # Check that no projects have been uploaded
        assert not db.session.query(Project).all()
        assert code == rv.status_code
        assert message in rv.data


########################################################################################################################
# Get projects tests

# TODO: add more test cases for the get project api
@pytest.mark.parametrize(('files', 'email', 'expected', 'code'), (
        (['no_files.json'], 'admin@administrator.co', [b'no files'], 200),
        (['no_files.json', 'no_files.json'], 'admin@administrator.co', [b'no files', b'no files'], 200),
        (['no_files.json', 'many_files.json'], 'admin@administrator.co', [b'many documents many images', b'no files'], 200),
        (['no_files.json', 'many_files.json'], 'student@ic.ac.uk', [], 200),
))
def test_get_project(client, auth, files, email, expected, code):
    # Load up database with projects
    [upload_project(client, auth, email=email, file=file) for file in files]

    rv = get_projects(client, auth, email=email)
    assert code == rv.status_code

    # Check that the response data has exactly the number of project files we expected on return
    response_projects = json.loads(rv.data.decode('utf-8')).get('projects')
    assert len(expected) == len(response_projects)
    # and that these projects match the input
    for message in expected:
        assert message in rv.data

# TODO: create tests for project approval and dashboard


########################################################################################################################
# Delete projects tests

@pytest.mark.parametrize(('files', 'email', 'message', 'code'), (
        (['no_files.json'], 'humanitarian@charity.org', b'Project deleted!', 200),
        (['no_files.json', 'many_files.json', 'one_document_no_images.json'], 'humanitarian@charity.org', b'Project deleted!', 200),
        (['no_files.json'], 'admin@administrator.co', b'Project deleted!', 200),
        (['no_files.json'], 'student@ic.ac.uk', b'Insufficient permissions!', 403),
        (['no_files.json'], 'academic@academia.com', b'Insufficient permissions!', 403),
        (['no_files.json', 'many_images_no_documents.json'], 'newhumanitarian@charity.org', b'Insufficient permissions!', 403),
))
def test_delete_project(app, client, auth, files, email, message, code):
    with app.app_context():

        # For the new humanitarian edge case
        if not db.session.query(User).filter(User.email == email).first():
            auth.create_user(email=email, user_type='HUMANITARIAN')
            auth.confirm_user(email=email)

        # Upload projects with default humanitarian user
        [upload_project(client, auth, file=file) for file in files]

        # Delete each project sequentially and check that the database matches
        for project in db.session.query(Project).all():
            assert db.session.query(Project).filter(Project.id == project.id).first is not None
            rv = delete_project(client, auth, email, project.id)
            if code == 200:
                assert db.session.query(Project).filter(Project.id == project.id).first() is None
            else:
                assert db.session.query(Project).filter(Project.id == project.id).first() is not None

            # Check HTTP responses
            assert rv.status_code == code
            assert message in rv.data

        if code == 200:
            assert db.session.query(Project).all() == []
        else:
            assert len(db.session.query(Project).all()) == len(files)


def test_delete_undefined_project(app, client, auth):
    with app.app_context():
        upload_project(client, auth)
        project = db.session.query(Project).filter(Project.title == 'no files').first()
        assert project is not None
        assert project.id == 1

        assert db.session.query(Project).filter(Project.id == 2).first() is None

        rv = delete_project(client, auth, email='humanitarian@charity.org', project_id=2)

        assert rv.status_code == 404
        assert b'Project does not exist!' in rv.data


########################################################################################################################
# Modify project Tests


@pytest.mark.parametrize(('email', 'files', 'code', 'message'), (
        ('humanitarian@charity.org', ['change_title.json'], 200, b'Project updated!'),
))
def test_modify_project(app, auth, client, email, files, code, message):
    with app.app_context():
        # For the new humanitarian edge case
        if not db.session.query(User).filter(User.email == email).first():
            auth.create_user(email=email, user_type='HUMANITARIAN')
            auth.confirm_user(email=email)

        [upload_project(client, auth) for i in range(3)]
        assert all(db.session.query(Project).filter(Project.id == i+1).first().title == 'no files' for i in range(3))

        for file in files:
            rv = modify_project(client, auth, email=email, project_id=1, file=file)
            assert rv.status_code == code
            assert message in rv.data

        p = db.session.query(Project).filter(Project.id == 1).first()

        project_fields = {
            'title': p.title,
            'shortDescription': p.short_description,
            'detailedDescription': p.long_description,
            'location': p.location,
            'organisationName': p.organisation_name,
            'organisationLogo': p.organisation_logo
        }
        for file in files:
            for k, v in load_json_file(file, 'test_files/projects/modify_projects').items():
                assert project_fields[k] == v
                # assert all(v not in db.session.query(Project).filter(Project.id == i+2).first() for i in range(2))
