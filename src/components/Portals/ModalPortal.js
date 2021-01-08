import { useEffect } from 'react';
import ReactDOM from 'react-dom';

const modalRoot = document.getElementById('modalRoot');

function ModalPortal({ children, modal, setModal }) {
  const modalElement = document.createElement('div');
  modalElement.classList.add('modalBlock');

  useEffect(() => {
    // cdm
    modalRoot.appendChild(modalElement);
    const dir = localStorage.i18nextLng === 'ar' ? 'rtl' : 'auto';

    modalElement.classList.add('active');
    modalElement.classList.add(dir);
    document.body.classList.add('fixed');

    modalElement.addEventListener('click', e => {
      // @ts-ignore
      const isOutside = !e.target.closest('.modalBlock > div:first-child');
      isOutside && setModal({ showModal: false, modalType: undefined, modalItemId: undefined });
    });
    // cwum
    return () => {
      modalRoot.classList.remove('active');
      modalRoot.removeChild(modalElement);
      document.body.classList.remove('fixed');
    };
  }, [modal, setModal, modalElement]);

  return ReactDOM.createPortal(children, modalElement);
}

export default ModalPortal;
