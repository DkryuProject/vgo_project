import React from 'react';
import ReactDOM from 'react-dom';
import { ModalContext } from 'components/context/modalContext';
import { Modal } from 'antd';

const buttonProps = { style: { display: 'none' } };

const ModalPortal = () => {
    const el = document.getElementById('modal');
    const {
        modal,
        modalContent,
        closeModal,
        modalTitle,
        modalConfirm,
        modalWidth,
    } = React.useContext(ModalContext);
    if (modal) {
        return ReactDOM.createPortal(
            <div style={{ fontSize: '100px' }}>
                <Modal
                    title={
                        <div style={{ fontSize: '0.6875rem', fontWeight: 600 }}>
                            {modalTitle}
                        </div>
                    }
                    centered
                    okButtonProps={modalConfirm?.fn || buttonProps}
                    // cancelButtonProps={buttonProps}
                    visible={modal}
                    onOk={modalConfirm?.fn}
                    onCancel={closeModal}
                    closable={false}
                    width={modalWidth || '90%'}
                >
                    {modalContent}
                </Modal>
            </div>,
            el
        );
    } else return null;
};

export default ModalPortal;
