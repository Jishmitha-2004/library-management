import React, { useState } from 'react';
 import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  Alert,
  CircularProgress,
 } from '@mui/material';
 import { Book, Person, Category } from '@mui/icons-material';
 import { useAuth } from '../../context/AuthContext';
 import { borrowsAPI } from '../../services/api';
 const BookCard = ({ book, onBorrow, showBorrowButton = true }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const handleBorrow = async () => {
    setLoading(true);
    setMessage('');
    try {
      await borrowsAPI.borrowBook(book.id);
      setMessage('Book borrowed successfully!');
      if (onBorrow) {
        onBorrow(book.id);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error borrowing book');
    }
    setLoading(false);
  };
  const canBorrow = isAuthenticated && !isAdmin && book.available_copies > 0;
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          {book.title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Person sx={{ mr: 1, fontSize: 16 }} />
          <Typography variant="body2" color="text.secondary">
            {book.author}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Category sx={{ mr: 1, fontSize: 16 }} />
          <Chip 
            label={book.genre} 
            size="small" 
            color="primary" 
            variant="outlined" 
          />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2">
            <strong>Total Copies:</strong> {book.total_copies}
          </Typography>
          <Typography variant="body2">
            <strong>Available:</strong> {book.available_copies}
          </Typography>
        </Box>
        {book.isbn && (
          <Typography variant="body2" color="text.secondary">
            <strong>ISBN:</strong> {book.isbn}
          </Typography>
        )}
        {message && (
          <Alert 
            severity={message.includes('Error') ? 'error' : 'success'} 
            sx={{ mt: 2 }}
          >
            {message}
          </Alert>
        )}

      </CardContent>
      {showBorrowButton && (
        <CardActions>
          {!isAuthenticated ? (
            <Typography variant="body2" color="text.secondary">
              Login to borrow books
            </Typography>
          ) : canBorrow ? (
            <Button
              size="small"
              variant="contained"
              onClick={handleBorrow}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={16} /> : <Book />}
            >
              {loading ? 'Borrowing...' : 'Borrow Book'}
            </Button>
          ) : (
            <Typography 
              variant="body2" 
              color={book.available_copies === 0 ? 'error' : 'text.secondary'}
            >
              {book.available_copies === 0 ? 'Not Available' : 'Cannot Borrow'}
            </Typography>
          )}
        </CardActions>
      )}
    </Card>
  );
 };
 export default BookCard;