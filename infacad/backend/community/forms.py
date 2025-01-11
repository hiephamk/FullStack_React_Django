from django import forms
from .models import Post, Circles

class PostForm(forms.ModelForm):
    class Meta:
        model = Post
        fields = ['content', 'file', 'visibility']

    def __init__(self, *args, **kwargs):
        user = kwargs.pop('user')  # Pass the user when initializing the form
        super().__init__(*args, **kwargs)
        circles = Circles.objects.filter(owner=user)
        circle_choices = [(circle.circle_name, circle.circle_name) for circle in circles]
        visibility_choices = [
            ('public', 'Public'),
            ('intercircles', 'InterCircles'),
            ('onlyme', 'Only Me'),
        ] + circle_choices
        self.fields['visibility'].choices = visibility_choices
