// src/pages/Login.tsx
import { useState } from 'react';
import { Button, TextField, Typography, Box, Container, Alert } from '@mui/material';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../services/firebase';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Connexion avec Email et mot de passe
  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/home'); // Redirige vers la page Home
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Connexion avec Google
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate('/home');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', 
        width: '100vw',
        backgroundColor: '#f5f5f5' 
      }}
    >
      <Container maxWidth="xs" sx={{ backgroundColor: 'white', padding: 5, borderRadius: 2, boxShadow: 3, margin: 5 }}>
        <Typography variant="h4" align="center" gutterBottom color="black"><img src="/runit.png" alt="" width={100} /></Typography>
        
        <TextField
          label="Email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
        />
        
        <TextField
          label="Mot de passe"
          variant="outlined"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
        />
        
        {error && <Alert severity="error">{error}</Alert>}

        <Button 
          variant="contained" 
          fullWidth 
          onClick={handleLogin}
          sx={{ marginTop: 2, backgroundColor: '#0d3b5c' }}
        >
          Se connecter
        </Button>

        <Button 
          fullWidth 
          onClick={handleGoogleLogin}
          sx={{ marginTop: 2, backgroundColor: '#0d3b5c', color: 'white' }}
        >
        <img src="/google.png" alt="" width={25} />
          &nbsp; Google
        </Button>
      </Container>
    </Box>
  );
};

export default Login;
