from django.urls import path
from . import views

urlpatterns = [
    path('register', views.register),
    path('login', views.login),
    path('getCategory', views.getCategory),
    path('todo', views.getToDo),
    path('displayTasks',views.displayTasks),
    path('deleteTask',views.deleteTask),
    path('updateTask',views.updateTask),
    path('logout',views.logout),
]
