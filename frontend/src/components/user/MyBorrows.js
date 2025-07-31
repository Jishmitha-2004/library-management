import React, { useState, useEffect } from 'react';
 import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  Alert,
  Box,
  CircularProgress,
 } from '@mui/material';
 import UndoIcon from '@mui/icons-material/Undo';
 import { borrowsAPI } from '../../services/api';
 import { formatDate, getDaysUntilDue } from '../../utils/helpers';
 import ConfirmDialog from '../common/ConfirmDialog';
 import LoadingSpinner from '../common/LoadingSpinner';
 const MyBorrows = ({ onUpdate }) => {
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [returnDialog, setReturnDialog] = useState({ open: false, borrowId: null });
  const [returning, setReturning] = useState(false);
  useEffect(() => {
    fetchBorrows();
  }, []);
  const fetchBorrows = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await borrowsAPI.getMyBorrows();
      setBorrows(response.data);
    } catch (error) {
      setError('Error fetching borrowed books');
      console.error('Error:', error);
    }
    setLoading(false);
  };
  const handleReturnBook = async () => {
    setReturning(true);
    try {
      await borrowsAPI.returnBook(returnDialog.borrowId);
      await fetchBorrows();
      if (onUpdate) onUpdate();
      
      setReturnDialog({ open: false, borrowId: null });
    } catch (error) {
      setError(error.response?.data?.message || 'Error returning book');
    }
    setReturning(false);
  };
  const getStatusChip = (borrow) => {
    if (borrow.status === 'returned') {
      return <Chip label="Returned" color="success" size="small" />;
    }
    const daysUntilDue = getDaysUntilDue(borrow.due_date);
    
    if (daysUntilDue < 0) {
      return <Chip label="Overdue" color="error" size="small" />;
    } else if (daysUntilDue <= 2) {
      return <Chip label="Due Soon" color="warning" size="small" />;
    } else {
      return <Chip label="Active" color="primary" size="small" />;
    }
  };
  if (loading) {
    return <LoadingSpinner message="Loading your borrowed books..." />;
  }
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        My Borrowed Books
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {borrows.length === 0 ? (
        <Alert severity="info">
          You haven't borrowed any books yet. Visit the Books section to borrow some!
        </Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Book Title</TableCell>
                <TableCell>Author</TableCell>
                <TableCell>Borrow Date</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {borrows.map((borrow) => (
                <TableRow key={borrow.id}>
                  <TableCell>
                    <Typography variant="subtitle2">
                      {borrow.title}
                    </Typography>
                  </TableCell>
                  <TableCell>{borrow.author}</TableCell>
                  <TableCell>{formatDate(borrow.borrow_date)}</TableCell>
                  <TableCell>
                    <Box>
                      {formatDate(borrow.due_date)}
                      {borrow.status === 'borrowed' && (
                        <Typography variant="caption" display="block">
                          ({getDaysUntilDue(borrow.due_date) >= 0 
                            ? `${getDaysUntilDue(borrow.due_date)} days left`
                            : `${Math.abs(getDaysUntilDue(borrow.due_date))} days overdue`

                          })
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>{getStatusChip(borrow)}</TableCell>
                  <TableCell>
                    {borrow.status === 'borrowed' && (
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<UndoIcon/>}
                        onClick={() => setReturnDialog({ open: true, borrowId: borrow.id })}
                      >
                        Return
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <ConfirmDialog
        open={returnDialog.open}
        onClose={() => setReturnDialog({ open: false, borrowId: null })}
        onConfirm={handleReturnBook}
        title="Return Book"
        message="Are you sure you want to return this book?"
        confirmText={returning ? <CircularProgress size={20} /> : "Return Book"}
      />
    </Box>
  );
 };
 export default MyBorrows;
