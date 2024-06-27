import React, { useState } from 'react';
import { Box, Button, Input, Select } from '@chakra-ui/react';
import { FilterType } from '../../types/FilterType.type';

interface FilterProps {
  onFilterChange: (filters: FilterType) => void;
}

const Filter: React.FC<FilterProps> = ({ onFilterChange }) => {
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [searchByValue, setSearchByValue] = useState('');

  const handleFilter = () => {
    onFilterChange({
      status,
      type,
      startDate,
      endDate,
      minAmount,
      maxAmount,
      searchByValue
    });
  };

  return (
    <Box display="flex" gap={2} flexDirection="column">
      <Select placeholder="Status" value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="Pending">Pending</option>
        <option value="Completed">Completed</option>
        <option value="Cancelled">Cancelled</option>
      </Select>
      <Select placeholder="Type" value={type} onChange={(e) => setType(e.target.value)}>
        <option value="Refill">Refill</option>
        <option value="Withdrawal">Withdrawal</option>
      </Select>
      <Input
        type="date"
        placeholder="Start Date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />
      <Input
        type="date"
        placeholder="End Date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
      />
      <Input
        type="number"
        placeholder="Min Amount"
        value={minAmount}
        onChange={(e) => setMinAmount(e.target.value)}
      />
      <Input
        type="number"
        placeholder="Max Amount"
        value={maxAmount}
        onChange={(e) => setMaxAmount(e.target.value)}
      />
      <Input
        type="text"
        placeholder="Search by value"
        value={searchByValue}
        onChange={(e) => setSearchByValue(e.target.value)}
      />
      <Button onClick={handleFilter}>Apply Filters</Button>
    </Box>
  );
};

export default Filter;
