import { Transaction } from "../types/Transaction.type";

const DB_NAME = 'transactionsDB';
const DB_VERSION = 1;
let db: any;

const initDB = () => {
  return new Promise((resolve: any, reject: any) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = function(event: any) {
      console.error("Database error: " + event.target.errorCode);
      reject(event.target.errorCode);
    };

    request.onsuccess = function(event: any) {
      db = event.target.result;
      console.log("Database opened successfully");
      resolve();
    };

    request.onupgradeneeded = function(event: any) {
      db = event.target.result;
      console.log("Database upgrade needed");

      if (!db.objectStoreNames.contains('transactions')) {
        const store = db.createObjectStore('transactions', { keyPath: 'id', autoIncrement: true });
        store.createIndex('clientName', 'clientName', { unique: false });
        store.createIndex('amount', 'amount', { unique: false });
        store.createIndex('status', 'status', { unique: false });
        store.createIndex('type', 'type', { unique: false });
        store.createIndex('date', 'date', { unique: false });
      }
    };
  });
};

const addTransaction = (transaction: Transaction) => {
  const transactionStore = db.transaction(['transactions'], 'readwrite').objectStore('transactions');
  return new Promise((resolve: any, reject: any) => {
    const request = transactionStore.add(transaction);
    request.onsuccess = function() {
      console.log('Transaction added successfully');
      resolve();
    };
    request.onerror = function(event: any) {
      console.error('Error adding transaction: ' + event.target.errorCode);
      reject(event.target.errorCode);
    };
  });
};

const getTransactions = (): Promise<Transaction[]> => {
  const transactionStore = db.transaction(['transactions'], 'readonly').objectStore('transactions');
  return new Promise((resolve, reject) => {
    const request = transactionStore.getAll();
    request.onsuccess = function(event: any) {
      const transactions = event.target.result;
      resolve(transactions);
    };
    request.onerror = function(event: any) {
      console.error('Error fetching transactions: ' + event.target.errorCode);
      reject(event.target.errorCode);
    };
  });
};

export { initDB, addTransaction, getTransactions };
