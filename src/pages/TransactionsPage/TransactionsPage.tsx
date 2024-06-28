import React, { useState, useEffect } from 'react';
import { Box, Button, Table, Thead, Tbody, Tr, Th, Td, Checkbox, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@chakra-ui/react';
import ImportButton from '../../components/ImportButton/ImportButton';
import EditTransactionModal from '../../components/EditTransactionModal/EditTransactionModal';
import { Transaction } from '../../types/Transaction.type';
import Filter from '../../components/Filter/Filter';
import Pagination from '../../components/Pagination/Pagination';
import { FilterType } from '../../types/FilterType.type';
import DeleteTransactionModal from '../../components/DeleteTransactionModal/DeleteTransactionModal';
import { addTransaction, getTransactions, initDB } from '../../utils/db';
import PieChart from '../../components/PieChart/PieChart';

const TransactionsPage: React.FC = () => {
  // State variables
  const [transactions, setTransactions] = useState<Transaction[]>([]); // Holds all transactions
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]); // Holds filtered transactions
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null); // Holds currently selected transaction for editing
  const [currentPage, setCurrentPage] = useState(1); // Tracks current page for pagination
  const transactionsPerPage = 10; // Number of transactions per page
  // Holds filter values
  const [filters, setFilters] = useState<FilterType>({
    status: '',
    type: '',
    minAmount: '',
    maxAmount: '',
    startDate: '',
    endDate: '',
    searchByValue: ''
  });
  const [isExportModalOpen, setIsExportModalOpen] = useState(false); // Controls export modal visibility
  const [selectedColumns, setSelectedColumns] = useState<string[]>(['Id', 'Status', 'Type', 'Client Name', 'Amount', 'Date']); // Columns selected for export
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Controls delete modal visibility
  const [deletingTransactionId, setDeletingTransactionId] = useState<string | null>(null); // Holds ID of transaction to be deleted

  const columns = ['Id', 'Status', 'Type', 'Client Name', 'Amount', 'Date']; // All available columns

  // Handles importing transactions from CSV
  const handleImport = (importedTransactions: Transaction[]) => {
    setTransactions(importedTransactions); // Updates transactions state with imported data
    applyFilters(importedTransactions, filters); // Applies current filters to imported transactions
  };

  // Handles exporting transactions to CSV
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

  // Handles initiating edit of a transaction
  const handleEdit = (transaction: Transaction) => {
    setSelectedTransaction(transaction); // Sets the selected transaction for editing
  };

  // Handles initiating deletion of a transaction
  const handleDelete = (id: string) => {
    setDeletingTransactionId(id); // Sets the ID of transaction to be deleted
    setIsDeleteModalOpen(true); // Opens delete modal
  };

  // Confirms deletion of a transaction
  const handleConfirmDelete = () => {
    if (deletingTransactionId) {
      const updatedTransactions = transactions.filter(t => t.id !== deletingTransactionId); // Filters out the deleted transaction
      setTransactions(updatedTransactions); // Updates transactions state
      applyFilters(updatedTransactions, filters); // Applies current filters to updated transactions
      setDeletingTransactionId(null); // Resets deletingTransactionId state
      setIsDeleteModalOpen(false); // Closes delete modal
    }
  };

  // Updates a transaction after editing
  const handleUpdateTransaction = (updatedTransaction: Transaction) => {
    const updatedTransactions = transactions.map(t => (t.id === updatedTransaction.id ? updatedTransaction : t)); // Updates transaction in the list
    setTransactions(updatedTransactions); // Updates transactions state
    applyFilters(updatedTransactions, filters); // Applies current filters to updated transactions
  };

  // Applies filters to transactions
  const applyFilters = (transactions: Transaction[], filters: FilterType) => {
    let filtered = transactions;

    // Filter by status
    if (filters.status) {
      filtered = filtered.filter(transaction => transaction.status === filters.status);
    }

    // Filter by type
    if (filters.type) {
      filtered = filtered.filter(transaction => transaction.type === filters.type);
    }

    // Filter by start date
    if (filters.startDate) {
      filtered = filtered.filter(transaction => new Date(transaction.date) >= new Date(filters.startDate));
    }

    // Filter by end date
    if (filters.endDate) {
      filtered = filtered.filter(transaction => new Date(transaction.date) <= new Date(filters.endDate));
    }

    // Filter by minimum amount
    if (filters.minAmount) {
      filtered = filtered.filter(transaction => transaction.amount >= parseFloat(filters.minAmount));
    }

    // Filter by maximum amount
    if (filters.maxAmount) {
      filtered = filtered.filter(transaction => transaction.amount <= parseFloat(filters.maxAmount));
    }

    // Filter by search value
    if (filters.searchByValue) {
      const searchValue = filters.searchByValue.toLowerCase();
      filtered = filtered.filter(transaction =>
        transaction.id.toLowerCase().includes(searchValue) ||
        transaction.status.toLowerCase().includes(searchValue) ||
        transaction.type.toLowerCase().includes(searchValue) ||
        transaction.amount.toString().includes(searchValue) ||
        transaction.date.toLowerCase().includes(searchValue)
      );
    }

    setFilteredTransactions(filtered); // Updates filtered transactions state
    setCurrentPage(1); // Resets current page to 1
  };

  // Handles filter change
  const handleFilterChange = (newFilters: FilterType) => {
    setFilters(newFilters); // Updates filters state
    applyFilters(transactions, newFilters); // Applies filters to transactions
  };

  // Pagination calculations
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

  // Handles page change
  const handlePageChange = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > Math.ceil(filteredTransactions.length / transactionsPerPage)) {
      return;
    }
    setCurrentPage(pageNumber); // Updates current page
  };

  // Toggles visibility of columns for export
  const toggleColumn = (column: string) => {
    setSelectedColumns(prevColumns =>
      prevColumns.includes(column)
        ? prevColumns.filter(col => col !== column)
        : [...prevColumns, column]
    );
  };

  // Initializes database on component mount
  useEffect(() => {
    const loadDatabase = async () => {
      await initDB(); // Initializes indexedDB

      // Initial transaction data
      const initialTransactions = [
        { id: "1", clientName: 'Client A', amount: 100, status: 'completed', type: 'Refill', date: '2024-01-01' },
        { id: "2", clientName: 'Client B', amount: 200, status: 'pending', type: 'Withdrawal', date: '2024-02-01' },
        { id: "3", clientName: 'Client C', amount: 300, status: 'failed', type: 'Refill', date: '2024-03-01' },
      ];

      const dbTransactions = await getTransactions(); // Retrieves transactions from indexedDB
      if (dbTransactions.length === 0) {
        for (const transaction of initialTransactions) {
          await addTransaction(transaction); // Adds initial transactions to indexedDB if empty
        }
      }

      const transactionsFromDB: Transaction[] = await getTransactions(); // Retrieves transactions from indexedDB

      setTransactions(transactionsFromDB);
      setFilteredTransactions(transactionsFromDB);
    };

    loadDatabase();
  }, []);

  return (
    <Box display="flex" justifyContent="space-around" mt={4}>
      {/* Pie chart component */}
      <PieChart filteredTransactions={filteredTransactions} />

      <Box p={4}>
        <Box mb={4} display="flex" justifyContent="space-between">
          {/* Filter component */}
          <Filter onFilterChange={handleFilterChange} />

          {/* Import button and export button */}
          <Box>
            <ImportButton mr={"2"} onImport={handleImport} />
            <Button onClick={() => setIsExportModalOpen(true)}>Export</Button>
          </Box>
        </Box>

        {/* Transactions table */}
        <Table variant="simple">
          <Thead>
            <Tr>
              {columns.map(column => (
                <Th key={column}>{column}</Th>
              ))}
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
                <Td>{transaction.date && new Intl.DateTimeFormat('ua').format(new Date(transaction.date))}</Td>
                <Td>
                  {/* Edit and delete buttons */}
                  <Button mr={2} colorScheme="blue" onClick={() => handleEdit(transaction)}>Edit</Button>
                  <Button colorScheme="red" onClick={() => handleDelete(transaction.id)}>Delete</Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        {/* Pagination component */}
        <Pagination
          totalTransactions={filteredTransactions.length}
          transactionsPerPage={transactionsPerPage}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />

        {/* Edit transaction modal */}
        {selectedTransaction && (
          <EditTransactionModal
            transaction={selectedTransaction}
            onClose={() => setSelectedTransaction(null)}
            onUpdate={handleUpdateTransaction}
          />
        )}

        {/* Delete transaction modal */}
        <DeleteTransactionModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onDelete={handleConfirmDelete}
        />

        {/* Export modal */}
        <Modal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Select Columns to Export</ModalHeader>
            <ModalBody>
              {/* Checkbox options for columns */}
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
              {/* Export button */}
              <Button colorScheme="blue" onClick={() => {
                handleExport();
                setIsExportModalOpen(false);
              }}>Export</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Box>
  );
};

export default TransactionsPage;
