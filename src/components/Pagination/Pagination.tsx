import React from 'react';
import { Box, Button } from '@chakra-ui/react';

interface PaginationProps {
  totalTransactions: number;
  transactionsPerPage: number;
  currentPage: number;
  onPageChange: (pageNumber: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ totalTransactions, transactionsPerPage, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(totalTransactions / transactionsPerPage);

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center" mt={4}>
      <Button mr={2} onClick={() => onPageChange(currentPage - 1)} isDisabled={currentPage === 1}>&lt;</Button>
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
      <Button onClick={() => onPageChange(currentPage + 1)} isDisabled={currentPage === totalPages}>&gt;</Button>
    </Box>
  );
};

export default Pagination;
