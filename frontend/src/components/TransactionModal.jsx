// Transaction Modal Component for displaying transaction form
import { useState } from 'react';
import TransactionForm from './TransactionForm';

const TransactionModal = ({ isOpen, onClose, transaction = null, onSuccess }) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 200); // Match CSS transition duration
  };

  const handleSuccess = () => {
    if (onSuccess) {
      onSuccess();
    }
    handleClose();
  };

  if (!isOpen) {
    console.log('Modal is not open, returning null');
    return null;
  }

  console.log('Modal is open, rendering modal');
  return (
    <div 
      className={`modal-overlay ${isClosing ? 'closing' : ''}`} 
      onClick={(e) => {
        // Only close if clicking directly on the overlay, not on child elements
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <TransactionForm
          transaction={transaction}
          onClose={handleClose}
          onSuccess={handleSuccess}
        />
      </div>
    </div>
  );
};

export default TransactionModal;
