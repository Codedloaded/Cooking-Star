from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Recipe
from .serializers import RecipeSerializer
from users.models import AuthToken


# ── Auth helper (same pattern as users/views.py) ──────────────────────────────

def _get_user_from_token(request):
    auth = request.headers.get('Authorization', '')
    if not auth.startswith('Bearer '):
        return None
    token_str = auth.split(' ', 1)[1].strip()
    try:
        return AuthToken.objects.select_related('user').get(token=token_str).user
    except AuthToken.DoesNotExist:
        return None


# ── GET  /api/recipes/        — list all recipes
# ── POST /api/recipes/        — create a recipe (auth required)

@api_view(['GET', 'POST'])
def recipe_list(request):

    if request.method == 'GET':
        # Public — anyone can browse recipes
        search = request.query_params.get('search', '').strip()
        course = request.query_params.get('course', '').strip()

        qs = Recipe.objects.all().order_by('-created_at')
        if search:
            qs = qs.filter(title__icontains=search)
        if course:
            qs = qs.filter(course__iexact=course)

        serializer = RecipeSerializer(qs, many=True, context={'request': request})
        return Response(serializer.data)

    # POST — must be logged in
    user = _get_user_from_token(request)
    if user is None:
        return Response({'error': 'Authentication required'}, status=401)

    serializer = RecipeSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save(author=user)
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


# ── GET    /api/recipes/<id>/  — retrieve one recipe
# ── PUT    /api/recipes/<id>/  — update (owner or admin)
# ── DELETE /api/recipes/<id>/  — delete (owner or admin)

@api_view(['GET', 'PUT', 'DELETE'])
def recipe_detail(request, pk):
    recipe = get_object_or_404(Recipe, pk=pk)

    if request.method == 'GET':
        serializer = RecipeSerializer(recipe, context={'request': request})
        return Response(serializer.data)

    # Write operations require auth
    user = _get_user_from_token(request)
    if user is None:
        return Response({'error': 'Authentication required'}, status=401)

    # Only the author or an admin can edit/delete
    if recipe.author != user and not user.is_staff:
        return Response({'error': 'Permission denied'}, status=403)

    if request.method == 'PUT':
        serializer = RecipeSerializer(recipe, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    # DELETE
    recipe.delete()
    return Response({'message': 'Recipe deleted'}, status=204)


# ── GET /api/recipes/stats/  — admin dashboard counts

@api_view(['GET'])
def recipe_stats(request):
    user = _get_user_from_token(request)
    if user is None or not user.is_staff:
        return Response({'error': 'Admin access required'}, status=403)

    from users.models import User
    return Response({
        'total_recipes': Recipe.objects.count(),
        'total_users':   User.objects.count(),
    })
