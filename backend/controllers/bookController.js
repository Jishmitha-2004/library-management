const db = require('../config/database');
 // Get all books with search functionality
 const getAllBooks = (req, res) => {
    const { search, genre } = req.query;
    let query = 'SELECT * FROM books WHERE 1=1';
    const params = [];
    if (search) {
        query += ' AND (title LIKE ? OR author LIKE ?)';
        params.push(`%${search}%`, `%${search}%`);
    }
    if (genre) {
        query += ' AND genre = ?';
        params.push(genre);
    }
    query += ' ORDER BY title';
    db.all(query, params, (err, books) => {
        if (err) {
            return res.status(500).json({ message: 'Database error' });
        }
        res.json(books);
    });
 };
 // Get single book
 const getBook = (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM books WHERE id = ?', [id], (err, book) => {
        if (err) {
            return res.status(500).json({ message: 'Database error' });
        }
        
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json(book);
    });
};
 // Add new book (Admin only)
 const addBook = (req, res) => {
    const { title, author, genre, isbn, total_copies } = req.body;
    db.run(
        'INSERT INTO books (title, author, genre, isbn, total_copies, available_copies) VALUES (?, ?, ?, ?, ?, ?)',
        [title, author, genre, isbn, total_copies, total_copies],
        function(err) {
            if (err) {
                if (err.code === 'SQLITE_CONSTRAINT') {
                    return res.status(400).json({ message: 'Book with this ISBN already exists' });
                }
                return res.status(500).json({ message: 'Error adding book' });
            }
            res.status(201).json({
                message: 'Book added successfully',
                book: {
                    id: this.lastID,
                    title,
                    author,
                    genre,
                    isbn,
                    total_copies,
                    available_copies: total_copies
                }
            });
        }
    );
 };
 // Update book (Admin only)
 const updateBook = (req, res) => {
    const { id } = req.params;
    const { title, author, genre, isbn, total_copies } = req.body;
    db.run(
        'UPDATE books SET title = ?, author = ?, genre = ?, isbn = ?, total_copies = ? WHERE id = ?',
        [title, author, genre, isbn, total_copies, id],
        function(err) {
            if (err) {
                return res.status(500).json({ message: 'Error updating book' });
            }
            if (this.changes === 0) {
                return res.status(404).json({ message: 'Book not found' });
            }
            res.json({ message: 'Book updated successfully' });
        }
    );
 };
 // Delete book (Admin only)
 const deleteBook = (req, res) => {
    const { id } = req.params;
    // Check if book is currently borrowed
    db.get('SELECT * FROM borrows WHERE book_id = ? AND status = "borrowed"', [id], (err, borrow) => {
        if (err) {
            return res.status(500).json({ message: 'Database error' });
        }
        if (borrow) {
            return res.status(400).json({ message: 'Cannot delete book that is currently borrowed' });
        }
        db.run('DELETE FROM books WHERE id = ?', [id], function(err) {
            if (err) {
                return res.status(500).json({ message: 'Error deleting book' });
            }
            if (this.changes === 0) {
                return res.status(404).json({ message: 'Book not found' });
            }
            res.json({ message: 'Book deleted successfully' });
        });
    });
 };
 // Get unique genres
 const getGenres = (req, res) => {
    db.all('SELECT DISTINCT genre FROM books ORDER BY genre', (err, rows) => {
        if (err) {
            return res.status(500).json({ message: 'Database error' });
}
 const genres = rows.map(row => row.genre);
 res.json(genres);
 });
 };
 module.exports = {
 getAllBooks,
 getBook,
 addBook,
 updateBook,
 deleteBook,
 getGenres
 };