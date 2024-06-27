import React from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, FormControl, FormLabel, Input, FormErrorMessage, Select } from '@chakra-ui/react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Transaction } from '../../types/Transaction.type';

interface EditTransactionModalProps {
  transaction: Transaction;
  onClose: () => void;
  onUpdate: (updatedTransaction: Transaction) => void;
}

const EditTransactionModal: React.FC<EditTransactionModalProps> = ({ transaction, onClose, onUpdate }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<Transaction>({
    defaultValues: {
      status: transaction.status,
      type: transaction.type,
      clientName: transaction.clientName,
      amount: transaction.amount,
    },
  });

  const onSubmit: SubmitHandler<Transaction> = (data) => {
    const updatedTransaction = { ...transaction, ...data };
    onUpdate(updatedTransaction);
    onClose();
  };

  return (
    <Modal isOpen={!!transaction} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Transaction</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl isInvalid={!!errors.status} mb={4}>
              <FormLabel>Status</FormLabel>
              <Select {...register('status', { required: 'Status is required' })}>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </Select>
              <FormErrorMessage>{errors.status && errors.status.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.type} mb={4}>
              <FormLabel>Type</FormLabel>
              <Select {...register('type', { required: 'Type is required' })}>
                <option value="Refill">Refill</option>
                <option value="Withdrawal">Withdrawal</option>
              </Select>
              <FormErrorMessage>{errors.type && errors.type.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.clientName} mb={4}>
              <FormLabel>Client Name</FormLabel>
              <Input {...register('clientName', { required: 'Client Name is required' })} />
              <FormErrorMessage>{errors.clientName && errors.clientName.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.amount} mb={4}>
              <FormLabel>Amount</FormLabel>
              <Input type="number" step="0.01" {...register('amount', { required: 'Amount is required' })} />
              <FormErrorMessage>{errors.amount && errors.amount.message}</FormErrorMessage>
            </FormControl>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit(onSubmit)}>
            Save
          </Button>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditTransactionModal;
