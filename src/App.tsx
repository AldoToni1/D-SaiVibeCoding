import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './components/Login';
import { Register } from './components/Register';
import AdminDashboard from './components/AdminDashboard';

export default function App() {
  const [authView, setAuthView] = useState<'login' | 'register'>('login');

  return (
    <AuthProvider>
      <Routes>
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

        {/* Default route - redirect to admin */}
        <Route path="/" element={<Navigate to="/admin" replace />} />

        {/* Catch all - redirect to admin */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AuthProvider>
  );
}
