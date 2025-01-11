
from django.db import models
from django.conf import settings
from django.contrib.auth import get_user_model
from zope.event import notify

User = get_user_model()

class Circles(models.Model):
    owner = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='owned_circle'
    )  # Each user can create only one circle
    members = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name='member_of_circles',
        blank=True
    )

    def add_member(self, user):
        if user not in self.members.all():
            self.members.add(user)
            return f"{user.get_full_name()} has been added to the circle."
        return f"{user.get_full_name()} is already in the circle."

    def remove_member(self, user):
        if user in self.members.all():
            self.members.remove(user)
            return f"{user.get_full_name()} has been removed from the circle."
        return f"{user.get_full_name()} is not a member of the circle."

    def __str__(self):
        return f"{self.owner.get_full_name}'s Circle"


class Circle_Notification(models.Model):
    PENDING = 'pending'
    APPROVED = 'approved'
    REJECTED = 'rejected'
    STATUS_CHOICES = [
        (PENDING, 'Pending'),
        (APPROVED, 'Approved'),
        (REJECTED, 'Rejected'),
    ]
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default=PENDING)
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sent_notifications')
    receiver = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='received_notifications')

    message = models.TextField()
    is_read = models.BooleanField(default=False)
    is_handled = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notification to {self.receiver.get_full_name} for Circle {self.sender.get_full_name}"

class Post(models.Model):
    VISIBILITY_CHOICES = [
        ('public', 'Public'),  # Visible to everyone
        ('circles', 'Circles'),  # Visible to the user's circles
        ('onlyme', 'OnlyMe'),  # Only visible to the author
    ]
    content = models.TextField()
    file = models.FileField(upload_to='posts/', null=True, blank=True)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='author_posts')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    like_count = models.PositiveIntegerField(default=0)
    visibility = models.CharField(max_length=20, choices=VISIBILITY_CHOICES, default='circles')
    circle = models.ForeignKey(Circles, on_delete=models.CASCADE, null=True, blank=True)
    shared = models.BooleanField(default=False)
    shared_owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True, related_name='shared_post')

    def __str__(self):
        return f"Post by {self.author.get_full_name} on {self.created_at.strftime('%b %d, %Y')}"

    def is_visible_to(self, user):
        if self.visibility == 'public':
            return True
        elif self.visibility == 'onlyme':
            return self.author == user
        elif self.visibility == 'circles' and self.circle:
            return user in self.circle.members.all()
        return False

    @property
    def author_profile_img(self):
        account = getattr(self.author, 'account', None)
        if account and account.profile_img:
            return account.profile_img.url  # Return the URL of the profile image
        return None

class Comment(models.Model):
    text = models.TextField()
    post = models.ForeignKey(Post, related_name='comments', on_delete=models.CASCADE)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    file = models.FileField(upload_to='posts/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    like_count = models.PositiveIntegerField(default=0)
    
    def __str__(self):
        #return f"{self.text} by {self.author.first_name} {self.author.last_name}"
        return f"Comment by {self.author.get_full_name} for {self.post.created_at.strftime('%b %d, %Y')}"

    @property
    def author_profile_img(self):
        account = getattr(self.author, 'account', None)
        if account and account.profile_img:
            return account.profile_img.url  # Return the URL of the profile image
        return None

class Like(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, related_name='likes', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'post')

    def __str__(self):
        return f'{self.post}'


#
# class Membership(models.Model):
#     PENDING = 'pending'
#     APPROVED = 'approved'
#     REJECTED = 'rejected'
#     STATUS_CHOICES = [
#         (PENDING, 'Pending'),
#         (APPROVED, 'Approved'),
#         (REJECTED, 'Rejected'),
#     ]
#     user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='memberships')
#     channel = models.ForeignKey(Channel, on_delete=models.CASCADE, related_name='memberships')
#     status = models.CharField(max_length=10, choices=STATUS_CHOICES, default=PENDING)
#     joined_at = models.DateTimeField(auto_now_add=True)
#
#     def __str__(self):
#         return f'{self.user.get_full_name} - {self.channel.name} ({self.status})'
#
#
# class Notification(models.Model):
#     user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
#     message = models.TextField()
#     is_read = models.BooleanField(default=False)
#     is_handled = models.BooleanField(default=False)
#     created_at = models.DateTimeField(auto_now_add=True)
#     membership = models.ForeignKey(Membership, on_delete=models.CASCADE, blank=True, null=True, related_name='notifications')
#
#     def __str__(self):
#         return f"Notification for {self.user.get_full_name}: {self.message[:50]}"