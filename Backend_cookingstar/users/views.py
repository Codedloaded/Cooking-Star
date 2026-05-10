from django.contrib.auth import authenticate
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import User, AuthToken
import uuid


# ── Token helpers ──────────────────────────────────────────────────────────────

def _make_token(user):
    """Create a new DB-persisted token for user and return the token string."""
    token = str(uuid.uuid4())
    AuthToken.objects.create(user=user, token=token)
    return token


def _get_user_from_token(request):
    """Read Authorization: Bearer <token> header and return the matching User or None."""
    auth = request.headers.get('Authorization', '')
    if not auth.startswith('Bearer '):
        return None
    token_str = auth.split(' ', 1)[1].strip()
    try:
        auth_token = AuthToken.objects.select_related('user').get(token=token_str)
        return auth_token.user
    except AuthToken.DoesNotExist:
        return None


# ── POST /api/signup/ ─────────────────────────────────────────────────────────
# Body: { username, email, password, role, firstName, lastName, gender }

@api_view(['POST'])
def signup(request):
    username   = request.data.get('username',  '').strip()
    email      = request.data.get('email',     '').strip()
    password   = request.data.get('password',  '')
    role       = request.data.get('role',      'user')   # "user" | "admin"
    first_name = request.data.get('firstName', '').strip()
    last_name  = request.data.get('lastName',  '').strip()
    gender     = request.data.get('gender',    '').strip()  # FIX: was ignored before

    if not username or not email or not password:
        return Response({'error': 'All fields required'}, status=400)

    if len(password) < 6:
        return Response({'error': 'Password must be at least 6 characters'}, status=400)

    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists'}, status=400)

    if User.objects.filter(email=email).exists():
        return Response({'error': 'Email already registered'}, status=400)

    is_admin = (role == 'admin')

    user = User.objects.create_user(       # FIX: use create_user() — it hashes the password properly
        username   = username,
        email      = email,
        password   = password,
        first_name = first_name,
        last_name  = last_name,
        is_staff   = is_admin,
        gender     = gender or None,
    )

    token = _make_token(user)

    return Response({
        'message':   'User created successfully',
        'token':     token,
        'username':  user.username,
        'firstName': user.first_name,
        'email':     user.email,
        'role':      role,
        'isAdmin':   is_admin,
    }, status=201)


# ── POST /api/login/ ──────────────────────────────────────────────────────────
# Body: { email, password }

@api_view(['POST'])
def login(request):
    email    = request.data.get('email',    '').strip()
    password = request.data.get('password', '')

    if not email or not password:
        return Response({'error': 'Email and password required'}, status=400)

    # FIX: find user by email first, then authenticate by username
    user_obj = User.objects.filter(email=email).first()
    if not user_obj:
        return Response({'error': 'No account found with that email'}, status=404)

    user = authenticate(username=user_obj.username, password=password)
    if user is None:
        return Response({'error': 'Incorrect password'}, status=401)

    token    = _make_token(user)
    is_admin = user.is_staff

    return Response({
        'message':   'Login successful',
        'token':     token,
        'username':  user.username,
        'firstName': user.first_name,
        'email':     user.email,
        'role':      'admin' if is_admin else 'user',
        'isAdmin':   is_admin,
    })


# ── POST /api/logout/ ─────────────────────────────────────────────────────────
# Header: Authorization: Bearer <token>

@api_view(['POST'])
def logout(request):
    auth = request.headers.get('Authorization', '')
    if not auth.startswith('Bearer '):
        return Response({'error': 'No token provided'}, status=400)

    token_str = auth.split(' ', 1)[1].strip()
    deleted, _ = AuthToken.objects.filter(token=token_str).delete()

    if deleted:
        return Response({'message': 'Logged out successfully'})
    return Response({'error': 'Invalid or expired token'}, status=400)


# ── GET /api/me/ ─────────────────────────────────────────────────────────────
# Header: Authorization: Bearer <token>

@api_view(['GET'])
def me(request):
    user = _get_user_from_token(request)
    if user is None:
        return Response({'error': 'Unauthorized'}, status=401)

    return Response({
        'username':  user.username,
        'firstName': user.first_name,
        'email':     user.email,
        'role':      'admin' if user.is_staff else 'user',
        'isAdmin':   user.is_staff,
    })


# ── GET /api/users/ ───────────────────────────────────────────────────────────
# Admin only — returns user list for the admin dashboard stats

@api_view(['GET'])
def user_list(request):
    user = _get_user_from_token(request)
    if user is None or not user.is_staff:
        return Response({'error': 'Admin access required'}, status=403)

    users = User.objects.values('id', 'username', 'email', 'first_name', 'last_name', 'is_staff', 'date_joined')
    return Response(list(users))
