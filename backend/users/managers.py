from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.base_user import BaseUserManager
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.utils.translation import gettext_lazy as _

class AccountManager(BaseUserManager):
    def email_validator(self, email):
        try: 
            validate_email(email)
        except ValidationError:
            raise ValueError(_("You must provide a valid email"))
    
    def create_user(self, first_name, last_name, email, password, **extra_fields):
        if not first_name:
            raise ValueError(_("User must submit a first name"))
        if not first_name:
            raise ValueError(_("User must submit a first name"))

        if email:
            email = self.normalize_email(email)
            self.email_validator(email)
        else:
            raise ValueError('Base User: and email is a required field')
        user = self.model(
            first_name = first_name,
            last_name = last_name,
            email=email, 
            **extra_fields
            )
            
        user.set_password(password)
        user.save()
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_student', False)
        extra_fields.setdefault('is_superuser', False)
        return user
    
    def create_superuser(self, first_name, last_name, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('is_student', True)
        
        if extra_fields.get("is_superuser") is not True:
            raise ValidationError(_("Superuser must have is_superuser=True"))
        if extra_fields.get("is_staff") is not True:
            raise ValidationError(_("Superuser must have is_staff=True"))
        if extra_fields.get("is_student") is not True:
            raise ValidationError(_("Superuser must have is_student=True"))
        if not password:
            raise ValidationError(_("Superusers must have a password"))

        if email:
            email = self.normalize_email(email)
            self.email_validator(email)
        else:
            raise ValueError('Admin User: and email is a required field')
            
        user = self.create_user(first_name, last_name, email, password, **extra_fields)
        user.save()
        return user
