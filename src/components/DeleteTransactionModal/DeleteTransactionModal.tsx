import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react";

// Props for the delete transaction modal component
interface DeleteTransactionModalProps {
  isOpen: boolean; // Indicates if the modal is open
  onClose: () => void; // Function to close the modal
  onDelete: () => void; // Function called when deletion is confirmed
}

// Modal component for confirming transaction deletion
const DeleteTransactionModal: React.FC<DeleteTransactionModalProps> = ({ isOpen, onClose, onDelete }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Confirm Deletion</ModalHeader>
        <ModalBody>
          Are you sure you want to delete this transaction?
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="red" mr={3} onClick={onDelete}>Delete</Button>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteTransactionModal;
