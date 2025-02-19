from django.db.models import Q
from django.db import models
from django.apps import apps


class PostManager(models.Manager):
    def get_visible_posts(self, user):
        Circles = apps.get_model('community', 'Circles')

        public_posts = Q(visibility='public')
        own_posts = Q(visibility='onlyme', author=user)
        intercircle_posts = Q(visibility='intercircles', author__inter_circle_owner__members=user)

        user_circles = Circles.objects.filter(members=user).distinct().values_list('circle_name', flat=True)
        circle_posts = Q(visibility__in=user_circles)

        return self.filter(public_posts | own_posts | intercircle_posts | circle_posts).distinct()
