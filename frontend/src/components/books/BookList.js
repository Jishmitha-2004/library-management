import React, { useState, useEffect } from 'react';
 import {
  Container,
  Typography,
  Grid,
  Alert,
  Box,
  Pagination,
 } from '@mui/material';
 import BookCard from './BookCard';
 import BookSearch from './BookSearch';
 import LoadingSpinner from '../common/LoadingSpinner';
 import { booksAPI } from '../../services/api';
 const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useState({});
  const [page, setPage] = useState(1);
  const booksPerPage = 12;
  useEffect(() => {
    fetchBooks();
  }, [searchParams]);
  const fetchBooks = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await booksAPI.getAll(searchParams);
      setBooks(response.data);
    } catch (error) {
      setError('Error fetching books');
      console.error('Error:', error);
    }
    setLoading(false);
  };
  const handleSearch = (params) => {
    setSearchParams(params);
    setPage(1);
  };
  const handleClearSearch = () => {
    setSearchParams({});
    setPage(1);
  };
  const handleBorrow = (bookId) => {
    // Update the book's available copies locally
    setBooks(prevBooks =>
      prevBooks.map(book =>
        book.id === bookId
          ? { ...book, available_copies: book.available_copies - 1 }
          : book
      )
    );
  };
  // Pagination logic
  const totalPages = Math.ceil(books.length / booksPerPage);
  const startIndex = (page - 1) * booksPerPage;
  const displayedBooks = books.slice(startIndex, startIndex + booksPerPage);
  if (loading) {
    return <LoadingSpinner message="Loading books..." />;
  }
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Library Books
      </Typography>
      <BookSearch onSearch={handleSearch} onClear={handleClearSearch} />
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {books.length === 0 ? (
        <Box textAlign="center" sx={{ mt: 4 }}>

          <Typography variant="h6" color="text.secondary">
            No books found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search criteria
          </Typography>
        </Box>
      ) : (
        <>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Found {books.length} book{books.length !== 1 ? 's' : ''}
          </Typography>
          <Grid container spacing={3}>
            {displayedBooks.map((book) => (
              <Grid item xs={12} sm={6} md={4} key={book.id}>
                <BookCard book={book} onBorrow={handleBorrow} />
              </Grid>
            ))}
          </Grid>
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(e, newPage) => setPage(newPage)}
                color="primary"
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
 };
 export default BookList;