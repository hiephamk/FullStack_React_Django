# forum/models.py
from django.db import models
from django.contrib.auth.models import User

class Post(models.Model):
    
    title = models.CharField(max_length=200)
    content = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        #return self.title
        return f"{self.title} by {self.author.username}"

class Comment(models.Model):
    text = models.TextField()
    post = models.ForeignKey(Post, related_name='comments', on_delete=models.CASCADE)
    author = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        #return self.text
        return f'Comment by {self.author.username}'

class Topic(models.Model):
    topic= models.CharField(max_length=200)
    content = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        #return self.title
        return f"{self.title} by {self.author.username}"