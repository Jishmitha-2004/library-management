 require('dotenv').config();
 const express = require('express');
 const cors = require('cors');
 const db = require('./config/database');
 const { startNotificationScheduler } = require('./utils/notifications');
 // Import routes
 const authRoutes = require('./routes/auth');
 const bookRoutes = require('./routes/books');
 const borrowRoutes = require('./routes/borrows');
 const app = express();
 const PORT = process.env.PORT || 5000;
 // Middleware
 app.use(cors());
 app.use(express.json());
 // Routes
 app.use('/api/auth', authRoutes);
 app.use('/api/books', bookRoutes);
 app.use('/api/borrows', borrowRoutes);
 // Health check route
 app.get('/api/health', (req, res) => {
    res.json({ message: 'Library Management System API is running!' });
 });
 // Error handling middleware
 app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
 });
 // Start notification scheduler
 startNotificationScheduler();
 app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
 });
