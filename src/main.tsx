import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
// import { QueryClientProvider } from 'react-query'
import { ChakraProvider } from '@chakra-ui/react'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    {/* <QueryClientProvider client={queryClient}> */}
      <ChakraProvider>
        <App />
      </ChakraProvider>
    {/* </QueryClientProvider> */}
  </BrowserRouter>,
)
