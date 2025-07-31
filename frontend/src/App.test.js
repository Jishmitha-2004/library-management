// App.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

test('renders header and navigates to book list', () => {
  render(
    <MemoryRouter initialEntries={['/books']}>
      <App />
    </MemoryRouter>
  );

  // Check if "Available Books" heading appears
  const heading = screen.getByText(/available books/i);
  expect(heading).toBeInTheDocument();
});

test('renders login page on /login', () => {
  render(
    <MemoryRouter initialEntries={['/login']}>
      <App />
    </MemoryRouter>
  );

  const loginHeading = screen.getByText(/login/i);
  expect(loginHeading).toBeInTheDocument();
});

test('renders register page on /register', () => {
  render(
    <MemoryRouter initialEntries={['/register']}>
      <App />
    </MemoryRouter>
  );

  const registerHeading = screen.getByText(/register/i);
  expect(registerHeading).toBeInTheDocument();
});
