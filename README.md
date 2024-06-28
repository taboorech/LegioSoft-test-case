# Transactions Management System

This project is a web-based application for managing financial transactions. It includes functionalities for importing, exporting, filtering, and visualizing transactions. The application is built with React, TypeScript, Chakra UI, IndexedDB, and react-query.

## Features

 * **User Authentication**: Login functionality to secure the application.
 * **Transactions Management**: Add, edit, delete, filter, and paginate transactions.
 * **Import/Export**: Import transactions from a CSV file and export transactions to a CSV file.
 * **Charts: Visualize** transaction data with pie charts.
 * **Client-side Storage**: Uses IndexedDB for storing transaction data locally.

## Tech Stack
 * **React**: A JavaScript library for building user interfaces.
 * **TypeScript**: A strongly typed programming language that builds on JavaScript.
 * **Chakra UI**: A simple, modular, and accessible component library for React.
 * **IndexedDB**: A low-level API for storing large amounts of structured data.
 * **React Query**: Data-fetching library for React to manage server state.

## Getting Started

### Prerequisites
 * Node.js and npm installed on your machine.

## Installation
1. Clone the repository:
  ```
  git clone https://github.com/your-username/transactions-management-system.git
  ```
2. Navigate to the project directory:
  ```
  cd LegioSoft-test-case
  ```
3. Install dependencies:
  ```
  npm install
  ```

## Running the Application

1. Start the development server:
  ```
  npm run dev
  ```
2. Open your browser and go to http://localhost:5173.

## Usage
### Authentication
 * Login with your username and password to access the application.
 * The token is stored in local storage to maintain the session.
### Managing Transactions
 * **Import**: Click on the import button and select a CSV file to import transactions.
 * **Export**: Click on the export button to export the filtered transactions to a CSV file.
 * **Edit/Delete**: Use the edit and delete buttons to modify or remove transactions.
 * **Filter**: Use the filter component to filter transactions based on various criteria.
 * **Pagination**: Navigate through pages of transactions using the pagination component.
 * **Visualization**: View the pie chart to get an overview of transaction statuses.
### IndexedDB Integration
 * The application uses IndexedDB for client-side storage of transactions.
 * **initDB**: Initializes the database.
 * **addTransaction**: Adds a transaction to the database.
 * **getTransactions**: Retrieves transactions from the database.