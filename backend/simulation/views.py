from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes
from .pybamm_runner import run_simulation
from .aihelper import answer_query
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import make_password
import openai
import logging
import json
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.http import JsonResponse
from django.utils.decorators import method_decorator
from django.views import View
from openai import OpenAI
from openai import AuthenticationError, RateLimitError, OpenAIError
import time
from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib import messages
from django.core.mail import send_mail
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
# from .models import PasswordResetOTP
import json
import random
import os
from django.contrib.auth import get_user_model
User = get_user_model()




logger = logging.getLogger(__name__)
os.getenv("api_key")

class SimulateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        data = request.data
        try:
            result = run_simulation(data.get("battery_type"), data.get("params", {}),data.get("selected_model"))
            return Response(result)
        except Exception as e:
            import traceback
            traceback.print_exc()
            return Response({"error": str(e)}, status=500)


class RegisterView(APIView):
    def post(self, request):
        data = request.data
        try:
            user = User.objects.create(
                username=data['username'],
                email=data['email'],
                password=make_password(data['password'])
            )
            return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

# ✅ User Login (returns JWT)
class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)

        if user is not None:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


class RequestPasswordResetView(APIView):
    # permission_classes = [permissions.AllowAny]

    def post(self, request):
        gmail = request.data.get('username')  # or `request.data.get('email')`

        # if gmail:
        #     return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
        

        check=False
        for user in User.objects.all():
            if user.email == gmail:
                check=True
                break
        # if not check:
        #     return Response({'error': 'No account found with this email address'}, status=status.HTTP_404_NOT_FOUND)
        print("Email received:", gmail)
        start = 10**(5)
        end = (10**6) - 1
        otp=str(random.randint(start, end))
            # Generate new OTP
            # otp = PasswordResetOTP.generate_otp()
            
            # Save OTP to database
            # reset_otp = PasswordResetOTP.objects.create(
            #     user=user,
            #     otp=otp
            # )
            
            # Send OTP via email
        subject = 'Password Reset OTP'
        message = f'''
Hello,

You have requested to reset your password. Please use the following OTP to proceed:

OTP: {otp}

This OTP will expire in 10 minutes.

If you didn't request this, please ignore this email.

Best regards,
Your App Team
'''
        send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [gmail],
                fail_silently=False,
            )
        
        return Response({'message': 'User registered successfully'}, status=status.HTTP_200_OK)


       # class VerifyOTPView(View):
#     def get(self, request):
#         if 'reset_email' not in request.session:
#             messages.error(request, 'Please request password reset first')
#             return redirect('request_password_reset')
        
#         return render(request, 'password_reset/verify_otp.html')
    
#     def post(self, request):
#         if 'reset_email' not in request.session:
#             messages.error(request, 'Session expired. Please start again.')
#             return redirect('request_password_reset')
        
#         otp = request.POST.get('otp')
#         email = request.session['reset_email']
        
#         if not otp:
#             messages.error(request, 'OTP is required')
#             return render(request, 'password_reset/verify_otp.html')
        
#         try:
#             user = User.objects.get(email=email)
#             reset_otp = PasswordResetOTP.objects.get(
#                 user=user,
#                 otp=otp,
#                 is_used=False
#             )
            
#             if reset_otp.is_expired():
#                 messages.error(request, 'OTP has expired. Please request a new one.')
#                 return redirect('request_password_reset')
            
#             # Mark OTP as used
#             reset_otp.is_used = True
#             reset_otp.save()
            
#             # Store verification status in session
#             request.session['otp_verified'] = True
#             request.session['verified_user_id'] = user.id
            
#             messages.success(request, 'OTP verified successfully')
#             return redirect('reset_password')
            
#         except PasswordResetOTP.DoesNotExist:
#             messages.error(request, 'Invalid OTP')
#             return render(request, 'password_reset/verify_otp.html')

# class ResetPasswordView(View):
#     def get(self, request):
#         if not request.session.get('otp_verified'):
#             messages.error(request, 'Please verify OTP first')
#             return redirect('verify_otp')
        
#         return render(request, 'password_reset/reset_password.html')
    
#     def post(self, request):
#         if not request.session.get('otp_verified'):
#             messages.error(request, 'Session expired. Please start again.')
#             return redirect('request_password_reset')
        
#         new_password = request.POST.get('new_password')
#         confirm_password = request.POST.get('confirm_password')
        
#         if not new_password or not confirm_password:
#             messages.error(request, 'Both password fields are required')
#             return render(request, 'password_reset/reset_password.html')
        
#         if new_password != confirm_password:
#             messages.error(request, 'Passwords do not match')
#             return render(request, 'password_reset/reset_password.html')
        
#         if len(new_password) < 8:
#             messages.error(request, 'Password must be at least 8 characters long')
#             return render(request, 'password_reset/reset_password.html')
        
#         try:
#             user_id = request.session.get('verified_user_id')
#             user = User.objects.get(id=user_id)
            
#             # Set new password
#             user.set_password(new_password)
#             user.save()
            
#             # Clear session data
#             del request.session['reset_email']
#             del request.session['otp_verified']
#             del request.session['verified_user_id']
            
#             messages.success(request, 'Password reset successfully! You can now login with your new password.')
#             return redirect('login')  # Redirect to your login page
            
#         except User.DoesNotExist:
#             messages.error(request, 'User not found')
#             return redirect('request_password_reset')

@method_decorator(csrf_exempt, name='dispatch')
class ChatbotView(View):
    def post(self, request):
        try:
            # Parse the JSON data from request
            data = json.loads(request.body)
            user_message = data.get('message', '')
            conversation_history = data.get('history', [])
            
            if not user_message:
                return JsonResponse({
                    'error': 'Message is required'
                }, status=400)
            
            # Prepare messages for OpenAI API
            messages = []
            
            # Add system message (optional)
            messages.append({
                "role": "system",
                "content": "You are a helpful assistant."
            })
            
            # Add conversation history
            # for msg in conversation_history:
            #     messages.append({
            #         "role": msg.get('role', 'user'),
            #         "content": msg.get('content', '')
            #     })
            
            # Add current user message
            messages.append({
                "role": "user",
                "content": user_message
            })
            
            # Call OpenAI API
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",  # or "gpt-4" if you have access
                messages=messages,
                max_tokens=1000,
                temperature=0.7
            )
            print(response["choices"][0]["message"]["content"])

            time.sleep(10)  
            # Extract the assistant's response
            assistant_message = response.choices[0].message.content
            
            return JsonResponse({
                'response': assistant_message,
                'status': 'success'
            })
        
        except json.JSONDecodeError:
            return JsonResponse({
                'error': 'Invalid JSON format'
            }, status=400)
            
        except AuthenticationError:
            logger.error("OpenAI API authentication failed")
            return JsonResponse({
                'error': 'API authentication failed'
            }, status=401)
            
        except RateLimitError:
            logger.error("OpenAI API rate limit exceeded")
            return JsonResponse({
                'error': 'Rate limit exceeded. Please try again later.'
            }, status=429)
            
        except OpenAIError as e:
            logger.error(f"OpenAI API error: {str(e)}")
            return JsonResponse({
                'error': 'AI service temporarily unavailable'
            }, status=503)
            
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")
            return JsonResponse({
                'error': 'Internal server error'
            }, status=500)
    
    def get(self, request):
        return JsonResponse({
            'message': 'Chatbot API is running',
            'endpoints': {
                'POST /chat/': 'Send a message to the chatbot'
            }
        })


def home(request):
    return HttpResponse("Welcome to the Battery Simulation Backend!")


