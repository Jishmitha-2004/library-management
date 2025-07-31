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
  Chip,
  Alert,
  Box,
  Tab,
  Tabs,
 } from '@mui/material';
 import { borrowsAPI } from '../../services/api';
 import { formatDate, getDaysUntilDue } from '../../utils/helpers';
 import LoadingSpinner from '../common/LoadingSpinner';
 const BorrowManagement = ({ onUpdate }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [allBorrows, setAllBorrows] = useState([]);
  const [overdueBorrows, setOverdueBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    fetchBorrowData();
  }, []);
  const fetchBorrowData = async () => {
    setLoading(true);
    setError('');
    try {
      const [allResponse, overdueResponse] = await Promise.all([
        borrowsAPI.getAllBorrows(),
        borrowsAPI.getOverdue(),
      ]);
      setAllBorrows(allResponse.data);
      setOverdueBorrows(overdueResponse.data);
    } catch (error) {
      setError('Error fetching borrow data');
      console.error('Error:', error);
    }
    setLoading(false);
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
  const BorrowTable = ({ borrows, title }) => (
    <Box>
      <Typography variant="h6" gutterBottom>
        {title} ({borrows.length})
      </Typography>
      
      {borrows.length === 0 ? (
        <Alert severity="info">No {title.toLowerCase()} found.</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Book</TableCell>
                <TableCell>Author</TableCell>
                <TableCell>Borrow Date</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {borrows.map((borrow) => (
                <TableRow key={borrow.id}>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2">
                        {borrow.username}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {borrow.email}
                      </Typography>
                    </Box>
                  </TableCell>
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );

  if (loading) {
    return <LoadingSpinner message="Loading borrow data..." />;
  }
  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={(e, newValue) => setActiveTab(newValue)}
        >
          <Tab label={`All Borrows (${allBorrows.length})`} />
          <Tab 
            label={`Overdue (${overdueBorrows.length})`}
            sx={{ color: overdueBorrows.length > 0 ? 'error.main' : 'inherit' }}
          />
        </Tabs>
      </Box>
      {activeTab === 0 && (
        <BorrowTable borrows={allBorrows} title="All Borrows" />
      )}
      
      {activeTab === 1 && (
        <BorrowTable borrows={overdueBorrows} title="Overdue Books" />
      )}
    </Box>
  );
 };
 export default BorrowManagement;
