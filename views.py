from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from .utils import analyze_resume

class RegisterView(APIView):
    def post(self, request):
        try:
            username = request.data.get('username')
            password = request.data.get('password')
            if not username or not password:
                return Response({'error': 'Please provide username and password'}, status=status.HTTP_400_BAD_REQUEST)
            if User.objects.filter(username=username).exists():
                return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)
            
            user = User.objects.create_user(username=username, password=password)
            token, _ = Token.objects.get_or_create(user=user)
            return Response({'token': token.key, 'username': user.username}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            request.user.auth_token.delete()
            return Response({'message': 'Logged out successfully'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class AnalyzeResumeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            resume_file = request.FILES.get('resume')
            job_description = request.data.get('job_description')
            job_role = request.data.get('job_role') # Exact user-selected role

            print(f"[DEBUG] API Received - Role: {job_role}, JD Length: {len(job_description) if job_description else 0}")

            if not resume_file:
                return Response({"error": "No resume file uploaded"}, status=status.HTTP_400_BAD_REQUEST)
            if not job_description:
                return Response({"error": "Job description is empty"}, status=status.HTTP_400_BAD_REQUEST)

            result, error = analyze_resume(resume_file, job_description, job_role)

            if error:
                print(f"Analysis error: {error}")
                return Response({"error": error}, status=status.HTTP_400_BAD_REQUEST)

            return Response(result, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"System Error: {str(e)}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
