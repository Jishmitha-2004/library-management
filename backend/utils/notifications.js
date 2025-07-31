const nodemailer = require('nodemailer');
const cron = require('node-cron');
const db = require('../config/database');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendOverdueNotification = async (userEmail, bookTitle, daysOverdue) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: 'Library Book Overdue - Action Required',
        html: `
            <h3>Book Overdue Notification</h3>
            <p>Dear Library User,</p>
            <p>The book "<strong>${bookTitle}</strong>" is now <strong>${daysOverdue} days overdue</strong>.</p>
            <p>Please return it as soon as possible to avoid penalties.</p>
            <p>Thank you,<br>Library Management System</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Overdue email sent to ${userEmail}`);
    } catch (err) {
        console.error('Error sending overdue email:', err);
    }
};

const sendDueSoonNotification = async (userEmail, bookTitle, daysUntilDue) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: 'Library Book Due Soon',
        html: `
            <h3>Book Due Soon Reminder</h3>
            <p>Dear Library User,</p>
            <p>The book "<strong>${bookTitle}</strong>" is due in <strong>${daysUntilDue} days</strong>.</p>
            <p>Please return it on time or renew if needed.</p>
            <p>Thank you,<br>Library Management System</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Due soon email sent to ${userEmail}`);
    } catch (err) {
        console.error('Error sending due soon email:', err);
    }
};

const checkAndNotify = () => {
    const currentDate = new Date();

    // Overdue
    const overdueQuery = `
        SELECT b.*, u.email, bk.title,
               julianday('now') - julianday(b.due_date) as days_overdue
        FROM borrows b
        JOIN users u ON b.user_id = u.id
        JOIN books bk ON b.book_id = bk.id
        WHERE b.status = 'borrowed' AND b.due_date < datetime('now')
    `;
    db.all(overdueQuery, [], (err, overdueBooks) => {
        if (err) return console.error('Error checking overdue books:', err);
        overdueBooks.forEach(book => {
            sendOverdueNotification(book.email, book.title, Math.floor(book.days_overdue));
        });
    });

    // Due soon
    const dueSoonQuery = `
        SELECT b.*, u.email, bk.title,
               julianday(b.due_date) - julianday('now') as days_until_due
        FROM borrows b
        JOIN users u ON b.user_id = u.id
        JOIN books bk ON b.book_id = bk.id
        WHERE b.status = 'borrowed'
          AND b.due_date BETWEEN datetime('now') AND datetime('now', '+2 days')
    `;
    db.all(dueSoonQuery, [], (err, dueSoonBooks) => {
        if (err) return console.error('Error checking due soon books:', err);
        dueSoonBooks.forEach(book => {
            sendDueSoonNotification(book.email, book.title, Math.ceil(book.days_until_due));
        });
    });
};

const startNotificationScheduler = () => {
    cron.schedule('0 9 * * *', () => {
        console.log('Running daily notification check...');
        checkAndNotify();
    });
    console.log('Notification scheduler started');
};

module.exports = {
    sendOverdueNotification,
    sendDueSoonNotification,
    checkAndNotify,
    startNotificationScheduler
};
