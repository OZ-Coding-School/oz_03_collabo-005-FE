import React from 'react';
import ReactDOM from 'react-dom';

interface ModalBottomProps {
  isOpen: boolean;
  onClose: () => void;
  title1: string;
  title2: string;
  children: React.ReactNode;
}

// ModalBottom 을 위한 컴포넌트.

const ModalBottom: React.FC<ModalBottomProps> = ({ isOpen, title1, title2, children }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-50">
      <div className="relative w-[600px] rounded-t-lg bg-white p-8 shadow-lg">
        <div className="text-center text-2xl font-semibold">{title1}</div>
        <div className="text-center text-2xl font-semibold">{title2}</div>
        <div className="mt-4 text-center">{children}</div>
      </div>
    </div>,

    document.getElementById('modal-root')!,
  );
};

export default ModalBottom;
