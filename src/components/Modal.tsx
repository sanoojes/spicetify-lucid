import UI from '@/components/ui';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

type ModalProps = {
  isOpen: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
};

const Modal: React.FC<ModalProps> = ({ isOpen, title, children, onClose }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="GenericModal__overlay" style={{ zIndex: 20 }} onClick={onClose}>
      <div
        className="GenericModal"
        role="dialog"
        aria-label={title}
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="main-embedWidgetGenerator-container">
          <div className="main-trackCreditsModal-header">
            <h1 className="main-type-alto">{title}</h1>
            <div className="btn-wrapper">
              <UI.HeaderButtons closeModal={onClose} />
            </div>
          </div>
          <div className="main-trackCreditsModal-mainSection">
            <main className="main-trackCreditsModal-originalCredits">{children}</main>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
