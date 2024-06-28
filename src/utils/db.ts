import { Transaction } from "../types/Transaction.type";

// Database name and version
const DB_NAME = 'transactionsDB';
const DB_VERSION = 1;
let db: any; // Variable to hold the IndexedDB instance

// Function to initialize the IndexedDB database
const initDB = () => {
  return new Promise((resolve: any, reject: any) => {
    // Open IndexedDB with specified name and version
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    // Error handler for database opening
    request.onerror = function(event: any) {
      console.error("Database error: " + event.target.errorCode);
      reject(event.target.errorCode); // Reject promise on error
    };

    // Success handler for database opening
    request.onsuccess = function(event: any) {
      db = event.target.result; // Set db variable to the opened database instance
      console.log("Database opened successfully");
      resolve(); // Resolve promise on successful database open
    };

    // Upgrade handler for database version change
    request.onupgradeneeded = function(event: any) {
      db = event.target.result; // Set db variable to the upgraded database instance
      console.log("Database upgrade needed");

      // Create object store 'transactions' if it doesn't exist
      if (!db.objectStoreNames.contains('transactions')) {
        const store = db.createObjectStore('transactions', { keyPath: 'id', autoIncrement: true });

        // Create indexes on object store for efficient querying
        store.createIndex('clientName', 'clientName', { unique: false });
        store.createIndex('amount', 'amount', { unique: false });
        store.createIndex('status', 'status', { unique: false });
        store.createIndex('type', 'type', { unique: false });
        store.createIndex('date', 'date', { unique: false });
      }
    };
  });
};

// Function to add a transaction to IndexedDB
const addTransaction = (transaction: Transaction) => {
  const transactionStore = db.transaction(['transactions'], 'readwrite').objectStore('transactions'); // Open transaction on 'transactions' store

  return new Promise((resolve: any, reject: any) => {
    const request = transactionStore.add(transaction); // Add transaction to the object store

    // Success handler for adding transaction
    request.onsuccess = function() {
      console.log('Transaction added successfully');
      resolve(); // Resolve promise on successful transaction addition
    };

    // Error handler for adding transaction
    request.onerror = function(event: any) {
      console.error('Error adding transaction: ' + event.target.errorCode);
      reject(event.target.errorCode); // Reject promise on error adding transaction
    };
  });
};

// Function to fetch all transactions from IndexedDB
const getTransactions = (): Promise<Transaction[]> => {
  const transactionStore = db.transaction(['transactions'], 'readonly').objectStore('transactions'); // Open read-only transaction on 'transactions' store

  return new Promise((resolve, reject) => {
    const request = transactionStore.getAll(); // Get all transactions from object store

    // Success handler for fetching transactions
    request.onsuccess = function(event: any) {
      const transactions = event.target.result; // Retrieve transactions from request result
      resolve(transactions); // Resolve promise with fetched transactions
    };

    // Error handler for fetching transactions
    request.onerror = function(event: any) {
      console.error('Error fetching transactions: ' + event.target.errorCode);
      reject(event.target.errorCode); // Reject promise on error fetching transactions
    };
  });
};

// Exporting functions for initializing, adding, and fetching transactions from IndexedDB
export { initDB, addTransaction, getTransactions };
