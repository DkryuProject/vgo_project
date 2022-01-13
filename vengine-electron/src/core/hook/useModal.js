import { useCallback, useState } from 'react';

export default () => {
    const [modal, setModal] = useState(false);
    const [modalContent, setModalContent] = useState(null);
    const [modalTitle, setModalTitle] = useState(null);
    const [modalConfirm, setModalConfirm] = useState(null);
    const [modalWidth, setModalWidth] = useState('');

    const handleModal = useCallback(
        (title, content = false, modalConfirm) => {
            setModal(!modal);

            if (content) {
                setModalContent(content);
            }

            if (title) {
                setModalTitle(title);
            }

            if (modalConfirm) {
                setModalConfirm(modalConfirm);
            }
        },
        [modal, setModal, setModalContent, setModalTitle, setModalConfirm]
    );

    const closeModal = useCallback(
        (content = false) => {
            setModal(false);
            setModalContent(content);
        },
        [setModal, setModalContent]
    );

    const openModal = useCallback(
        (title, content = false, modalConfirm, modalWidth) => {
            setModal(true);

            if (modalWidth) {
                setModalWidth(modalWidth);
            }

            if (content) {
                setModalContent(content);
            }

            if (title) {
                setModalTitle(title);
            }

            if (modalConfirm) {
                setModalConfirm({ fn: modalConfirm });
            }
        },
        [
            setModal,
            setModalContent,
            setModalTitle,
            setModalConfirm,
            setModalWidth,
        ]
    );

    return {
        modal,
        modalContent,
        handleModal,
        openModal,
        closeModal,
        modalTitle,
        modalConfirm,
        modalWidth,
    };
};
