from rest_framework.permissions import BasePermission

class IsAdminOrLibrarian(BasePermission):
    """
    Custom permission to allow only admins and librarians to modify books.
    """

    def has_permission(self, request, view):
        # Safe methods (GET, HEAD, OPTIONS) allowed for all authenticated users
        if request.method in ('GET', 'HEAD', 'OPTIONS'):
            return request.user and request.user.is_authenticated
        
        # Write methods allowed for admins and librarians
        return (
            request.user
            and request.user.is_authenticated
            and getattr(request.user, 'role', None) in ['admin', 'librarian']
        )
