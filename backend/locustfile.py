from backend.src.models import USER_TYPE, OWNER_FIELD_LENGTH
from base64 import b64encode
from json import dumps, loads
from locust import HttpLocust, TaskSet, task, between
from os import environ
from random import choice
from uuid import uuid4
from sqlalchemy import create_engine

email_suffix = '@dummyemail.io'


class UserBehavior(TaskSet):
    def __init__(self, parent):
        super().__init__(parent)
        self.password = 'password'
        self.email = str(uuid4())[:OWNER_FIELD_LENGTH - len(email_suffix)] + email_suffix
        self.db = create_engine(environ['DATABASE_URL'], pool_size=50, max_overflow=50)

    def on_start(self):
        """ on_start is called when a Locust start before any task is scheduled """
        self.sign_up()
        self.login()

    def on_stop(self):
        """ on_stop is called when the TaskSet is stopping """
        self.logout()
        self.db.execute('DELETE FROM Users WHERE email = \'{}\''.format(self.email))

    def sign_up(self):
        self.client.post('/users/', headers={
            'content-type': 'application/json'
        }, data=dumps({
            'email': self.email,
            'firstName': 'name',
            'lastName': 'name',
            'userType': choice(list(USER_TYPE.keys())[1:]),
            'password': self.password
        }))
        self.db.execute('UPDATE Users SET confirmed = 1 WHERE email = \'{}\''.format(self.email))

    def login(self):
        kv = '{0}:{1}'.format(self.email, self.password)
        credentials = b64encode(kv.encode('utf-8')).decode('utf-8')
        rv = self.client.get('/users/tokens/', headers={
            'Authorization': 'Basic ' + credentials
        })
        self.token = loads(rv.content.decode('utf-8')).get('token')

    def logout(self):
        self.client.delete('/users/tokens/', headers={
            'Authorization': 'Bearer {}'.format(self.token)
        })

    @task(1)
    def get_projects(self):
        self.client.get("/projects/", headers={
            'Authorization': 'Bearer {}'.format(self.token)
        })


class WebsiteUser(HttpLocust):
    task_set = UserBehavior
    wait_time = between(5, 9)

