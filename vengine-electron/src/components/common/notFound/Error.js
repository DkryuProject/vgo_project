import React from 'react';
import { Result, Button } from 'antd';

const Error = (props) => {
    // const { error, resetErrorBoundary } = props;

    return (
        <Result
            status="warning"
            title="An unknown error has occurred"
            extra={
                <Button
                    type="primary"
                    onClick={() => (window.location.href = '/')}
                >
                    Back Home
                </Button>
            }
        />
    );
};

export default Error;
