import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalBottomProps {
  isOpen: boolean;
  onClose: () => void;
  title1?: string;
  title2?: string;
  children?: React.ReactNode;
}

const ModalBottom: React.FC<ModalBottomProps> = ({ isOpen, onClose, title1, title2, children }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  const handleBackgroundClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClose();
  };

  return ReactDOM.createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackgroundClick}>
          <motion.div
            className="relative max-h-[420px] w-[600px] rounded-t-2xl bg-white p-4 shadow-lg"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}>
            <div className="text-center text-2xl font-semibold xs:text-xl">{title1}</div>
            <div className="text-center text-2xl font-semibold xs:text-xl">{title2}</div>
            <div className="max-h-[360px] overflow-y-auto">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.getElementById('modal-root')!,
  );
};

export default ModalBottom;
