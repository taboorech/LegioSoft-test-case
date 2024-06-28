import React from 'react';
import { Box, Button } from '@chakra-ui/react';

// Props for the pagination component
interface PaginationProps {
  totalTransactions: number; // Total number of transactions
  transactionsPerPage: number; // Number of transactions per page
  currentPage: number; // Current page number
  onPageChange: (pageNumber: number) => void; // Function called when page number changes
}

// Pagination component to navigate through pages of transactions
const Pagination: React.FC<PaginationProps> = ({ totalTransactions, transactionsPerPage, currentPage, onPageChange }) => {
  // Calculate total pages based on total transactions and transactions per page
  const totalPages = Math.ceil(totalTransactions / transactionsPerPage);

  // Generate an array of page numbers from 1 to totalPages
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center" mt={4}>
      {/* Button to navigate to previous page */}
      <Button mr={2} onClick={() => onPageChange(currentPage - 1)} isDisabled={currentPage === 1}>
        &lt;
      </Button>
      
      {/* Render buttons for each page number */}
      {pageNumbers.map(number => (
        <Button
          key={number}
          mr={2}
          onClick={() => onPageChange(number)}
          colorScheme={number === currentPage ? 'blue' : 'gray'}
        >
          {number}
        </Button>
      ))}
      
      {/* Button to navigate to next page */}
      <Button onClick={() => onPageChange(currentPage + 1)} isDisabled={currentPage === totalPages}>
        &gt;
      </Button>
    </Box>
  );
};

export default Pagination;
