import React, { useState } from 'react';
import { Box, Button, Table, Thead, Tbody, Tr, Th, Td, Checkbox, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@chakra-ui/react';
import ImportButton from '../../components/ImportButton/ImportButton';
import EditTransactionModal from '../../components/EditTransactionModal/EditTransactionModal';
import { Transaction } from '../../types/Transaction.type';
import Filter from '../../components/Filter/Filter';
import Pagination from '../../components/Pagination/Pagination';
import { FilterType } from '../../types/FilterType.type';

const TransactionsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 10;
  const [filters, setFilters] = useState<FilterType>({ status: '', type: '', minAmount: '', maxAmount: '', startDate: '', endDate: '', searchByValue: '' });
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState<string[]>(['Id', 'Status', 'Type', 'Client Name', 'Amount', 'Date']);

  const columns = ['Id', 'Status', 'Type', 'Client Name', 'Amount', 'Date'];

  const handleImport = (importedTransactions: Transaction[]) => {
    setTransactions(importedTransactions);
    applyFilters(importedTransactions, filters);
  };

  const handleExport = () => {
    const csvRows = [
      selectedColumns,
      ...filteredTransactions.map(transaction => selectedColumns.map(col => transaction[col.split(' ').map((word, index) => index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join('') as keyof Transaction]))
    ];
    const csvContent = "data:text/csv;charset=utf-8," + csvRows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "transactions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleEdit = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
  };

  const handleDelete = (id: string) => {
    const updatedTransactions = transactions.filter(t => t.id !== id);
    setTransactions(updatedTransactions);
    applyFilters(updatedTransactions, filters);
  };

  const handleUpdateTransaction = (updatedTransaction: Transaction) => {
    const updatedTransactions = transactions.map(t => (t.id === updatedTransaction.id ? updatedTransaction : t));
    setTransactions(updatedTransactions);
    applyFilters(updatedTransactions, filters);
  };

  const applyFilters = (transactions: Transaction[], filters: FilterType) => {
    let filtered = transactions;
    
    if (filters.status) {
      filtered = filtered.filter(transaction => transaction.status === filters.status);
    }
    
    if (filters.type) {
      filtered = filtered.filter(transaction => transaction.type === filters.type);
    }
    
    if (filters.startDate) {
      filtered = filtered.filter(transaction => new Date(transaction.date) >= new Date(filters.startDate));
    }
    
    if (filters.endDate) {
      filtered = filtered.filter(transaction => new Date(transaction.date) <= new Date(filters.endDate));
    }
    
    if (filters.minAmount) {
      filtered = filtered.filter(transaction => transaction.amount >= parseFloat(filters.minAmount));
    }
    
    if (filters.maxAmount) {
      filtered = filtered.filter(transaction => transaction.amount <= parseFloat(filters.maxAmount));
    }

    if(filters.searchByValue) {
      filtered = filtered.filter(transaction => 
        transaction.id === filters.searchByValue ||
        transaction.status === filters.status ||
        transaction.type === filters.type ||
        transaction.amount.toString() === filters.searchByValue ||
        new Date(transaction.date) === new Date(filters.searchByValue)
      )
    }
  
    setFilteredTransactions(filtered);
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters: FilterType) => {
    setFilters(newFilters);
    applyFilters(transactions, newFilters);
  };

  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > Math.ceil(filteredTransactions.length / transactionsPerPage)) {
      return;
    }
    return setCurrentPage(pageNumber);
  };

  const toggleColumn = (column: string) => {
    setSelectedColumns(prevColumns =>
      prevColumns.includes(column)
        ? prevColumns.filter(col => col !== column)
        : [...prevColumns, column]
    );
  };

  return (
    <Box p={4}>
      <Box mb={4} display="flex" justifyContent="space-between">
        <Filter onFilterChange={handleFilterChange} />
        <Box>
          <ImportButton mr={"2"} onImport={handleImport} />
          <Button onClick={() => setIsExportModalOpen(true)}>Export</Button>
        </Box>
      </Box>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Id</Th>
            <Th>Status</Th>
            <Th>Type</Th>
            <Th>Client name</Th>
            <Th>Amount</Th>
            <Th>Date</Th>
            <Th>Action</Th>
          </Tr>
        </Thead>
        <Tbody>
          {currentTransactions.map(transaction => (
            <Tr key={transaction.id}>
              <Td>{transaction.id}</Td>
              <Td>{transaction.status}</Td>
              <Td>{transaction.type}</Td>
              <Td>{transaction.clientName}</Td>
              <Td>{transaction.amount}</Td>
              <Td>{transaction.date}</Td>
              <Td>
                <Button mr={2} colorScheme="blue" onClick={() => handleEdit(transaction)}>Edit</Button>
                <Button colorScheme="red" onClick={() => handleDelete(transaction.id)}>Delete</Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Pagination
        totalTransactions={filteredTransactions.length}
        transactionsPerPage={transactionsPerPage}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />

      {selectedTransaction && (
        <EditTransactionModal
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
          onUpdate={handleUpdateTransaction}
        />
      )}

      <Modal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Select Columns to Export</ModalHeader>
          <ModalBody>
            {columns.map(column => (
              <Box
                key={column}
                mb={2}
              >
                <Checkbox
                  isChecked={selectedColumns.includes(column)}
                  onChange={() => toggleColumn(column)}
                >
                  {column}
                </Checkbox>
              </Box>
            ))}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={() => {
              handleExport();
              setIsExportModalOpen(false);
            }}>Export</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default TransactionsPage;
