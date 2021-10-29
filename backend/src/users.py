import os
from . import db

from . import db
from flask import g, abort, render_template, current_app as app
from .auth import token_auth, permission_required
from .models import User, UserFile, USER_TYPE, FILE_TYPE
from .tokens import generate_confirmation_token, confirm_token
from .emails import send_email
from datetime import datetime
from json import dumps
from sqlalchemy import and_


@token_auth.login_required
def get_user(identifier):
    user = User.query.filter_by(id=identifier).first()
    if user is None:
        return {'message': 'User does not exist!'}, 404

    files = UserFile.query.filter_by(user_id=identifier).all()
    documents_list = []
    images_list = []

    for f in files:
        if f.type == FILE_TYPE['DOCUMENT']:
            documents_list.append(f.link)
        elif f.type == FILE_TYPE['IMAGE']:
            images_list.append(f.link)

    return {
               'firstName': user.first_name,
               'lastName': user.last_name,
               'permissions': user.get_permissions(),
               'userId': user.get_id(),
               'profilePicture': user.profile_picture,
               'location': user.location,
               'email': user.email,
               'shortDescription': user.short_description,
               'longDescription': user.long_description,
               "documents": documents_list,
               "images": images_list,
           }, 200


@token_auth.login_required
@permission_required(USER_TYPE['ADMIN'])
def get_users():
    users = User.query.all()
    users_json = [{'Id': user.id, 'Email': user.email, 'UserType': user.user_type} for user in users]
    return {'users': users_json}, 200


def create_user(data):
    try:
        if not data['email']:
            raise ValueError('email')
        if not data['firstName']:
            raise ValueError('name')
        if not data['lastName']:
            raise ValueError('surname')
        if not data['userType'] in USER_TYPE:
            raise ValueError('user type')
        if not data['password'] or len(data['password']) < 8:
            raise ValueError('password')

        if data['userType'] == 'ADMIN':
            return {'message': 'Not allowed!'}, 403

        new_user = User(
            email=data['email'],
            first_name=data['firstName'],
            last_name=data['lastName'],
            user_type=USER_TYPE[data['userType']]
        )

        new_user.hash_password(data['password'])
        new_user.save()

        token = generate_confirmation_token(new_user.email)
        confirm_url = os.environ['SITE_URL'] + f"login/confirm/{token}"
        html = render_template('confirm_email.html', confirm_url=confirm_url)
        subject = "Please confirm your email for Inaglobe"
        send_email(new_user.email, subject, html)

        return {'message': 'User created!'}, 201

    except ValueError as e:
        return {'message': 'Bad {} provided!'.format(e)}, 400
        # return abort(400, 'Bad {} provided!'.format(e.__str__()))
    except Exception as e:
        return {'message': '{}'.format(e)}, 400
        # return abort(400, '{}'.format(e.__str__()))


@token_auth.login_required
# @permission_required(USER_TYPE['STUDENT'])
def update_user(data, user_id):
    app.logger.info("the type of user_id is {} and User.id is {}".format(type(user_id), type(User.id)))
    app.logger.info("user_id: {}  and   User.id: {}".format(user_id, User.id))
    u = db.session.query(User).filter(User.id == user_id).first()
    if u is None:
        return {'message': 'User does not exist!'}, 404

    if user_id == g.current_user.get_id():
        if not data.items():
            return {'message': 'No changes!'}, 204

        for k, v in data.items():
            if k in ["permissions", "token", "userId"]:
                continue

            if v is not '':
                if k == "firstName":
                    u.first_name = v
                elif k == "lastName":
                    u.last_name = v
                elif k == "profilePicture":
                    u.profile_picture = v
                elif k == "email":
                    u.email = v
                elif k == "location":
                    u.location = v
                elif k == "shortDescription":
                    u.short_description = v
                elif k == "longDescription":
                    u.long_description = v
                elif k == "images":
                    UserFile.query.filter(
                        and_(UserFile.user_id == user_id, UserFile.type == FILE_TYPE['IMAGE'])).delete()
                    for link in v:
                        file = UserFile(user_id=user_id, link=link, type=FILE_TYPE['IMAGE'])
                        file.save()
                elif k == "documents":
                    UserFile.query.filter(
                        and_(UserFile.user_id == user_id, UserFile.type == FILE_TYPE['DOCUMENT'])).delete()
                    for link in v:
                        file = UserFile(user_id=user_id, link=link, type=FILE_TYPE['DOCUMENT'])
                        file.save()

        db.session.commit()
        app.logger.info("update user published to channel user")
        return {'message': 'Project updated!'}, 200
    else:
        return {'message': "User not allowed to change other user's profile"}, 403


@token_auth.login_required
@permission_required(USER_TYPE['ADMIN'])
def delete_user(user_id):
    pass


def confirm_email(token):
    try:
        email = confirm_token(token)
    except:
        return {'message': 'The confirmation link is invalid or has expired'}, 404

    user = User.query.filter_by(email=email).first_or_404()
    if user.confirmed:
        return {'message': 'The confirmation link is invalid or has expired'}, 200
    else:
        user.confirmed = True
        user.confirmed_on = datetime.now()
        user.save()
    return {'message': 'You have confirmed your account!'}, 200


def confirm_reset_password_token(token):
    try:
        email = confirm_token(token)
        user = User.query.filter_by(email=email).first_or_404()
    except:
        return {'message': 'The reset password link is invalid or has expired'}, 404


def send_password_reset_email(data):
    email = data['email']
    token = generate_confirmation_token(email)
    confirm_url = os.environ['SITE_URL'] + f"login/resetpassword/{token}"
    html = render_template('reset_password.html', confirm_url=confirm_url)
    subject = "Please reset your password"
    send_email(email, subject, html)
    return {'message': 'Email sent!'}, 200


def reset_password(token, data):
    try:
        email = confirm_token(token)
    except:
        return {'message': 'The confirmation link is invalid or has expired'}, 404

    if not data['password'] or len(data['password']) < 8:
        raise ValueError('password')

    user = User.query.filter_by(email=email).first_or_404()
    user.hash_password(data['password'])
    user.save()

    return {'message': 'Your password has been reset!'}, 200
