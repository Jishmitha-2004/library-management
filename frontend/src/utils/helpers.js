// Date formatting utilities
 export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
 };
 export const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
 };
 // Calculate days until due date
 export const getDaysUntilDue = (dueDateString) => {
  const dueDate = new Date(dueDateString);
  const currentDate = new Date();
  
  // Set time to start of day for accurate comparison
  dueDate.setHours(0, 0, 0, 0);
  currentDate.setHours(0, 0, 0, 0);
  
  const timeDiff = dueDate.getTime() - currentDate.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
 };
 // Validate email format
 export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
 };
 // Format book availability status
 export const getAvailabilityStatus = (book) => {
  if (book.available_copies === 0) {

    return { text: 'Not Available', color: 'error' };
  } else if (book.available_copies <= 2) {
    return { text: 'Few Copies Left', color: 'warning' };
  } else {
    return { text: 'Available', color: 'success' };
  }
 };
 // Truncate text with ellipsis
 export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
 };
 // Handle API errors consistently
 export const handleApiError = (error) => {
  if (error.response) {
    return error.response.data.message || 'An error occurred';
  } else if (error.request) {
    return 'Network error - please check your connection';
  } else {
    return 'An unexpected error occurred';
  }
 };
 // Local storage helpers
 export const getStoredUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error parsing stored user:', error);
    return null;
  }
 };
 export const getStoredToken = () => {
  return localStorage.getItem('token');
 };