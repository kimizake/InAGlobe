from flask import g, abort
from flask_httpauth import HTTPBasicAuth, HTTPTokenAuth
from functools import wraps

from .models import User

basic_auth = HTTPBasicAuth()
# token_auth uses bearer tokens
token_auth = HTTPTokenAuth()


@basic_auth.verify_password
def verify_password(email, password):
    # email unique so there can only be one
    user = User.query.filter_by(email=email).first()
    if user is None:
        return abort(404, 'Incorrect email!')
    if not user.confirmed:
        return abort(500, 'User is not verified!')
    g.current_user = user
    return user.verify_password(password)


@basic_auth.error_handler
def basic_auth_error():
    return abort(401, 'Incorrect password!')


@token_auth.verify_token
def verify_token(token):
    g.current_user = User.check_token(token) if token else None
    return g.current_user is not None


@token_auth.error_handler
def token_error_handler():
    return abort(401, 'Invalid token!')


def permission_required(permission):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            user = g.current_user
            if user.has_permission(permission) or user.is_admin():
                return f(*args, **kwargs)
            else:
                return permissions_error_handler()
        return decorated_function
    return decorator


def no_user_error():
    return abort(404, "User not found!")


def permissions_error_handler():
    return abort(403, "Insufficient permissions!")
