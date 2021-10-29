import pytest
import sys

sys.path.append('.')
from backend.src.models import User
from conftests import db, app, auth, client



########################################################################################################################
# User creation tests

@pytest.mark.parametrize(('user_type', 'message', 'code'), (
        ('ADMIN', b'Not allowed!', 403),
        ('HUMANITARIAN', b'User created!', 201),
        ('ACADEMIC', b'User created!', 201),
        ('STUDENT', b'User created!', 201),
))
def test_create_user(app, auth, user_type, message, code):
    with app.app_context():
        # Check that a user which has not been registered is not in the database
        assert (
                db.session.query(User).filter(User.email == 'email@ic.ac.uk').first()
                is None
        )
        # We now register the user
        rv = auth.create_user(user_type=user_type)
        assert code == rv.status_code
        assert message in rv.data
        # Check the user has been registered in the database
        user = db.session.query(User).filter(User.email == 'email@ic.ac.uk').first()
        assert (
            user is not None
            if code == 201 else
            user is None
        )


# TODO: error handling for bad user registration
@pytest.mark.parametrize(('email', 'password', 'first_name', 'last_name', 'user_type', 'message', 'code'), (
        ('', 'password', 'name', 'surname', 'STUDENT', b'Bad email provided!', 400),
        ('', '', 'name', 'surname', 'STUDENT', b'Bad email provided!', 400),
        ('email', '', 'name', 'surname', 'STUDENT', b'Bad password provided!', 400),
        ('', 'tooshrt', 'name', 'surname', 'STUDENT', b'Bad email provided!', 400),
        ('email', 'password', '', 'surname', 'STUDENT', b'Bad name provided!', 400),
        ('email', 'password', 'name', '', 'STUDENT', b'Bad surname provided!', 400),
        ('email', 'password', 'name', 'surname', '', b'Bad user type provided!', 400),
))
def test_bad_create_user(auth, email, password, first_name, last_name, user_type, message, code):
    rv = auth.create_user(email, first_name, last_name, password, user_type)
    assert code == rv.status_code
    assert message in rv.data


########################################################################################################################
# User login tests

def test_login(app, auth):
    auth.create_user()
    auth.confirm_user()
    with app.app_context():
        # A token is only generated after the user logs in, so it should not exist at this stage
        assert (
            db.session.query(User).filter(User.email == 'email@ic.ac.uk').first().token
            is None
        )
        rv = auth.login('email@ic.ac.uk', 'password')
        # The token should now exist
        assert (
            db.session.query(User).filter(User.email == 'email@ic.ac.uk').first().token
            is not None
        )
        assert 200 == rv.status_code
        assert b'token' in rv.data

def test_login_multiple_users(auth):
    email1 = 'email1@ic.ac.uk'
    email2 = 'email2@ic.ac.uk'
    email3 = 'email3@ic.ac.uk'

    auth.create_user(email=email1, first_name='one')
    auth.confirm_user(email1)
    auth.create_user(email=email2, first_name='two')
    auth.confirm_user(email2)
    auth.create_user(email=email3, first_name='three')
    auth.confirm_user(email3)

    rv = auth.login(email1)
    assert b'one' in rv.data
    assert b'two' not in rv.data
    assert b'three' not in rv.data

    rv = auth.login(email2)
    assert b'two' in rv.data
    assert b'one' not in rv.data
    assert b'three' not in rv.data

    rv = auth.login(email3)
    assert b'three' in rv.data
    assert b'one' not in rv.data
    assert b'two' not in rv.data


# TODO: error handling for incorrect passwords
@pytest.mark.parametrize(('email', 'password', 'message', 'code'), (
        ('email@ic.ac.uk', 'wrongpassword', b'Incorrect password!', 401),
        ('wrong_email@ic.ac.uk', 'password', b'Incorrect email!', 404),
))
def test_bad_login(auth, email, password, message, code):
    auth.create_user()
    auth.confirm_user()
    rv = auth.login(email, password)
    assert rv.status_code == code
    assert message in rv.data


########################################################################################################################
# User confirmation

@pytest.mark.parametrize(('email', 'confirm', 'code', 'message'), (
        ('confirmation@ic.ac.uk', True, 200, b'token'),
        ('noconfirmation@ic.ac.uk', False, 500, b'User is not verified!'),
))
def test_login_confirmation(auth, email, confirm, code, message):
    auth.create_user(email=email)
    auth.confirm_user(email) if confirm else None
    rv = auth.login(email=email)
    assert rv.status_code == code
    assert message in rv.data

# TODO more confirmation tests for edge cases

########################################################################################################################
# User signout tests

def test_logout(app, auth):
    with app.app_context():
        # This user already exists in database
        student_user = db.session.query(User).filter(User.email == 'student@ic.ac.uk').first()
        # Token should not exist yet for the user
        assert student_user.token is None
        # Get user token from login
        token = auth.get_token()
        # Token should now exist
        assert student_user.token is not None
        assert User.check_token(token) == student_user
        # Test logout
        rv = auth.logout(token)
        assert 200 == rv.status_code
        assert b'User removed!' in rv.data
        # Check that the token has expired
        assert User.check_token(token) is None
        # However it has not been deleted
        assert student_user.token is not None

# TODO: add more 'bad' logout tests


########################################################################################################################
# Token tests

def test_token_auth(auth, client):
    auth.login()
    token = auth.get_token()
    rv = client.get('/projects/', headers={
        'Authorization': 'Bearer ' + token
    })
    assert 200 == rv.status_code
    auth.logout(token)
    rv = client.get('/projects/', headers={
        'Authorization': 'Bearer ' + token
    })
    assert rv.status_code == 401
    assert b'Invalid token!' in rv.data


def test_bad_token_auth(app, auth, client):
    with app.app_context():
        auth.login()
        token = auth.get_token()
        client.get('/projects/', headers={
            'Authorization': 'Bearer ' + token
        })
        user = db.session.query(User).filter(User.email == 'student@ic.ac.uk').first()
        from datetime import datetime, timedelta
        user.token_expiration = datetime.utcnow() - timedelta(seconds=1)
        rv = client.get('/projects/', headers={
            'Authorization': 'Bearer ' + token
        })
        assert rv.status_code == 401
        assert b'Invalid token!' in rv.data
