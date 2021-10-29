from flask import g, stream_with_context, current_app as app
from . import db, redis_client
from .auth import token_auth
from .models import Comment, User, user_comment_joining_table
from json import dumps


@token_auth.login_required
def add_comment(data, project_id):
    comment = Comment(
        project_id=project_id,
        owner_id=g.current_user.get_id(),
        text=data['text'],
        owner_first_name=g.current_user.first_name,
        owner_last_name=g.current_user.last_name
    )
    comment.save()
    app.logger.info('comment posted')
    comment_json = {
        "commentId": comment.id,
        "text": comment.text,
        "ownerId": comment.owner_id,
        "ownerFirstName": comment.owner_first_name,
        "ownerLastName": comment.owner_last_name,
        "date": comment.date_time.strftime("%Y-%m-%d %H:%M:%S")
    }
    response = {'message': 'Comment added!', 'comment': comment_json}
    app.logger.info('add comment published to channel comment{}'.format(project_id))
    redis_client.publish('comment{}'.format(project_id), dumps(response))
    g.current_user.comments.append(comment)
    db.session.commit()
    return response, 201


@token_auth.login_required
def get_comments(project_id):
    if not project_id:
        return {'message': "No project id"}
    project_comments = Comment.query.filter_by(project_id=project_id).all()
    # project_comments = db.session.query(user_comment_joining_table, Comment, User) \
    #     .filter_by(project_id=project_id) \
    #     .join(Comment, Comment.owner_id == user_comment_joining_table.c.owner_id) \
    #     .join(User, User.id == user_comment_joining_table.c.user_id) \
    #     .all()

    comments_json = [{
        "commentId": comment.id,
        "text": comment.text,
        "ownerId": comment.owner_id,
        # "ownerProfilePic": comment.profile_picture,
        "ownerFirstName": comment.owner_first_name,
        "ownerLastName": comment.owner_last_name,
        "date": comment.date_time.strftime("%Y-%m-%d %H:%M:%S")
    } for comment in project_comments]
    
    app.logger.info('getting comments')
    return {"comments": comments_json}, 200


@token_auth.login_required
def delete_comment(comment_id):
    comment = Comment.query.filter(Comment.id == comment_id).first()
    if comment is None:
        return {'message': 'Comment does not exist!'}, 404
    if comment in g.current_user.comments or g.current_user.is_admin():
        comment_json = {
            "commentId": comment.id,
            "text": comment.text,
            "ownerId": comment.owner_id,
            "ownerFirstName": comment.owner_first_name,
            "ownerLastName": comment.owner_last_name,
            "date": comment.date_time.strftime("%Y-%m-%d %H:%M:%S")
        }
        response = {'message': 'Comment deleted!', 'comment': comment_json}
        app.logger.info('delete comment published to channel comment{}'.format(comment.project_id))
        redis_client.publish('comment{}'.format(comment.project_id), dumps(response))
        comment.delete()
        app.logger.info('comment deleted')
        return response, 200
    else:
        return {'message': 'Insufficient permissions!'}, 403


@stream_with_context
@token_auth.login_required
def comment_stream(project_id):
    from datetime import datetime, timedelta
    now = datetime.utcnow()
    user = g.current_user
    pub_sub = redis_client.pubsub()
    app.logger.info('{0} subscribed to comment{1}'.format(user.email, project_id))
    pub_sub.subscribe('comment{}'.format(project_id))
    for message in pub_sub.listen():
        byte_data = message.get('data')
        try:
            string_data = byte_data.decode('utf-8')
            app.logger.info('streaming comment data to {}'.format(user.email))
            yield 'event: commentstream\ndata: {}\n\n'.format(string_data)
        except (UnicodeDecodeError, AttributeError):
            pass
        finally:
            # every 45 seconds a new event/stream is set up between client and user
            if datetime.utcnow() > now + timedelta(seconds=45):
                break
    pub_sub.close()
