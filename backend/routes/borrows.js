 const express = require('express');
 const {
    borrowBook,
    returnBook,
    getUserBorrows,
    getAllBorrows,
    getOverdueBooks
 } = require('../controllers/borrowController');
 const { auth, adminAuth } = require('../middleware/auth');
 const router = express.Router();
 router.post('/borrow', auth, borrowBook);
 router.put('/return/:borrowId', auth, returnBook);
 router.get('/my-borrows', auth, getUserBorrows);
 router.get('/all', auth, adminAuth, getAllBorrows);
 router.get('/overdue', auth, adminAuth, getOverdueBooks);
 module.exports = router;