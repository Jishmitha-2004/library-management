import React, { useState, useEffect } from 'react';
 import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Button,
  Alert,
  Tabs,
  Tab,
 } from '@mui/material';
 import {
  Book,
  People,
  Schedule,
  Warning,
  Add,
 } from '@mui/icons-material';
 import { booksAPI, borrowsAPI } from '../../services/api';
 import BookForm from './BookForm';
 import BorrowManagement from './BorrowManagement';
 import LoadingSpinner from '../common/LoadingSpinner';
 const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalBorrows: 0,
    activeBorrows: 0,
    overdueBooks: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showBookForm, setShowBookForm] = useState(false);
  useEffect(() => {
    fetchAdminStats();
  }, []);
  const fetchAdminStats = async () => {
    setLoading(true);
    setError('');
    try {
      const [booksResponse, borrowsResponse, overdueResponse] = await Promise.all([
        booksAPI.getAll(),
        borrowsAPI.getAllBorrows(),
        borrowsAPI.getOverdue(),
      ]);
      const books = booksResponse.data;
      const borrows = borrowsResponse.data;
      const overdue = overdueResponse.data;
      setStats({
        totalBooks: books.length,
        totalBorrows: borrows.length,
        activeBorrows: borrows.filter(b => b.status === 'borrowed').length,
        overdueBooks: overdue.length,
      });
    } catch (error) {
      setError('Error fetching admin statistics');
      console.error('Error:', error);
    }
    setLoading(false);
  };
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  if (loading) {
    return <LoadingSpinner message="Loading admin dashboard..." />;
  }
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">
          Admin Dashboard
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setShowBookForm(true)}
        >
          Add New Book
        </Button>
      </Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Book sx={{ mr: 2, fontSize: 40, color: 'primary.main' }} />
                <Box>
                  <Typography variant="h4" component="div">
                    {stats.totalBooks}
                  </Typography>
                  <Typography color="text.secondary">
                    Total Books
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <People sx={{ mr: 2, fontSize: 40, color: 'info.main' }} />
                <Box>
                  <Typography variant="h4" component="div">
                    {stats.totalBorrows}
                  </Typography>
                  <Typography color="text.secondary">
                    Total Borrows
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Schedule sx={{ mr: 2, fontSize: 40, color: 'success.main' }} />
                <Box>
                  <Typography variant="h4" component="div">
                    {stats.activeBorrows}
                  </Typography>
                  <Typography color="text.secondary">
                    Active Borrows
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Warning sx={{ mr: 2, fontSize: 40, color: 'error.main' }} />
                <Box>
                  <Typography variant="h4" component="div" color="error.main">
                    {stats.overdueBooks}
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
      {/* Tabs for different admin sections */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Borrow Management" />
          <Tab label="Book Management" />
        </Tabs>
      </Box>
      {/* Tab Panels */}
      {activeTab === 0 && <BorrowManagement onUpdate={fetchAdminStats} />}
      {activeTab === 1 && (
        <BookManagement onUpdate={fetchAdminStats} onAddBook={() => setShowBookForm(true)} />
      )}
      {/* Book Form Dialog */}
      <BookForm
        open={showBookForm}
        onClose={() => setShowBookForm(false)}
        onSuccess={() => {
          setShowBookForm(false);
          fetchAdminStats();
        }}
      />
    </Container>
  );
 };
 // Book Management Component
 const BookManagement = ({ onUpdate, onAddBook }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    fetchBooks();
  }, []);
  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await booksAPI.getAll();
      setBooks(response.data);
    } catch (error) {
      setError('Error fetching books');
    }
    setLoading(false);
  };
  const handleDeleteBook = async (bookId) => {
    try {
      await booksAPI.delete(bookId);
      fetchBooks();
      onUpdate();
    } catch (error) {
      setError(error.response?.data?.message || 'Error deleting book');
    }
  };
  if (loading) return <LoadingSpinner />;
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">All Books</Typography>
        <Button variant="contained" onClick={onAddBook} startIcon={<Add />}>
          Add Book
        </Button>
      </Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Grid container spacing={2}>
        {books.map((book) => (
          <Grid item xs={12} sm={6} md={4} key={book.id}>
            <BookCard 
              book={book} 
              showBorrowButton={false}
              showAdminActions={true}
              onDelete={() => handleDeleteBook(book.id)}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
 };
 export default AdminDashboard;
