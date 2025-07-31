// components/common/Footer.js
import React from 'react';

const Footer = () => {
  return (
    <footer style={{ padding: '10px', backgroundColor: '#333', color: '#fff', textAlign: 'center', marginTop: '2rem' }}>
      <p>&copy; {new Date().getFullYear()} Library Management System</p>
    </footer>
  );
};

export default Footer;
