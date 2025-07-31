import React from 'react';
 import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
 import { ThemeProvider } from '@mui/material/styles';
 import { CssBaseline, Box } from '@mui/material';
 import theme from './styles/theme';
 import { AuthProvider } from './context/AuthContext';
 // Components
 import Header from './components/common/Header';
 import ProtectedRoute from './components/auth/ProtectedRoute';
 import Login from './components/auth/Login';
 import Register from './components/auth/Register';
 import BookList from './components/books/BookList';
 import UserDashboard from './components/user/UserDashboard';
 import AdminDashboard from './components/admin/AdminDashboard';
 import HomePage from './components/HomePage';
 // Import CSS
 import './App.css';
 function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />
            
            <Box component="main" sx={{ flexGrow: 1, backgroundColor: 'background.default' }}>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/books" element={<BookList />} />
                {/* Protected user routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <UserDashboard />

                    </ProtectedRoute>
                  }
                />
                {/* Protected admin routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute adminOnly>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                {/* Catch all route */}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Box>
          </Box>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
 }
 export default App;