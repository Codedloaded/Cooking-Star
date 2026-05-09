"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('users.urls')),
    path('recipes/', include('recipes.urls')),   
    path('users/', include('users.urls')), 
    path('', TemplateView.as_view(template_name='index.html')),
    path('login/', TemplateView.as_view(template_name='login.html')),
    path('signup/', TemplateView.as_view(template_name='signup.html')),
    path('user-dashboard/', TemplateView.as_view(template_name='user-dashboard.html')),
    path('admin-dashboard/', TemplateView.as_view(template_name='admin.html')),
    path('recipes-list/', TemplateView.as_view(template_name='recipes-list.html')),
    path('favorites/', TemplateView.as_view(template_name='favorites.html')),
    path('search/', TemplateView.as_view(template_name='search-results.html')), 
]
