import React from 'react';
import useModal from 'core/hook/useModal';
import { ModalPortal } from 'components/UI/molecules';

let ModalContext;
const { Provider } = (ModalContext = React.createContext());

const ModalProvider = ({ children }) => {
    const {
        modal,
        modalContent,
        handleModal,
        openModal,
        closeModal,
        modalTitle,
        modalConfirm,
        modalWidth,
    } = useModal();
    return (
        <Provider
            value={{
                modal,
                modalContent,
                handleModal,
                openModal,
                closeModal,
                modalTitle,
                modalConfirm,
                modalWidth,
            }}
        >
            <ModalPortal />
            {children}
        </Provider>
    );
};

export { ModalContext, ModalProvider };
