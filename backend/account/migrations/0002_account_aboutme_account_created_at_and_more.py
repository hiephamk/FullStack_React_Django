# Generated by Django 5.1.3 on 2024-11-23 21:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("account", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="account",
            name="aboutMe",
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="account",
            name="created_at",
            field=models.DateTimeField(auto_now_add=True, null=True),
        ),
        migrations.AddField(
            model_name="account",
            name="updated_at",
            field=models.DateTimeField(auto_now=True, null=True),
        ),
    ]
