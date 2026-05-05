from django.shortcuts import render, redirect, get_object_or_404
from .models import Recipe
from .forms import RecipeForm


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