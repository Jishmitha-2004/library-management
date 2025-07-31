import React, { useState } from 'react';
 import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Grid,
 } from '@mui/material';
 import { booksAPI } from '../../services/api';
 const BookForm = ({ open, onClose, onSuccess, book = null }) => {
  const isEditing = !!book;
  
  const [formData, setFormData] = useState({
    title: book?.title || '',
    author: book?.author || '',
    genre: book?.genre || '',
    isbn: book?.isbn || '',
    total_copies: book?.total_copies || 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'total_copies' ? parseInt(value) || 0 : value,
    }));
    setError('');
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isEditing) {
        await booksAPI.update(book.id, formData);
      } else {
        await booksAPI.create(formData);
      }
      
      onSuccess();
    } catch (error) {
      setError(error.response?.data?.message || `Error ${isEditing ? 'updating' : 'adding'} book`);
    }
    setLoading(false);
  };
  const handleClose = () => {
    if (!loading) {
      setFormData({ title: '', author: '', genre: '', isbn: '', total_copies: 1 });
      setError('');
      onClose();
    }
  };
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isEditing ? 'Edit Book' : 'Add New Book'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Genre"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="ISBN"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Total Copies"
                name="total_copies"

                type="number"
                value={formData.total_copies}
                onChange={handleChange}
                required
                inputProps={{ min: 1 }}
                disabled={loading}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={20} />
            ) : (
              isEditing ? 'Update Book' : 'Add Book'
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
 };
 export default BookForm;