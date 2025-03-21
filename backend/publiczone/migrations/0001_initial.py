# Generated by Django 5.1.3 on 2025-01-25 14:58

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Publiczone',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('areas', models.CharField(blank=True, default='Global', max_length=255, null=True)),
                ('nations', models.CharField(blank=True, default='Global', max_length=255, null=True)),
                ('languages', models.CharField(blank=True, default='English', max_length=255, null=True)),
                ('topics', models.CharField(blank=True, default='General', max_length=255, null=True)),
                ('content', models.TextField()),
                ('media', models.FileField(blank=True, null=True, upload_to='posts/')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('content_owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='content_owner', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
