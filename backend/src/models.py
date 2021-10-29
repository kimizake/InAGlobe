import base64
import os
from datetime import datetime, timedelta

from sqlalchemy import ForeignKey
from werkzeug.security import generate_password_hash, check_password_hash

from . import db

# TODO: update field length values
ID_LENGTH = 64
TITLE_FIELD_LENGTH = 124
SHORT_FIELD_LENGTH = 256
LONG_FIELD_LENGTH = 1024
LOCATION_FIELD_LENGTH = 64
OWNER_FIELD_LENGTH = 64
LINK_FIELD_LENGTH = 512

PROJECT_STATUS = {
    'NEEDS_APPROVAL': 0,
    'APPROVED': 1,
}

FILE_TYPE = {
    'DOCUMENT': 0,
    'IMAGE': 1
}

USER_TYPE = {
    'ADMIN': 0,
    'HUMANITARIAN': 1,
    'ACADEMIC': 2,
    'STUDENT': 3
}


def get_rand_uuid():
    from uuid import uuid4
    uuid = str(uuid4())[:ID_LENGTH]
    while db.session.query.filter(id == uuid).first() is not None:
        uuid = str(uuid4())[:ID_LENGTH]
    return uuid


class Model:
    __table_args__ = {'extend_existing': True}

    id = db.Column(db.Integer, primary_key=True)
    # id = db.Column(db.String(ID_LENGTH), default=get_rand_uuid, primary_key=True)

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def __repr__(self):
        return '<id {}>'.format(self.id)


user_project_joining_table = db.Table(
    'UserProjects', db.Model.metadata,
    db.Column('user_id', db.Integer, ForeignKey('Users.id')),
    db.Column('project_id', db.Integer, ForeignKey('Projects.id')),
    db.Column('approved', db.Integer, default=0),
    db.Column('date_time', db.DateTime, default=datetime.now())
)

db.Index('myindex', user_project_joining_table.c.user_id, user_project_joining_table.c.project_id, unique=True)

user_comment_joining_table = db.Table(
    'UserComments', db.Model.metadata,
    db.Column('user_id', db.Integer, ForeignKey('Users.id')),
    db.Column('comment_id', db.Integer, ForeignKey('Comments.id'))
)


# checkpoint_project_joining_table = db.Table('CheckpointProjects', db.Model.metadata,
#     db.Column('project_id', db.Integer, ForeignKey('Projects.id')),
#     db.Column('checkpoint_id', db.Integer, ForeignKey('Checkpoints.id'))
# )

class Project(Model, db.Model):
    __tablename__ = 'Projects'

    title = db.Column(db.String(TITLE_FIELD_LENGTH), nullable=False)
    short_description = db.Column(db.String(SHORT_FIELD_LENGTH), nullable=False)
    long_description = db.Column(db.String(LONG_FIELD_LENGTH), nullable=False)
    location = db.Column(db.String(LOCATION_FIELD_LENGTH), nullable=False)
    project_owner = db.Column(db.Integer, nullable=False)
    organisation_name = db.Column(db.String(OWNER_FIELD_LENGTH), nullable=False)
    organisation_logo = db.Column(db.String(LINK_FIELD_LENGTH))
    status = db.Column(db.Integer, default=PROJECT_STATUS['NEEDS_APPROVAL'])


class File(Model, db.Model):
    __tablename__ = 'Files'

    project_id = db.Column(db.Integer, ForeignKey('Projects.id'))
    link = db.Column(db.String(LINK_FIELD_LENGTH), nullable=False)
    type = db.Column(db.Integer, default=FILE_TYPE['DOCUMENT'])


class UserFile(Model, db.Model):
    __tablename__ = 'UserFiles'

    user_id = db.Column(db.Integer, ForeignKey('Users.id'))
    link = db.Column(db.String(LINK_FIELD_LENGTH), nullable=False)
    type = db.Column(db.Integer, default=FILE_TYPE['DOCUMENT'])


class User(Model, db.Model):
    __tablename__ = 'Users'

    email = db.Column(db.String(OWNER_FIELD_LENGTH), unique=True)
    first_name = db.Column(db.String(OWNER_FIELD_LENGTH), nullable=False)
    last_name = db.Column(db.String(OWNER_FIELD_LENGTH), nullable=False)
    password_hash = db.Column(db.String(SHORT_FIELD_LENGTH), nullable=False)
    profile_picture = db.Column(db.String(LINK_FIELD_LENGTH))
    location = db.Column(db.String(LOCATION_FIELD_LENGTH))
    short_description = db.Column(db.String(SHORT_FIELD_LENGTH))
    long_description = db.Column(db.String(LOCATION_FIELD_LENGTH))
    token = db.Column(db.String(SHORT_FIELD_LENGTH), index=True, unique=True)
    token_expiration = db.Column(db.DateTime)
    user_type = db.Column(db.Integer, default=USER_TYPE['STUDENT'])
    projects = db.relationship('Project', secondary=user_project_joining_table,
                               backref=db.backref('users', lazy='dynamic'), uselist=True)

    comments = db.relationship('Comment', secondary=user_comment_joining_table,
                               backref=db.backref('users', lazy='dynamic'), uselist=True)

    confirmed = db.Column(db.Boolean, nullable=False, default=False)
    confirmed_on = db.Column(db.DateTime, nullable=True)

    def hash_password(self, password):
        self.password_hash = generate_password_hash(password, method='sha256')

    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)

    def get_token(self, expires_in=1):
        now = datetime.utcnow()

        if self.token and self.token_expiration > now + timedelta(seconds=60):
            return self.token

        self.token = base64.b64encode(os.urandom(24)).decode('utf-8')
        self.token_expiration = now + timedelta(days=expires_in)
        db.session.add(self)
        return self.token

    def revoke_token(self):
        self.token_expiration = datetime.utcnow() - timedelta(seconds=1)

    def set_permissions(self, t):
        if not t is None:
            self.user_type = USER_TYPE[t]

    def has_permission(self, permission):
        return self.user_type == permission

    def get_permissions(self):
        return self.user_type

    def get_id(self):
        return self.id

    def is_admin(self):
        return self.user_type == USER_TYPE['ADMIN']

    @staticmethod
    def check_token(token):
        user = User.query.filter_by(token=token).first()
        if user is None or user.token_expiration < datetime.utcnow():
            return None
        return user


class Comment(Model, db.Model):
    __tablename__ = 'Comments'

    project_id = db.Column(db.Integer, ForeignKey('Projects.id'))
    owner_id = db.Column(db.Integer, nullable=False)
    date_time = db.Column(db.DateTime, default=datetime.now())
    text = db.Column(db.String(100), nullable=False)
    owner_first_name = db.Column(db.String(OWNER_FIELD_LENGTH), nullable=False)
    owner_last_name = db.Column(db.String(OWNER_FIELD_LENGTH), nullable=False)

    @staticmethod
    def get_all_comments_for_project_id(proj_id):
        return File.query.filter_by(project_id=proj_id).all()


class Checkpoint(Model, db.Model):
    __tablename__ = 'Checkpoints'

    project_id = db.Column(db.Integer, ForeignKey('Projects.id'))
    owner_id = db.Column(db.Integer, nullable=False)
    owner_first_name = db.Column(db.String(OWNER_FIELD_LENGTH), nullable=False)
    owner_last_name = db.Column(db.String(OWNER_FIELD_LENGTH), nullable=False)
    date_time = db.Column(db.DateTime, default=datetime.now())
    title = db.Column(db.String(100), nullable=False)
    subtitle = db.Column(db.String(200), nullable=False)
    text = db.Column(db.String(800), nullable=False)


class CheckpointFile(Model, db.Model):
    __tablename__ = 'CheckpointFiles'

    checkpoint_id = db.Column(db.Integer, ForeignKey('Checkpoints.id'))
    link = db.Column(db.String(LINK_FIELD_LENGTH), nullable=False)
    type = db.Column(db.Integer, default=FILE_TYPE['DOCUMENT'])
