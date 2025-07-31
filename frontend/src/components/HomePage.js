import React from 'react';
 import { Link } from 'react-router-dom';
 import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
 } from '@mui/material';
 import {
  Book,
  Person,
  AdminPanelSettings,
  Search,
 } from '@mui/icons-material';
 import { useAuth } from '../context/AuthContext';
 const HomePage = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const features = [
    {
      icon: <Book sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Browse Books',
      description: 'Explore our extensive collection of books across various genres',
      action: 'Browse',
      link: '/books',
    },
    {
      icon: <Search sx={{ fontSize: 40, color: 'secondary.main' }} />,
      title: 'Search & Filter',
      description: 'Find books by title, author, or genre with our advanced search',
      action: 'Search',
      link: '/books',
    },
    {
      icon: <Person sx={{ fontSize: 40, color: 'success.main' }} />,
      title: 'User Dashboard',
      description: 'Track your borrowed books and due dates in one place',
      action: 'Dashboard',
      link: '/dashboard',
      requiresAuth: true,
    },
    {
      icon: <AdminPanelSettings sx={{ fontSize: 40, color: 'error.main' }} />,
      title: 'Admin Panel',
      description: 'Manage books, users, and borrowing records',
      action: 'Admin',
      link: '/admin',
      requiresAuth: true,
      adminOnly: true,
    },
  ];
  const visibleFeatures = features.filter(feature => {
    if (feature.adminOnly && !isAdmin) return false;
    if (feature.requiresAuth && !isAuthenticated) return false;
    return true;
  });
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Hero Section */}
      <Box textAlign="center" sx={{ mb: 8 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to Our Library
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Discover, borrow, and manage books with ease
        </Typography>
        
        {!isAuthenticated ? (
          <Box sx={{ mt: 4 }}>
            <Button
              variant="contained"
              size="large"
              component={Link}
              to="/register"
              sx={{ mr: 2 }}
            >
              Get Started
            </Button>
            <Button
              variant="outlined"
              size="large"
              component={Link}
              to="/login"
            >
              Login
            </Button>
          </Box>
        ) : (
          <Box sx={{ mt: 4 }}>
            <Button
              variant="contained"
              size="large"
              component={Link}
              to="/books"
              sx={{ mr: 2 }}
            >
              Browse Books
            </Button>
            <Button
              variant="outlined"
              size="large"
              component={Link}
              to="/dashboard"
            >
              My Dashboard
            </Button>
          </Box>
        )}
      </Box>
      {/* Features Section */}
      <Typography variant="h4" textAlign="center" gutterBottom sx={{ mb: 4 }}>
        Features
      </Typography>
      <Grid container spacing={4}>
        {visibleFeatures.map((feature, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <Box sx={{ mb: 2 }}>
                  {feature.icon}
                </Box>
                <Typography variant="h6" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                <Button
                  variant="contained"
                  component={Link}
                  to={feature.link}
                  size="small"
                >
                  {feature.action}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      {!isAuthenticated && (
        <Box sx={{ mt: 8, p: 4, backgroundColor: 'primary.main', borderRadius: 2 }}>
          <Typography variant="h5" textAlign="center" color="white" gutterBottom>
            Ready to Start?
          </Typography>
          <Typography variant="body1" textAlign="center" color="white" paragraph>
            Join our library today and get access to thousands of books
          </Typography>
          <Box textAlign="center">
            <Button
              variant="contained"
              color="secondary"
              size="large"
              component={Link}
              to="/register"
            >
              Register Now
            </Button>
          </Box>
        </Box>
      )}
    </Container>
  );

 };
 export default HomePage;