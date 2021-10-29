import json
import pytest
import sys
sys.path.append('.')

from backend.src.models import Comment, Project, User
from conftests import db, app, auth, client
from test_project import upload_project, load_json_file
from flask import g


FILES = ['no_files.json', 'many_files.json', 'many_images_no_documents.json', 'many_documents_no_images.json']


def add_comment(client, auth, project_id, email='student@ic.ac.uk', comment_file='comment.json'):
    token = auth.get_token(email=email)
    json_comment = load_json_file(comment_file, 'test_files/comments')
    return client.post('/comments/{}/'.format(project_id), headers={
        'Authorization': 'Bearer ' + token
    }, json=json_comment)


def get_comments(client, auth, project_id, email='student@ic.ac.uk'):
    token = auth.get_token(email=email)
    return client.get('/comments/{}/'.format(project_id), headers={
        'Authorization': 'Bearer ' + token
    })


def delete_comment(client, auth, comment_id, email='student@ic.ac.uk'):
    token = auth.get_token(email=email)
    return client.delete('/comments/{}/'.format(comment_id), headers={
        'Authorization': 'Bearer ' + token
    })

def load_projects(client, auth):
    [upload_project(client, auth, file=file) for file in FILES]


########################################################################################################################
# Create comment tests


@pytest.mark.parametrize('num_comments', range(5))
def test_create_comment(app, auth, client, num_comments):
    with app.app_context():
        load_projects(client, auth)
        ps = db.session.query(Project).all()

        for p in ps:
            rvs = [add_comment(client, auth, p.id) for i in range(num_comments)]
            assert all(rv.status_code == 201 for rv in rvs)
            assert all(b'text' in rv.data for rv in rvs)

            cs = db.session.query(Comment).filter(Comment.project_id == p.id).all()
            assert len(cs) == num_comments

        for p in ps:
            project_comments = db.session.query(Comment).filter(Comment.project_id == p.id).all()
            user_comments = db.session.query(Comment).filter(Comment.owner_id == g.current_user.id).all()
            assert project_comments is not [] and user_comments is not []
            assert set(project_comments) <= set(user_comments)

# TODO cover edge cases for create comments (exceptions)


########################################################################################################################
# Get comment tests

def test_get_comment(app, auth, client):
    with app.app_context():
        load_projects(client, auth)
        p = db.session.query(Project).first()
        [add_comment(client, auth, p.id) for i in range(5)]

        rv = get_comments(client, auth, p.id)
        assert rv.status_code == 200
        assert b'comments' in rv.data

        cs = json.loads(rv.data.decode('utf-8')).get('comments')
        for c in cs:
            assert c['text'] == 'comment'
            assert c['ownerId'] == g.current_user.id
            assert c['ownerFirstName'] == g.current_user.first_name
            assert c['ownerLastName'] == g.current_user.last_name

# TODO cover edge cases for get comments (exceptions)


########################################################################################################################
# Delete comment tests


@pytest.mark.parametrize(('p_email', 'd_email', 'd_type', 'code', 'message'), (
        ('student@ic.ac.uk', 'student@ic.ac.uk', '', 200, b'Comment deleted!'),
        ('newstudent@ic.ac.uk', 'newstudent@ic.ac.uk', 'STUDENT', 200, b'Comment deleted!'),
        ('academic@academia.com', 'academic@academia.com', '', 200, b'Comment deleted!'),
        ('humanitarian@charity.org', 'humanitarian@charity.org', '', 200, b'Comment deleted!'),
        ('admin@administrator.co', 'admin@administrator.co', '', 200, b'Comment deleted!'),
        ('student@ic.ac.uk', 'newstudent@ic.ac.uk', 'STUDENT', 403, b'Insufficient permissions!'),
        ('student@ic.ac.uk', 'academic@academia.com', '', 403, b'Insufficient permissions!'),
        ('student@ic.ac.uk', 'humanitarian@charity.org', '', 403, b'Insufficient permissions!'),
        ('student@ic.ac.uk', 'admin@administrator.co', '', 200, b'Comment deleted!'),
))
def test_delete_comment(app, auth, client, p_email, d_email, d_type, code, message):
    with app.app_context():

        if not db.session.query(User).filter(User.email == d_email).first():
            auth.create_user(email=d_email, user_type=d_type)
            auth.confirm_user(email=d_email)

        load_projects(client, auth)
        p = db.session.query(Project).first()
        add_comment(client, auth, p.id, email=p_email)

        # Current user is p_email, and they have only posted one comment
        c = db.session.query(Comment).filter(Comment.owner_id == g.current_user.id).first()

        rv = delete_comment(client, auth, c.id, email=d_email)

        assert rv.status_code == code
        assert message in rv.data

        assert db.session.query(Comment).filter(Comment.owner_id == g.current_user.id).first() is None


def test_delete_undefined_comment(app, client, auth):
    with app.app_context():

        load_projects(client, auth)
        p = db.session.query(Project).first()

        assert db.session.query(Comment).first() is None

        rv = delete_comment(client, auth, comment_id=1)

        assert rv.status_code == 404
        assert b'Comment does not exist!' in rv.data
