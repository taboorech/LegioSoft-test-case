import React from 'react';
import { Button } from '@chakra-ui/react';

interface ExportButtonProps {
  onExport: () => void;
}

const ExportButton: React.FC<ExportButtonProps> = ({ onExport }) => {
  return (
    <Button onClick={onExport}>Export</Button>
  );
};

export default ExportButton;
