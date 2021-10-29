from flask import current_app as app, make_response, request, Response
from flask_restful import Resource
from .projects import (
    get_projects, upload_project, approve_project, upload_checkpoint, get_dashboard_projects,
    select_project, get_joining_requests, approve_project_join, delete_project, update_project, project_stream, deselect_project
)
from .users import (
    get_users, create_user, confirm_email, confirm_reset_password_token, reset_password,
    send_password_reset_email, get_user, update_user, delete_user
)
from .comments import add_comment, get_comments, delete_comment, comment_stream
from .tokens import get_token, revoke_token

# Define api


class Approvals(Resource):
    def post(self):
        response, code = approve_project(request.get_json())
        return make_response(response, code)


class JoiningApproval(Resource):
    def get(self):
        response, code = get_joining_requests()
        return make_response(response, code)

    def post(self):
        response, code = approve_project_join(request.get_json())
        return make_response(response, code)


class Dashboard(Resource):
    def get(self):
        response, code = get_dashboard_projects()
        return make_response(response, code)

    def post(self):
        response, code = select_project(request.get_json())
        return make_response(response, code)

    def delete(self):
        app.logger.info('calling delete request')
        response, code = deselect_project(request.get_json())
        return make_response(response, code)


class Projects(Resource):
    def get(self):
        app.logger.info('calling get projects')
        response, code = get_projects()
        return make_response(response, code)

    def post(self):
        app.logger.info('calling post project')
        response, code = upload_project(request.get_json())
        return make_response(response, code)

    def delete(self, identifier):
        app.logger.info('calling delete project')
        response, code = delete_project(identifier)
        return make_response(response, code)

    def patch(self, identifier):
        app.logger.info('calling patch project')
        response, code = update_project(request.get_json(), identifier)
        return make_response(response, code)


class ProjectStream(Resource):
    def get(self):
        return Response(project_stream(), mimetype='text/event-stream')

class Comments(Resource):
    def get(self, identifier):
        app.logger.info('calling get comment')
        response, code = get_comments(identifier)
        return make_response(response, code)

    def post(self, identifier):
        app.logger.info('calling post comment')
        response, code = add_comment(request.get_json(), identifier)
        return make_response(response, code)

    def delete(self, identifier):
        app.logger.info('calling delete comment')
        response, code = delete_comment(identifier)
        return make_response(response, code)


class CommentStream(Resource):
    def get(self, identifier):
        app.logger.info('calling get comment-stream')
        return Response(comment_stream(identifier), mimetype='text/event-stream')


class User(Resource):
    def get(self, identifier):
        app.logger.info('calling get user')
        response, code = get_user(identifier)
        return make_response(response, code)

    def post(self, identifier):
        app.logger.info('calling post user')
        response, code = update_user(request.get_json(), identifier)
        return make_response(response, code)

    def delete(self, identifier):
        app.logger.info('calling delete user')
        response, code = delete_user(request.get_json(), identifier)
        return make_response(response, code)


class Users(Resource):
    def get(self):
        app.logger.info('calling get users')
        response, code = get_users()
        return make_response(response, code)

    def post(self):
        app.logger.info('calling post users')
        response, code = create_user(request.get_json())
        return make_response(response, code)


class Checkpoints(Resource):
    def post(self, identifier):
        response, code = upload_checkpoint(request.get_json(), identifier)
        return make_response(response, code)


class Tokens(Resource):
    def get(self):
        response, code = get_token()
        return make_response(response, code)

    def delete(self):
        response, code = revoke_token()
        return make_response(response, code)


class ConfirmEmail(Resource):
    def get(self, token):
        response, code = confirm_email(token)
        return make_response(response, code)


class ResetPassword(Resource):
    def get(self, token):
        response, code = confirm_reset_password_token(token)
        return make_response(response, code)

    def post(self, token=None):
        if token:
            response, code = reset_password(token, request.get_json())
            return make_response(response, code)

        response, code = send_password_reset_email(request.get_json())
        return make_response(response, code)
