import React from 'react';
import ReactDOM from 'react-dom';
import { RxArrowLeft } from 'react-icons/rx';
import { motion, AnimatePresence } from 'framer-motion'; // AnimatePresence 추가

interface BoardIdCommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  title1: string;
  title2: string;
  children: React.ReactNode;
}

// BoardIdCommentModal 를 위한 컴포넌트.

const BoardIdCommentModal: React.FC<BoardIdCommentModalProps> = ({ isOpen, title1, title2, children, onClose }) => {
  return ReactDOM.createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}>
          <motion.div
            className="relative h-[300px] w-full max-w-[600px] rounded-lg bg-white p-8"
            initial={{ y: '100vh' }}
            animate={{ y: 0 }}
            exit={{ y: '100vh' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
            <div className="flex items-center">
              <button onClick={() => onClose()} className="flex items-center hover:text-gray-700" title="닫기">
                <RxArrowLeft size={25} />
              </button>
              <div className="ml-4 text-xl font-semibold">{title1}</div>
            </div>
            <div className="mt-8 text-left font-semibold">{title2}</div>
            <div className="mt-4 text-center">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.getElementById('modal-root')!,
  );
};

export default BoardIdCommentModal;
