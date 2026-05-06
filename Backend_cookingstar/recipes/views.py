from django.shortcuts import render, redirect, get_object_or_404
from .models import Recipe
from .forms import RecipeForm
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import RecipeSerializer


def create_recipe(request):
    if request.method == 'POST':
        form = RecipeForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return redirect('create_recipe')  # change if you have list page
    else:
        form = RecipeForm()
    
    return render(request, 'recipes/create.html', {'form': form})


def edit_recipe(request, id):
    recipe = get_object_or_404(Recipe, id=id)

    if request.method == 'POST':
        form = RecipeForm(request.POST, request.FILES, instance=recipe)
        if form.is_valid():
            form.save()
            return redirect('create_recipe')  # or your main page
    else:
        form = RecipeForm(instance=recipe)

    return render(request, 'recipes/edit.html', {'form': form})

@api_view(['GET'])
def search_recipes(request):
    query = request.GET.get('q', '')
    filter_by = request.GET.get('filter', '')
    recipes = Recipe.objects.all()
    if query:
        recipes = recipes.filter(title__icontains=query) | recipes.filter(ingredients__icontains=query)
    if filter_by:
        recipes = recipes.filter(title__icontains=filter_by)
    serializer = RecipeSerializer(recipes, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)