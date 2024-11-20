from django.db import models
from django.conf import settings


class Post(models.Model):
    #title = models.CharField(max_length=200)
    content = models.TextField()
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    like_count = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.content
        #return f"{self.title} by {self.author.first_name} {self.author.last_name}"
        #return f"post by {self.content} created on {self.created_at.strftime('%b %d, %Y')}"
        #return f"Post by {self.author.get_full_name()} on {self.created_at.strftime('%b %d, %Y')}"

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
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    like_count = models.PositiveIntegerField(default=0)
    
    def __str__(self):
        #return f"{self.text} by {self.author.first_name} {self.author.last_name}"
        #return f"Post by {self.author.get_full_name()} on {self.created_at.strftime('%b %d, %Y')}"
        return self.text

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