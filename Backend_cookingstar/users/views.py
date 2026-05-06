from django.contrib.auth import authenticate
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import User
from django.contrib.auth.hashers import make_password
import uuid

# Simple in-memory token store  {token: user_id}
# For production, use a database model or Django REST Knox / JWT instead
active_tokens = {}


def _make_token(user_id):
    token = str(uuid.uuid4())
    active_tokens[token] = user_id
    return token


def _get_user_from_token(request):
    auth = request.headers.get("Authorization", "")
    if not auth.startswith("Bearer "):
        return None
    token = auth.split(" ", 1)[1]
    user_id = active_tokens.get(token)
    if user_id is None:
        return None
    try:
        return User.objects.get(pk=user_id)
    except User.DoesNotExist:
        return None


# ─────────────────────────────────────────────
# POST /api/signup/
# Body: { username, email, password, role, firstName, lastName, gender }
# ─────────────────────────────────────────────
@api_view(['POST'])
def signup(request):
    username   = request.data.get('username', '').strip()
    email      = request.data.get('email', '').strip()
    password   = request.data.get('password', '')
    role       = request.data.get('role', 'user')          # "user" | "admin"
    first_name = request.data.get('firstName', '').strip()
    last_name  = request.data.get('lastName', '').strip()

    if not username or not email or not password:
        return Response({"error": "All fields required"}, status=400)

    if len(password) < 6:
        return Response({"error": "Password must be at least 6 characters"}, status=400)

    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already exists"}, status=400)

    if User.objects.filter(email=email).exists():
        return Response({"error": "Email already registered"}, status=400)

    is_admin = role == 'admin'

    user = User.objects.create(
        username   = username,
        email      = email,
        password   = make_password(password),
        first_name = first_name,
        last_name  = last_name,
        is_staff   = is_admin,   # Django's built-in staff flag marks admins
    )

    token = _make_token(user.id)

    return Response({
        "message":   "User created successfully",
        "token":     token,
        "username":  user.username,
        "firstName": user.first_name,
        "email":     user.email,
        "role":      role,
        "isAdmin":   is_admin,
    }, status=201)


# ─────────────────────────────────────────────
# POST /api/login/
# Body: { email, password }
# ─────────────────────────────────────────────
@api_view(['POST'])
def login(request):
    email    = request.data.get('email', '').strip()
    password = request.data.get('password', '')

    if not email or not password:
        return Response({"error": "Email and password required"}, status=400)

    user_obj = User.objects.filter(email=email).first()
    if not user_obj:
        return Response({"error": "User not found"}, status=404)

    user = authenticate(username=user_obj.username, password=password)
    if user is None:
        return Response({"error": "Invalid credentials"}, status=401)

    token    = _make_token(user.id)
    is_admin = user.is_staff

    return Response({
        "message":   "Login successful",
        "token":     token,
        "username":  user.username,
        "firstName": user.first_name,
        "email":     user.email,
        "role":      "admin" if is_admin else "user",
        "isAdmin":   is_admin,
    })


# ─────────────────────────────────────────────
# POST /api/logout/
# Header: Authorization: Bearer <token>
# ─────────────────────────────────────────────
@api_view(['POST'])
def logout(request):
    auth = request.headers.get("Authorization", "")
    if not auth.startswith("Bearer "):
        return Response({"error": "No token provided"}, status=400)

    token = auth.split(" ", 1)[1]
    if token in active_tokens:
        del active_tokens[token]
        return Response({"message": "Logged out successfully"})

    return Response({"error": "Invalid or expired token"}, status=400)


# ─────────────────────────────────────────────
# GET /api/me/
# Header: Authorization: Bearer <token>
# Returns current user info + role — useful for
# any page that needs to verify the session
# ─────────────────────────────────────────────
@api_view(['GET'])
def me(request):
    user = _get_user_from_token(request)
    if user is None:
        return Response({"error": "Unauthorized"}, status=401)

    return Response({
        "username":  user.username,
        "firstName": user.first_name,
        "email":     user.email,
        "role":      "admin" if user.is_staff else "user",
        "isAdmin":   user.is_staff,
    })