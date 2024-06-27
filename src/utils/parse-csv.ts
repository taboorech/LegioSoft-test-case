import { Transaction } from '../types/Transaction';

export const parseCSV = (csv: string): Transaction[] => {
  const lines = csv.split('\n');
  const result: Transaction[] = [];

  for (const line of lines.slice(1)) {
    const [id, status, type, clientName, amount, date] = line.split(',');

    result.push({
      id,
      status,
      type,
      clientName,
      amount: parseFloat(amount.replace(/[^0-9\.]+/g,"")),
      date,
    });
  }

  return result;
};
