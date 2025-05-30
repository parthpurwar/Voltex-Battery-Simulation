from django.urls import path
from . import views

urlpatterns = [
    path("simulate/", views.simulate),
    path("ask-ai/", views.ask_ai),
]
