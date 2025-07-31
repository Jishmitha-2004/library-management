const sqlite3 = require('sqlite3').verbose();
 const path = require('path');
 const dbPath = path.join(__dirname, '../library.db');
 const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database');
        initializeTables();
    }
 });
 function initializeTables() {
    // Users table
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT DEFAULT 'user',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
    // Books table
    db.run(`
        CREATE TABLE IF NOT EXISTS books (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            author TEXT NOT NULL,
            genre TEXT NOT NULL,
            isbn TEXT UNIQUE,
            total_copies INTEGER DEFAULT 1,
            available_copies INTEGER DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
    // Borrows table
    db.run(`

        CREATE TABLE IF NOT EXISTS borrows (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            book_id INTEGER NOT NULL,
            borrow_date DATETIME DEFAULT CURRENT_TIMESTAMP,
            due_date DATETIME NOT NULL,
            return_date DATETIME,
            status TEXT DEFAULT 'borrowed',
            FOREIGN KEY (user_id) REFERENCES users (id),
            FOREIGN KEY (book_id) REFERENCES books (id)
        )
    `);
    // Insert default admin user
    const bcrypt = require('bcryptjs');
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    
    db.run(`
        INSERT OR IGNORE INTO users (username, email, password, role)
        VALUES ('admin', 'admin@library.com', ?, 'admin')
    `, [hashedPassword]);
    console.log('Database tables initialized');
 }
 module.exports = db
 // Sample books (insert only if table is empty)
db.get(`SELECT COUNT(*) as count FROM books`, (err, row) => {
  if (!err && row.count === 0) {
    const insert = db.prepare(`
      INSERT INTO books (title, author, genre, isbn, total_copies, available_copies)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    insert.run("The Great Gatsby", "F. Scott Fitzgerald", "Classic", "9780743273565", 5, 5);
    insert.run("1984", "George Orwell", "Dystopian", "9780451524935", 3, 3);
    insert.run("To Kill a Mockingbird", "Harper Lee", "Classic", "9780061120084", 4, 4);

    insert.finalize();
    console.log("Inserted sample books");
  }
});
