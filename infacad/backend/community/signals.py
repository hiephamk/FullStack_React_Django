from django.db.models.signals import m2m_changed, post_save
from django.dispatch import receiver
from .models import Circles, Circle_Notification


@receiver(post_save, sender=Circle_Notification)
def handle_approved_notification(sender, instance, **kwargs):
    if instance.status == Circle_Notification.APPROVED:
        # Ensure the sender is the owner of the circle
        circles = instance.Circles
        if circles.owner != instance.sender:
            circles.owner = instance.sender
            circles.save()

        # Add both sender and receiver to the circle's members
        circles.members.add(instance.sender, instance.receiver)

# @receiver(post_save, sender=Circles)
# def create_circle_notifications(sender, instance, created, **kwargs):
#     if created:
#         for member in instance.members.all():
#             Circle_Notification.objects.create(
#                 user=member,
#                 circle=instance,
#                 message=f"{instance.owner.get_full_name} wants to add you to their circle."
#             )
#
# @receiver(m2m_changed, sender=Circles.members.through)
# def notify_members_on_add(sender, instance, action, pk_set, **kwargs):
#     if action == 'post_add':
#         for member_id in pk_set:
#             member = instance.members.get(pk=member_id)
#             Circle_Notification.objects.create(
#                 user=member,
#                 circle=instance,
#                 message=f"{instance.owner.get_full_name} has added you to their circle."
#             )

# @receiver(post_save, sender=Circle_Notification)
# def handle_approved_notification(sender, instance, created, **kwargs):
#     if instance.status == 'approved':
#         # Add user to the sender's circle
#         instance.circle.members.add(instance.user)
#
#         # Add the sender to the user's circle (if the user has a circle)
#         user_circle = Circles.objects.get(owner=instance.user)
#         user_circle.members.add(instance.sender)

# @receiver(m2m_changed, sender=Circles.members.through)
# def add_owner_to_member_circle(sender, instance, action, reverse, model, pk_set, **kwargs):
#     if action == "post_add":  # Trigger after adding members to a circle
#         for user_id in pk_set:
#             if not reverse:  # When the current circle's members are being updated
#                 user = model.objects.get(id=user_id)
#                 # Add the owner of the circle (instance.owner) to the user's circle if not already a member
#                 user_circle, created = Circles.objects.get_or_create(owner=user)
#                 user_circle.members.add(instance.owner)
#                 user_circle.save()

# @receiver(m2m_changed, sender=Circles.members.through)
# def send_membership_request_notification(sender, instance, action, reverse, model, pk_set, **kwargs):
#     if action == "post_add":  # Trigger after adding members to a circle
#         for user_id in pk_set:
#             if not reverse:  # When the current circle's members are being updated
#                 user = model.objects.get(id=user_id)
#                 # Create a notification for User B about the pending request
#                 Circle_Notification.objects.create(
#                     sender=instance.owner,
#                     user=user,
#                     #status='circle_membership_request'
#                 )
