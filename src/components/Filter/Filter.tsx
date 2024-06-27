import React from 'react';
import { Box, Select } from '@chakra-ui/react';

interface FilterProps {
  onFilterChange: (filters: { status: string; type: string }) => void;
}

const Filter: React.FC<FilterProps> = ({ onFilterChange }) => {
  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ status: event.target.value, type: document.getElementById('type-filter')?.value || '' });
  };

  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ status: document.getElementById('status-filter')?.value || '', type: event.target.value });
  };

  return (
    <Box display="flex" gap={2}>
      <Select id="status-filter" placeholder="Status" onChange={handleStatusChange}>
        <option value="Pending">Pending</option>
        <option value="Completed">Completed</option>
        <option value="Cancelled">Cancelled</option>
      </Select>
      <Select id="type-filter" placeholder="Type" onChange={handleTypeChange}>
        <option value="Refill">Refill</option>
        <option value="Withdrawal">Withdrawal</option>
      </Select>
    </Box>
  );
};

export default Filter;
