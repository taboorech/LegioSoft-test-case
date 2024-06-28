import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Input, Button } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';

// Define the type for the credentials used in the login function
interface LoginCredentials {
  username: string;
  password: string;
}

// Simulated login function that returns a promise with a dummy token after 1 second delay
const login = async (credentials: LoginCredentials): Promise<{ token: string }> => {
  return new Promise<{ token: string }>((resolve) => {
    setTimeout(() => {
      resolve({ token: `dummy-token-${credentials.username}-${credentials.password}` });
    }, 1000);
  });
};

// LoginPage component for user login
const LoginPage = (): React.ReactElement => {
  // State variables for username, password, and navigation hook
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // React Router's navigation hook

  // useMutation hook for handling login mutation
  const mutation = useMutation<{ token: string }, Error, LoginCredentials>({
    // Login function to be executed by the mutation
    mutationFn: (credentials) => login(credentials),
    // onSuccess callback when mutation succeeds
    onSuccess: (data) => {
      localStorage.setItem('token', data.token); // Store token in localStorage
      navigate('/'); // Navigate to home page after successful login
    },
    // onError callback when mutation fails
    onError: () => {
      alert('Invalid credentials'); // Show alert for invalid credentials
    }
  });

  // Function to handle login button click
  const handleLogin = () => {
    mutation.mutate({ username, password }); // Execute mutation with username and password
  };

  return (
    <Box p={4}>
      {/* Input field for username */}
      <Input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        mb={2}
      />
      {/* Input field for password with type password */}
      <Input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        mb={2}
      />
      {/* Button for login with isLoading state based on mutation status */}
      <Button onClick={handleLogin} isLoading={mutation.isPending}>
        Login
      </Button>
    </Box>
  );
};

export default LoginPage;
