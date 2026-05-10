from django.urls import path
from .views import signup, login, logout, me, user_list

urlpatterns = [
    path('signup/',  signup),
    path('login/',   login),
    path('logout/',  logout),
    path('me/',      me),
    path('users/',   user_list),   # FIX: new — admin dashboard needs this
]
