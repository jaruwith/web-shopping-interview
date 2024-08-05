'use client';

import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  TextField,
  Button,
  Container,
  Box,
  Typography,
  Paper,
  Avatar,
  CssBaseline,
  Grid,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { registerUser } from '../api'; 

const theme = createTheme();

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const alphaNumericRegex = /^[a-zA-Z0-9]+$/;

    if (!formData.username || !formData.email || !formData.password) {
      toast.error('All fields are required!');
      return;
    }

    if (!emailRegex.test(formData.email)) {
      toast.error('Invalid email format!');
      return;
    }

    if (!alphaNumericRegex.test(formData.username) || !alphaNumericRegex.test(formData.password) || !alphaNumericRegex.test(formData.email.replace(/@.+$/, ''))) {
      toast.error('Username, Email, and Password must only contain letters and numbers!');
      return;
    }

    try {
      await registerUser({
        username: formData.username,
        email: formData.email,
        passwordHash: formData.password 
      });
      toast.success('User registered successfully!');
      setFormData({
        username: '',
        email: '',
        password: ''
      });
    } catch (error) {
      console.error(error.message);
      toast.error('Error registering user.');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Paper elevation={3} sx={{ p: 4, mt: 8, borderRadius: 2 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Register
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                value={formData.username}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Register
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Typography variant="body2">
                    Already have an account? <a href="/Login">Login</a>
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Paper>
      </Container>
      <ToastContainer />
    </ThemeProvider>
  );
}