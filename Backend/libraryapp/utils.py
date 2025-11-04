from django.core.mail import send_mail
from django.conf import settings

def send_due_notification(user_email,book_title,due_date):
    subject = 'Library Book Due Notice'
    message = f"The book '{book_title}' you borrowed is due on {due_date}. Please ensure its timely return to avoid penalties return it to avoid fines."
    from_email = settings.EMAIL_HOST_USER

    send_mail(subject,message,from_email,[user_email])