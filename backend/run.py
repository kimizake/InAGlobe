import logging
from .src import create_app, db, redis_client
import os

app = create_app()

from .src.models import Project, File, User, Comment


# run flask shell
@app.shell_context_processor
def make_shell_context():
    return {
        'db': db,
        'redis_client': redis_client,
        'Project': Project,
        'File': File,
        'User': User,
        'Comment': Comment
    }


if __name__ == "__main__":
    app.run()

if __name__ != "__main__":
    gunicorn_logger = logging.getLogger('gunicorn.error')
    app.logger.handlers = gunicorn_logger.handlers
    app.logger.setLevel(gunicorn_logger.level)
