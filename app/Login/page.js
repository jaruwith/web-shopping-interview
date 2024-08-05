'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Box, TextField, Button, Typography, Avatar, Paper, CssBaseline } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchUser } from '../api'; // Import fetchUser

const theme = createTheme();

export default function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const router = useRouter();

  useEffect(() => {
    localStorage.clear();

    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    }

    if ('caches' in window) {
      caches.keys().then((names) => {
        names.forEach(name => caches.delete(name));
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await fetchUser(formData.username, formData.password);
      if (user) {       
        const { passwordHash, createdAt, ...userWithoutSensitiveInfo } = user;

        document.cookie = `isLoggedIn=true; path=/; Secure; SameSite=Lax`;
        document.cookie = `user=${encodeURIComponent(JSON.stringify(userWithoutSensitiveInfo))}; path=/; Secure; SameSite=Lax`;
        
        toast.success('Login successful!');
        router.push(`/Login/Home`);
        window.dispatchEvent(new Event('cookiechange')); 
      } else {
        toast.error('Invalid username or password.');
      }
    } catch (error) {
      console.error(error.message);
      toast.error('Error logging in.');
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
              Login
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
                Login
              </Button>
            </Box>
          </Box>
        </Paper>
        <ToastContainer />
      </Container>
    </ThemeProvider>
  );
}
