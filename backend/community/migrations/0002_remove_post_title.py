# Generated by Django 5.1.3 on 2024-11-11 16:23

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("community", "0001_initial"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="post",
            name="title",
        ),
    ]
