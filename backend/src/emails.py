import os
from flask_mail import Message
from . import mail


def send_email(to, subject, template):
    msg = Message(
            subject,
            recipients=[to],
            html=template,
            sender=os.environ['APP_MAIL_USERNAME']
        )
    mail.send(msg)
