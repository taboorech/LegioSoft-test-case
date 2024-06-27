import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Input, Button } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';

const login = async (credentials: { username: string; password: string }) => {
  return new Promise<{ token: string }>((resolve) => {
    setTimeout(() => {
      resolve({ token: 'dummy-token' });
    }, 1000);
  });
};

const LoginPage = (): React.ReactElement => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: () => login({ username, password }),
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      navigate('/');
    },
    onError: () => {
      alert('Invalid credentials');
    }
  });

  const handleLogin = () => {
    mutation.mutate({ username, password });
  };

  return (
    <Box p={4}>
      <Input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        mb={2}
      />
      <Input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        mb={2}
      />
      <Button onClick={handleLogin} isLoading={mutation.isPending}>
        Login
      </Button>
    </Box>
  );
};

export default LoginPage;
