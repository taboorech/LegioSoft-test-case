import './App.css'
import { Route, Routes } from 'react-router-dom'
import TransactionsPage from './pages/TransactionsPage/TransactionsPage'

function App() {
  return (
    <Routes>
      <Route path='/' element={<TransactionsPage/>} />
    </Routes>
  )
}

export default App
