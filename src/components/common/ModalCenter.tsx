import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

interface ModalCenterProps {
  isOpen: boolean;
  onClose: () => void;
  title1?: string;
  title2?: string;
  children?: React.ReactNode;
}

// ModalCenter component

const ModalCenter: React.FC<ModalCenterProps> = ({ isOpen, onClose, title1, title2, children }) => {
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

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
      <div className="relative mx-3 w-[600px] rounded-lg bg-white p-6 shadow-lg" onClick={(e) => e.stopPropagation()}>
        <div className="xxs:text-[20px] text-center text-2xl font-semibold xs:text-[22px]">{title1}</div>
        <div className="xxs:text-[20px] text-center text-2xl font-semibold xs:text-[22px]">{title2}</div>
        <div className="mt-4 text-center">{children}</div>
      </div>
    </div>,
    document.getElementById('modal-root')!,
  );
};

export default ModalCenter;
