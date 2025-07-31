import React, { useState, useEffect } from 'react';
 import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Alert,
 } from '@mui/material';
 import { Book, Schedule, Warning } from '@mui/icons-material';
 import { useAuth } from '../../context/AuthContext';
 import { borrowsAPI } from '../../services/api';
 import MyBorrows from './MyBorrows';
 import LoadingSpinner from '../common/LoadingSpinner';
 const UserDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalBorrowed: 0,
    currentlyBorrowed: 0,
    overdue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    fetchUserStats();
  }, []);
  const fetchUserStats = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await borrowsAPI.getMyBorrows();
      const borrows = response.data;
      const currentDate = new Date();
      const stats = {
        totalBorrowed: borrows.length,
        currentlyBorrowed: borrows.filter(b => b.status === 'borrowed').length,
        overdue: borrows.filter(b => 
          b.status === 'borrowed' && new Date(b.due_date) < currentDate
        ).length,
      };
      setStats(stats);
    } catch (error) {
      setError('Error fetching user statistics');
      console.error('Error:', error);
    }
    setLoading(false);
  };
  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Welcome back, {user?.username}!
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Book sx={{ mr: 2, fontSize: 40, color: 'primary.main' }} />
                <Box>
                  <Typography variant="h4" component="div">
                    {stats.totalBorrowed}
                  </Typography>
                  <Typography color="text.secondary">
                    Total Books Borrowed
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Schedule sx={{ mr: 2, fontSize: 40, color: 'info.main' }} />
                <Box>
                  <Typography variant="h4" component="div">
                    {stats.currentlyBorrowed}
                  </Typography>
                  <Typography color="text.secondary">
                    Currently Borrowed
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Warning sx={{ mr: 2, fontSize: 40, color: 'error.main' }} />
                <Box>
                  <Typography variant="h4" component="div" color="error.main">
                    {stats.overdue}
                  </Typography>
                  <Typography color="text.secondary">
                    Overdue Books
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      {/* My Borrowed Books Section */}
      <MyBorrows onUpdate={fetchUserStats} />

    </Container>
  );
 };
 export default UserDashboard;