import React from 'react';
 import { useNavigate, Link } from 'react-router-dom';
 import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
 } from '@mui/material';
 import {
  AccountCircle,
  Book,
  Dashboard,
  AdminPanelSettings,
 } from '@mui/icons-material';
 import { useAuth } from '../../context/AuthContext';
 const Header = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    logout();
    navigate('/');
    handleClose();
  };
  return (
    <AppBar position="static">
      <Toolbar>
        <Book sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link 
            to="/" 
            style={{ color: 'inherit', textDecoration: 'none' }}
          >
            Library Management System
          </Link>
        </Typography>
        {!isAuthenticated ? (
          <Box>
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
            <Button color="inherit" component={Link} to="/register">
              Register
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button
              color="inherit"
              startIcon={<Book />}
              component={Link}
              to="/books"
              sx={{ mr: 1 }}
            >
              Books
            </Button>
            <Button
              color="inherit"
              startIcon={<Dashboard />}
              component={Link}
              to="/dashboard"
              sx={{ mr: 1 }}
            >
              Dashboard
            </Button>
            {isAdmin && (
              <Button
                color="inherit"
                startIcon={<AdminPanelSettings />}

                component={Link}
                to="/admin"
                sx={{ mr: 1 }}
              >
                Admin
              </Button>
            )}
            <IconButton
              size="large"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem disabled>
                <Typography variant="body2">
                  {user?.username} ({user?.role})
                </Typography>
              </MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
 };
 export default Header;