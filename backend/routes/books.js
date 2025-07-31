 const express = require('express');
 const {
 getAllBooks,
 getBook,
 addBook,
 updateBook,
 deleteBook,
 getGenres
 } = require('../controllers/bookController');
 //const { auth, adminAuth } = require('../middleware/auth');
 const router = express.Router();
 router.get('/', getAllBooks);
 router.get('/genres', getGenres);
 router.get('/:id', getBook);
 router.post('/',   addBook);
 router.put('/:id',  updateBook);
 router.delete('/:id', deleteBook);
 
 module.exports = router;
