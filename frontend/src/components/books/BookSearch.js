import React, { useState, useEffect } from 'react';
 import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
 } from '@mui/material';
 import { Search, Clear } from '@mui/icons-material';
 import { booksAPI } from '../../services/api';
 const BookSearch = ({ onSearch, onClear }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [genres, setGenres] = useState([]);
  useEffect(() => {
    fetchGenres();
  }, []);
  const fetchGenres = async () => {
    try {
      const response = await booksAPI.getGenres();
      setGenres(response.data);
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };
  const handleSearch = () => {
    onSearch({
      search: searchTerm,
      genre: selectedGenre,
    });
  };
  const handleClear = () => {
    setSearchTerm('');
    setSelectedGenre('');
    onClear();
  };
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  return (
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={5}>
          <TextField
            fullWidth
            label="Search books..."
            placeholder="Enter title or author"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel>Genre</InputLabel>
            <Select
              value={selectedGenre}
              label="Genre"
              onChange={(e) => setSelectedGenre(e.target.value)}
            >
              <MenuItem value="">All Genres</MenuItem>
              {genres.map((genre) => (
                <MenuItem key={genre} value={genre}>
                  {genre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"

              startIcon={<Search />}
              onClick={handleSearch}
              fullWidth
            >
              Search
            </Button>
            <Button
              variant="outlined"
              startIcon={<Clear />}
              onClick={handleClear}
              fullWidth
            >
              Clear
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
 };
 export default BookSearch;