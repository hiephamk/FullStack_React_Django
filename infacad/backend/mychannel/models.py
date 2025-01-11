from django.db import models
from django.conf import settings

class Channel(models.Model):
    PUBLIC = 'public'
    PRIVATE = 'private'
    STATUS_CHOICES = [
        (PUBLIC, 'Public'),
        (PRIVATE, 'Private'),
    ]
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='channels')
    channel_type = models.CharField(max_length=20, choices=STATUS_CHOICES, default=PRIVATE)

    def __str__(self):
        return self.name


class ChannelTopic(models.Model):
    channel = models.ForeignKey(Channel, on_delete=models.CASCADE, related_name='topics')
    topic_title = models.CharField(max_length=255)

    def __str__(self):
        return self.topic_title


class ChannelPost(models.Model):
    content = models.TextField()
    topic = models.ForeignKey(ChannelTopic, on_delete=models.CASCADE, related_name='posts')
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    file = models.FileField(upload_to='posts/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    like_count = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"Post by {self.owner.get_full_name} on {self.created_at.strftime('%b %d, %Y')}"

    @property
    def author_profile_img(self):
        account = getattr(self.owner, 'account', None)
        if account and account.profile_img:
            return account.profile_img.url
        return None


class ChannelComment(models.Model):
    text = models.TextField()
    post = models.ForeignKey(ChannelPost, related_name='comments', on_delete=models.CASCADE)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    file = models.FileField(upload_to='posts/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    like_count = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"Comment by {self.owner.get_full_name()} for {self.post.created_at.strftime('%b %d, %Y')}"


class Membership(models.Model):
    PENDING = 'pending'
    APPROVED = 'approved'
    REJECTED = 'rejected'
    STATUS_CHOICES = [
        (PENDING, 'Pending'),
        (APPROVED, 'Approved'),
        (REJECTED, 'Rejected'),
    ]
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='memberships')
    channel = models.ForeignKey(Channel, on_delete=models.CASCADE, related_name='memberships')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default=PENDING)
    joined_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.user.get_full_name} - {self.channel.name} ({self.status})'


class Notification(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    is_handled = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    membership = models.ForeignKey(Membership, on_delete=models.CASCADE, blank=True, null=True, related_name='notifications')

    def __str__(self):
        return f"Notification for {self.user.get_full_name}: {self.message[:50]}"
class ChannelLike(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    post = models.ForeignKey(ChannelPost, related_name='likes', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'post')

    def __str__(self):
        return f'{self.post}'