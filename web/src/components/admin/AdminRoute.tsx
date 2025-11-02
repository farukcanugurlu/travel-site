// web/src/components/admin/AdminRoute.tsx
import React from 'react';
import authApiService from '../../api/auth';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const currentUser = authApiService.getCurrentUser();
  
  // Eğer kullanıcı giriş yapmamışsa erişim engellendi
  if (!currentUser) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <h1 style={{ color: 'red' }}>Access Denied</h1>
        <p>You must be logged in to access the admin panel.</p>
        <button onClick={() => window.location.href = '/login'} style={{ 
          padding: '10px 20px', 
          background: '#0162FD', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px',
          cursor: 'pointer'
        }}>
          Go to Login
        </button>
      </div>
    );
  }
  
  // Eğer kullanıcı admin değilse erişim engellendi
  if (currentUser.role !== 'ADMIN') {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <h1 style={{ color: 'red' }}>Access Denied</h1>
        <p>You do not have permission to access the admin panel.</p>
        <p style={{ color: 'gray' }}>Current role: {currentUser.role || 'None'}</p>
        <button onClick={() => window.location.href = '/'} style={{ 
          padding: '10px 20px', 
          background: '#0162FD', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px',
          cursor: 'pointer'
        }}>
          Go to Home
        </button>
      </div>
    );
  }
  
  // Kullanıcı admin ise erişim izni verildi
  return <>{children}</>;
};

export default AdminRoute;