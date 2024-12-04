from django.db import models
from django.conf import settings
from django.contrib.auth import get_user_model

User = get_user_model()


class Topic(models.Model):
    PUBLIC = 'public'
    PRIVATE = 'private'
    STATUS_CHOICES = [
        (PUBLIC, 'Public'),
        (PRIVATE, 'Private'),
    ]
    topicTitle = models.CharField(max_length=255)
    topicDescription = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default=PRIVATE)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    
    def __str__(self):
        return self.topicTitle
class SubTopic(models.Model):
    subTopicTitle = models.CharField(max_length=255)
    topic = models.ForeignKey(Topic, related_name='subtopic', on_delete=models.CASCADE)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return self.subTopicTitle
class Post(models.Model):
    title = models.CharField(max_length=200, default='Post Title')
    content = models.TextField()
    # image = models.ImageField(upload_to='post/images/', null=True, blank=True)  # Store image
    # video = models.FileField(upload_to='post/videos/', null=True, blank=True)
    file = models.FileField(upload_to='posts/', null=True, blank=True)
    subtopic = models.ForeignKey(SubTopic, related_name='posts', on_delete=models.CASCADE, null=True, blank=True)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    like_count = models.PositiveIntegerField(default=0)

    def __str__(self):
        #return self.content
        #return f"{self.title} by {self.author.first_name} {self.author.last_name}"
        #return f"post by {self.content} created on {self.created_at.strftime('%b %d, %Y')}"
        subtopic_title = self.subtopic.subTopicTitle if self.subtopic else "No Subtopic"
        return f"Post by {self.author.get_full_name} at {subtopic_title} on {self.created_at.strftime('%b %d, %Y')}"

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
        return f"Comment by {self.author.get_full_name} for {self.post.author.get_full_name}'s {self.post.title} {self.post.created_at.strftime('%b %d, %Y')}"

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

class Membership(models.Model):
    PENDING = 'pending'
    APPROVED = 'approved'
    REJECTED = 'rejected'
    STATUS_CHOICES = [
        (PENDING, 'Pending'),
        (APPROVED, 'Approved'),
        (REJECTED, 'Rejected'),
    ]
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default=PENDING)
    joined_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f'{self.user.get_full_name} - {self.topic.topicTitle}'

class Notification(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    membership = models.ForeignKey(Membership, on_delete=models.CASCADE, blank=True, null=True)

    def __str__(self):
        return f"Notification for {self.user.first_name} {self.user.last_name}: {self.message[:50]}"