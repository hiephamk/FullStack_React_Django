from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views import View
from django import forms

class RegisterView(View):
    def post(self, request):
        username = request.POST.get('username')
        password = request.POST.get('password')

        if User.objects.filter(username=username).exists():
            return JsonResponse({"error": "This username is already taken."}, status=400)

        user = User.objects.create_user(username=username, password=password)
        return JsonResponse({"message": "User registered successfully"}, status=201)
