from backend.src.models import User
from backend.tests.conftests import db, app, auth, client


def test_update_user(app, auth, client):
    # TODO improve this test
    with app.app_context():
        token = auth.get_token(email='humanitarian@charity.org')
        user = User.query.filter(User.email == 'humanitarian@charity.org').first()

        client.post('/user/{}/'.format(user.id), headers={
            'Authorization': 'Bearer ' + token
        }, json={
            'firstName': 'test'
        })

        user = User.query.filter(User.email == 'humanitarian@charity.org').first()
        assert user.first_name == 'test'
