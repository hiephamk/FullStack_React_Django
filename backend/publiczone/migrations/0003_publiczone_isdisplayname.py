# Generated by Django 5.1.3 on 2025-01-25 15:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('publiczone', '0002_publiczone_display_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='publiczone',
            name='isDisplayName',
            field=models.BooleanField(default=False),
        ),
    ]
