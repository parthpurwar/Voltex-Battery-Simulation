from django.urls import path
from .views import SimulateView, RegisterView, LoginView,ChatbotView, RequestPasswordResetView

urlpatterns = [
    path('simulate/', SimulateView.as_view(), name='simulate'),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('chat/', ChatbotView.as_view(), name='chatbot'),
    path('request-password-reset-otp/', RequestPasswordResetView.as_view(), name='request_password_reset'),
    # path('verify-otp/', VerifyOTPView.as_view(), name='verify_otp'),
    # path('reset-password/', ResetPasswordView.as_view(), name='reset_password'),
]
