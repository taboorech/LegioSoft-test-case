import React, { useState } from 'react';
import { Box, Button, Table, Thead, Tbody, Tr, Th, Td, Checkbox, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@chakra-ui/react';
import ImportButton from '../../components/ImportButton/ImportButton';
// import ExportButton from '../../components/ExportButton/ExportButton';
import EditTransactionModal from '../../components/EditTransactionModal/EditTransactionModal';
import { Transaction } from '../../types/Transaction';
import Filter from '../../components/Filter/Filter';
import Pagination from '../../components/Pagination/Pagination';

const TransactionsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 10;
  const [filters, setFilters] = useState<{ status: string; type: string }>({ status: '', type: '' });
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState<string[]>(['Id', 'Status', 'Type', 'Client Name', 'Amount']);

  const columns = ['Id', 'Status', 'Type', 'Client Name', 'Amount'];

  const handleImport = (importedTransactions: Transaction[]) => {
    setTransactions(importedTransactions);
    applyFilters(importedTransactions, filters);
  };

  const handleExport = () => {
    const csvRows = [
      selectedColumns, // headers
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

  const applyFilters = (transactions: Transaction[], filters: { status: string; type: string }) => {
    let filtered = transactions;
    if (filters.status) {
      filtered = filtered.filter(transaction => transaction.status === filters.status);
    }
    if (filters.type) {
      filtered = filtered.filter(transaction => transaction.type === filters.type);
    }
    setFilteredTransactions(filtered);
    setCurrentPage(1); // Повертаємось на першу сторінку після зміни фільтрів
  };

  const handleFilterChange = (newFilters: { status: string; type: string }) => {
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
