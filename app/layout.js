"use client";

import { Inter } from "next/font/google";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppBar, Toolbar, Typography, Button, Container, CssBaseline, Box, IconButton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ListIcon from '@mui/icons-material/List';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LogoutIcon from '@mui/icons-material/Logout';

const inter = Inter({ subsets: ["latin"] });

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

export default function RootLayout({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loggedInStatus = getCookie('isLoggedIn');
    setIsLoggedIn(loggedInStatus === 'true');

    const handleCookieChange = () => {
      const loggedInStatus = getCookie('isLoggedIn');
      setIsLoggedIn(loggedInStatus === 'true');
    };

    window.addEventListener('cookiechange', handleCookieChange);

    return () => {
      window.removeEventListener('cookiechange', handleCookieChange);
    };
  }, []);

  const handleLogin = () => {
    document.cookie = 'isLoggedIn=true; path=/';
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    document.cookie = 'isLoggedIn=false; path=/';
    setIsLoggedIn(false);
    router.push('/Login'); // Redirect to the Login page after logout
  };

  return (
    <html lang="en">
      <head>
        <style jsx global>{`
          body {
            margin: 0;
            font-family: ${inter.className};
            min-height: 100vh;
            display: flex;
            flex-direction: column;
          }
        `}</style>
      </head>
      <body>
        <CssBaseline />
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              My App
            </Typography>
            <nav>
              {isLoggedIn ? (
                <>
                  <IconButton color="inherit" onClick={() => router.push('/Login/Home')} className={router.pathname === '/Login/Home' ? 'active' : ''}>
                    <HomeIcon />
                  </IconButton>
                  <IconButton color="inherit" onClick={() => router.push('/Login/ListOrder')} className={router.pathname === '/Login/ListOrder' ? 'active' : ''}>
                    <ListIcon />
                  </IconButton>
                  <IconButton color="inherit" onClick={handleLogout}>
                    <LogoutIcon />
                  </IconButton>
                </>
              ) : (
                <>
                  <IconButton color="inherit" onClick={() => router.push('/Login')} className={router.pathname === '/Login' ? 'active' : ''}>
                    <LoginIcon />
                  </IconButton>
                  <IconButton color="inherit" onClick={() => router.push('/Register')} className={router.pathname === '/Register' ? 'active' : ''}>
                    <PersonAddIcon />
                  </IconButton>
                </>
              )}
            </nav>
          </Toolbar>
        </AppBar>
        <Container component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Box my={4} sx={{ flexGrow: 1 }}>
            {children}
          </Box>
        </Container>
        <footer style={{ backgroundColor: '#333', color: '#fff', padding: '10px 0', textAlign: 'center' }}>
          <Typography variant="body1">
            &copy; {new Date().getFullYear()} My App. All Rights Reserved.
          </Typography>
        </footer>
      </body>
    </html>
  );
}