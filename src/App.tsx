import './App.css';
import { Route, Routes } from 'react-router-dom';
import TransactionsPage from './pages/TransactionsPage/TransactionsPage';
import LoginPage from './pages/LoginPage/LoginPage';
import ProtectedRoute from './utils/protected-route';

function App() {
  return (
    <Routes>
      {/* Route for the protected transactions page */}
      <Route path='/' element={
        <ProtectedRoute>
          <TransactionsPage />
        </ProtectedRoute>
      } />

      {/* Route for the login page */}
      <Route path='/login' element={<LoginPage />} />
    </Routes>
  );
}

export default App;
