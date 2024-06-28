import React, { ChangeEvent, useRef } from 'react';
import { Button, Input } from '@chakra-ui/react';
import { parseCSV } from '../../utils/parse-csv';
import { Transaction } from '../../types/Transaction.type';

// Props for the import button component
interface ImportButtonProps {
  mr: string; // Margin right value for the button
  onImport: (transactions: Transaction[]) => void; // Function called when transactions are imported
}

// Import button component for uploading CSV files
const ImportButton: React.FC<ImportButtonProps> = ({ mr, onImport }) => {
  const inputRef: React.LegacyRef<HTMLInputElement> = useRef(null);

  // Handler to simulate file input click when button is clicked
  const buttonClickHandler = () => {
    inputRef.current?.click();
  };

  // Handler for file upload
  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const csv = reader.result as string; // Assume the result is a string
        const transactions = parseCSV(csv); // Parse CSV data into transactions
        onImport(transactions); // Call parent component's import function with parsed transactions
      };
      reader.readAsText(file); // Read the file as text
    }
  };

  return (
    <Button onClick={buttonClickHandler} mr={mr}>
      <Input ref={inputRef} type="file" accept=".csv" onChange={handleFileUpload} style={{ display: 'none' }} />
      Import
    </Button>
  );
};

export default ImportButton;
