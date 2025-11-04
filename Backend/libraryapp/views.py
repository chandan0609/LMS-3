from rest_framework import viewsets
from django.shortcuts import render
from .models import User, Book, BorrowRecord, Category
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from .utils import send_due_notification
from django.utils import timezone
from .serializers import UserSerializer, BookSerializer, BorrowRecordSerializer, CategorySerializer
from rest_framework import filters
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.exceptions import ValidationError
from .permissions import IsAdminOrLibrarian
# Fixed UserViewSet - removed duplicate class definition
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
# for cuurent profile   
    @action(detail = False, methods = ['get'] , permission_classes = [IsAuthenticated])
    def me(self,request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data) 
    
    def get_permissions(self):
        if self.action == 'create':
            # Allow registration without authentication
            permission_classes = [AllowAny]
        elif self.action == 'list':
            permission_classes = [IsAdminUser]
        elif self.action in ['retrieve', 'update', 'partial_update','me']:
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]




class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    filter_backends = [filters.SearchFilter, DjangoFilterBackend, filters.OrderingFilter]
    search_fields = ['title', 'author', 'ISBN']
    filterset_fields = ['status', 'category']
    ordering_fields = ['title', 'author']
    permission_classes = [IsAdminOrLibrarian]



class BorrowRecordViewSet(viewsets.ModelViewSet):
    queryset = BorrowRecord.objects.all()
    serializer_class = BorrowRecordSerializer
    permission_classes = [IsAuthenticated]
    

    def get_serializer_context(self):
        """Pass request to serializer"""
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    
    def get_queryset(self):
        """Filter records based on user role"""
        user = self.request.user
        if user.role == 'admin' or user.role == 'librarian':
            return BorrowRecord.objects.all()
        return BorrowRecord.objects.filter(user=user)
    
    def perform_create(self, serializer):
        """Automatically set the user and update book status"""
        book = serializer.validated_data['book']
        if book.status != 'available':
            raise ValidationError("This book is not available for borrowing")
        
        # Create borrow record
        serializer.save(user=self.request.user)
        
        # Update book statusit
        book.status = 'borrowed'
        book.save()
    
    @action(detail=False, methods=['get'], permission_classes=[IsAdminUser])
    def check_due_books(self, request):
        """Send notifications for overdue books"""
        count = 0
        records = BorrowRecord.objects.filter(
            return_date__isnull=True,
            due_date__lte=timezone.now()
        )
        
        for record in records:
            user_email = record.user.email
            book_title = record.book.title
            due_date = record.due_date.strftime('%Y-%m-%d')
            send_due_notification(user_email, book_title, due_date)
            count += 1
        
        return Response({'message': f'Sent {count} notifications for overdue books'})
    
    @action(detail=True, methods=['post'])
    def return_book(self, request, pk=None):
        """Mark a book as returned"""
        borrow_record = self.get_object()
        
        if borrow_record.return_date:
            return Response({'error': 'Book already returned'}, status=400)
        
        # Update return date
        borrow_record.return_date = timezone.now()
        borrow_record.save()
        
        # Update book status
        book = borrow_record.book
        book.status = 'available'
        book.save()
        
        return Response({'message': 'Book returned successfully'})


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes=[IsAdminOrLibrarian]
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsAdminOrLibrarian]
        return [permission() for permission in permission_classes]