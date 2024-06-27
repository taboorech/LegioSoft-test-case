import React, { ChangeEvent, useRef } from 'react';
import { Button, Input } from '@chakra-ui/react';
import { parseCSV } from '../../utils/parse-csv';
import { Transaction } from '../../types/Transaction';

interface ImportButtonProps {
  mr: string;
  onImport: (transactions: Transaction[]) => void;
}

const ImportButton: React.FC<ImportButtonProps> = ({ mr, onImport }) => {

  const inputRef: React.LegacyRef<HTMLInputElement> = useRef(null);

  const buttonClickHandler = () => {
    inputRef.current?.click()
  }

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const csv = reader.result as string;
        const transactions = parseCSV(csv);
        onImport(transactions);
      };
      reader.readAsText(file);
    }
  };

  return (
    <Button onClick={buttonClickHandler} mr={mr}>
      <Input ref={inputRef} type="file" accept=".csv" onChange={handleFileUpload} style={{ display: 'none' }}/>
      Import
    </Button>
  );
};

export default ImportButton;
