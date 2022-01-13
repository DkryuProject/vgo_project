const useValidateMessage = () => {
    // const handleValidateMessage = useCallback((label) => {
    //     return {
    //         required: `${label} is required!`,
    //     };
    // }, []);

    const handleValidateMessage = {
        required: '${label} is required!', // eslint-disable-line
    };

    return [handleValidateMessage];
};

export default useValidateMessage;
