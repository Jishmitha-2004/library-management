const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

// Register user
const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        db.get('SELECT * FROM users WHERE email = ? OR username = ?', [email, username], async (err, existingUser) => {
            if (err) return res.status(500).json({ message: 'Database error' });

            if (existingUser) return res.status(400).json({ message: 'User already exists' });

            const hashedPassword = await bcrypt.hash(password, 10);

            db.run(
                'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
                [username, email, hashedPassword],
                function (err) {
                    if (err) return res.status(500).json({ message: 'Error creating user' });

                    const token = jwt.sign({ userId: this.lastID }, process.env.JWT_SECRET, { expiresIn: '24h' });

                    res.status(201).json({
                        message: 'User created successfully',
                        token,
                        user: { id: this.lastID, username, email, role: 'user' }
                    });
                }
            );
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Login user
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("Login attempt:", email);

        db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
            if (err) {
                console.error("DB error:", err);
                return res.status(500).json({ message: 'Database error' });
            }

            if (!user) {
                console.warn("User not found for email:", email);
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            console.log("User found:", user);

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                console.warn("Password mismatch for user:", email);
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            const token = jwt.sign(
                { id: user.id, username: user.username, email: user.email, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({
                message: 'Login successful',
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                }
            });
        });
    } catch (error) {
        console.error("Login error:", error.message);
        res.status(500).json({ message: 'Server error' });
    }
};



// Get profile
const getProfile = (req, res) => {
    res.json({
        user: {
            id: req.user.id,
            username: req.user.username,
            email: req.user.email,
            role: req.user.role
        }
    });
};

module.exports = { register, login, getProfile };
