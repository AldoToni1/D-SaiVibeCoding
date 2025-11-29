import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { MenuProvider } from './contexts/MenuContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { CartProvider } from './contexts/cartcontext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './components/Login';
import { Register } from './components/Register';
import AdminDashboard from './components/AdminDashboard';
import { PublicMenu } from './components/PublicMenu';

export default function App() {
  const [authView, setAuthView] = useState<'login' | 'register'>('login');

  return (
    <AuthProvider>
      <LanguageProvider>
        <MenuProvider>
          <CartProvider>
            <Routes>
              {/* Public Menu Route - Initial Display */}
              <Route path="/public" element={<PublicMenu />} />

              {/* Auth Routes - Login & Register Page */}
              <Route
                path="/login"
                element={
                  authView === 'login' ? (
                    <Login onSwitchToRegister={() => setAuthView('register')} />
                  ) : (
                    <Register onSwitchToLogin={() => setAuthView('login')} />
                  )
                }
              />
              <Route path="/register" element={<Register onSwitchToLogin={() => setAuthView('login')} />} />

              {/* Protected Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Default route - redirect to public menu */}
              <Route path="/" element={<Navigate to="/public" replace />} />

              {/* Catch all - redirect to public menu */}
              <Route path="*" element={<Navigate to="/public" replace />} />
            </Routes>
          </CartProvider>
        </MenuProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}
