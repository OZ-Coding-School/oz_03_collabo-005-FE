import React from 'react';
import ReactDOM from 'react-dom';

interface ModalCenterProps {
  isOpen: boolean;
  onClose: () => void;
  title1?: string;
  title2?: string;
  children?: React.ReactNode;
}

// ModalCenter 를 위한 컴포넌트.

const ModalCenter: React.FC<ModalCenterProps> = ({ isOpen, title1, title2, children }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative mx-3 w-[600px] rounded-lg bg-white p-8 shadow-lg">
        <div className="text-center text-2xl font-semibold">{title1}</div>
        <div className="text-center text-2xl font-semibold">{title2}</div>
        <div className="mt-4 text-center">{children}</div>
      </div>
    </div>,
    document.getElementById('modal-root')!,
  );
};

export default ModalCenter;
