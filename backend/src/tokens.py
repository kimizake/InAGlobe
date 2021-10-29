from flask import g
from itsdangerous import URLSafeTimedSerializer

from . import db
from .auth import basic_auth, token_auth
from .models import FILE_TYPE, UserFile
import os


@basic_auth.login_required
def get_token():
    token = g.current_user.get_token()
    db.session.commit()

    files = UserFile.query.filter_by(user_id=g.current_user.get_id()).all()
    documents_list = []
    images_list = []

    for f in files:
        if f.type == FILE_TYPE['DOCUMENT']:
            documents_list.append(f.link)
        elif f.type == FILE_TYPE['IMAGE']:
            images_list.append(f.link)

    return {
        'token': token,
        'firstName': g.current_user.first_name,
        'lastName': g.current_user.last_name,
        'permissions': g.current_user.get_permissions(),
        'userId': g.current_user.get_id(),
        'profilePicture': g.current_user.profile_picture,
        'location': g.current_user.location,
        'email': g.current_user.email,
        'shortDescription': g.current_user.short_description,
        'longDescription': g.current_user.long_description,
        "documents": documents_list,
        "images": images_list,
    }, 200

@token_auth.login_required
def revoke_token():
    g.current_user.revoke_token()
    db.session.commit()
    return {'message': 'User removed!'}, 200


def generate_confirmation_token(email):
    serializer = URLSafeTimedSerializer(os.environ['SECRET_KEY'])
    return serializer.dumps(email, salt=os.environ['SECURITY_PASSWORD_SALT'])

def confirm_token(token, expiration=360000):
    serializer = URLSafeTimedSerializer(os.environ['SECRET_KEY'])
    try:
        email = serializer.loads(
            token,
            salt=os.environ['SECURITY_PASSWORD_SALT'],
            max_age=expiration
        )
    except:
        return False

    return email
