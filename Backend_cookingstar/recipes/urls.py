from django.urls import path
from . import views

urlpatterns = [
    path('create/', views.create_recipe, name='create_recipe'),
    path('edit/<int:id>/', views.edit_recipe, name='edit_recipe'),
    path('search/', views.search_recipes, name='search_recipes'),
    path('delete/<int:id>/', views.delete_recipe, name='delete_recipe'),
    path('', views.recipe_list, name='recipe_list'),
]