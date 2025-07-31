const db = require('../config/database');

// Borrow a book
const borrowBook = (req, res) => {
    const { bookId } = req.body;
    const userId = req.user.id;

    db.get('SELECT * FROM books WHERE id = ? AND available_copies > 0', [bookId], (err, book) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        if (!book) return res.status(400).json({ message: 'Book not available' });

        db.get('SELECT * FROM borrows WHERE user_id = ? AND book_id = ? AND status = "borrowed"', 
            [userId, bookId], (err, existingBorrow) => {
            if (err) return res.status(500).json({ message: 'Database error' });
            if (existingBorrow) return res.status(400).json({ message: 'You have already borrowed this book' });

            const dueDate = new Date();
            dueDate.setDate(dueDate.getDate() + 14);

            db.run(
                'INSERT INTO borrows (user_id, book_id, due_date) VALUES (?, ?, ?)',
                [userId, bookId, dueDate.toISOString()],
                function (err) {
                    if (err) return res.status(500).json({ message: 'Error borrowing book' });

                    db.run('UPDATE books SET available_copies = available_copies - 1 WHERE id = ?', 
                        [bookId], (err) => {
                        if (err) return res.status(500).json({ message: 'Error updating book availability' });

                        res.json({
                            message: 'Book borrowed successfully',
                            borrowId: this.lastID,
                            dueDate: dueDate.toISOString()
                        });
                    });
                }
            );
        });
    });
};

// Return a book
const returnBook = (req, res) => {
    const { borrowId } = req.params;
    const userId = req.user.id;

    db.get('SELECT * FROM borrows WHERE id = ? AND user_id = ? AND status = "borrowed"', 
        [borrowId, userId], (err, borrow) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        if (!borrow) return res.status(404).json({ message: 'Borrow record not found' });

        const returnDate = new Date().toISOString();

        db.run(
            'UPDATE borrows SET return_date = ?, status = "returned" WHERE id = ?',
            [returnDate, borrowId],
            (err) => {
                if (err) return res.status(500).json({ message: 'Error returning book' });

                db.run('UPDATE books SET available_copies = available_copies + 1 WHERE id = ?', 
                    [borrow.book_id], (err) => {
                    if (err) return res.status(500).json({ message: 'Error updating book availability' });

                    res.json({ message: 'Book returned successfully' });
                });
            }
        );
    });
};

// Get user's borrows
const getUserBorrows = (req, res) => {
    const userId = req.user.id;
    const query = `
        SELECT b.*, bk.title, bk.author, bk.genre
        FROM borrows b
        JOIN books bk ON b.book_id = bk.id
        WHERE b.user_id = ?
        ORDER BY b.borrow_date DESC
    `;
    db.all(query, [userId], (err, borrows) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.json(borrows);
    });
};

// Admin - Get all borrows
const getAllBorrows = (req, res) => {
    const query = `
        SELECT b.*, u.username, u.email, bk.title, bk.author
        FROM borrows b
        JOIN users u ON b.user_id = u.id
        JOIN books bk ON b.book_id = bk.id
        ORDER BY b.borrow_date DESC
    `;
    db.all(query, [], (err, borrows) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.json(borrows);
    });
};

// Admin - Get overdue books
const getOverdueBooks = (req, res) => {
    const currentDate = new Date().toISOString();
    const query = `
        SELECT b.*, u.username, u.email, bk.title, bk.author
        FROM borrows b
        JOIN users u ON b.user_id = u.id
        JOIN books bk ON b.book_id = bk.id
        WHERE b.status = 'borrowed' AND b.due_date < ?
        ORDER BY b.due_date
    `;
    db.all(query, [currentDate], (err, overdueBooks) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.json(overdueBooks);
    });
};

module.exports = {
    borrowBook,
    returnBook,
    getUserBorrows,
    getAllBorrows,
    getOverdueBooks
};
