from django.urls import path
from .views import SimulateView, AskAIView, RegisterView, LoginView

urlpatterns = [
    path('simulate/', SimulateView.as_view(), name='simulate'),
    path('ask-ai/', AskAIView.as_view(), name='ask_ai'),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
]
