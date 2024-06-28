import { Transaction } from '../types/Transaction.type';

/**
 * Parses a CSV string into an array of Transaction objects.
 * Assumes the CSV format: id, status, type, clientName, amount, date
 * @param csv The CSV string to parse
 * @returns An array of Transaction objects
 */
export const parseCSV = (csv: string): Transaction[] => {
  const lines = csv.split('\n'); // Split CSV into lines
  const result: Transaction[] = []; // Initialize an empty array to store parsed transactions

  // Iterate over each line (skipping the header line at index 0)
  for (const line of lines.slice(1)) {
    const [id, status, type, clientName, amount, date] = line.split(','); // Split line into CSV fields

    // Push a new Transaction object into the result array, converting amount to a number
    result.push({
      id,
      status,
      type,
      clientName,
      amount: parseFloat(amount.replace(/[^0-9\.]+/g,"")), // Parse amount as float, removing non-numeric characters
      date,
    });
  }

  return result; // Return the array of parsed Transaction objects
};
