from django.contrib.auth import authenticate
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import User
from django.contrib.auth.hashers import make_password

@api_view(['POST'])
def signup(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')

    if not username or not email or not password:
        return Response({"error": "All fields required"}, status=400)

    #check if user exists
    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already exists"}, status=400)

    user = User.objects.create(
        username=username,
        email=email,
        password=make_password(password)
    )

    return Response({"message": "User created successfully"})

@api_view(['POST'])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        return Response({"error": "Email and password required"}, status=400)

    user_obj = User.objects.filter(email=email).first()

    if not user_obj:
        return Response({"error": "User not found"}, status=400)

    user = authenticate(username=user_obj.username, password=password)

    if user is not None:
        return Response({
            "message": "Login successful",
            "username": user.username
        })
    else:
        return Response({"error": "Invalid credentials"}, status=400)
