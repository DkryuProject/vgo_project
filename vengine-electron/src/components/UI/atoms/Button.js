import React, { forwardRef, useMemo } from 'react';
import styled from 'styled-components';
import { Tooltip } from 'components/UI/atoms';
import { Button as AntButton } from 'antd';
import {
    PlusCircleOutlined,
    MinusCircleOutlined,
    CheckOutlined,
    CloseOutlined,
    RedoOutlined,
    CopyOutlined,
    DeleteOutlined,
    SearchOutlined,
    EditOutlined,
    CopyrightOutlined,
    UserOutlined,
    // LogoutOutlined,
    FormOutlined,
    QuestionOutlined,
    BellOutlined,
} from '@ant-design/icons';
import { Fragment } from 'react';

const Button = forwardRef((props, ref) => {
    const {
        onClick,
        children,
        isDisabled,
        size,
        mode,
        style,
        className,
        tooltip,
    } = props;

    const icon = useMemo(() => {
        switch (mode) {
            case 'write':
                return <FormOutlined />;
            case 'save':
                return <CheckOutlined />;
            case 'add':
                return <PlusCircleOutlined />;
            case 'remove':
                return <MinusCircleOutlined />;
            case 'cancel':
                return <CloseOutlined />;
            case 'reset':
                return <RedoOutlined />;
            case 'copy':
                return <CopyOutlined />;
            case 'modify':
                return <EditOutlined />;
            case 'delete':
                return <DeleteOutlined />;
            case 'search':
                return <SearchOutlined />;
            case 'bell':
                return <BellOutlined />;
            case 'question':
                return <QuestionOutlined />;
            case 'user':
                return <UserOutlined />;
            case 'company':
                return <CopyrightOutlined />;
            // case 'logout':
            //     return (
            //         <LogoutOutlined
            //             style={{
            //                 color:
            //                     process.env.REACT_APP_BASE_URL ===
            //                     'https://vgo-api.vengine.io'
            //                         ? 'red'
            //                         : 'blue',
            //             }}
            //         />
            //     );
            default:
                return;
        }
    }, [mode]);

    return (
        <Fragment>
            {tooltip ? (
                <Tooltip
                    title={tooltip?.title}
                    placement={tooltip?.placement || 'topLeft'}
                    arrowPointAtCenter={tooltip?.arrowPointAtCenter || true}
                >
                    <ButtonStyle style={style}>
                        <AntButton
                            ref={ref}
                            className={className}
                            icon={icon}
                            size={size}
                            onClick={onClick}
                            disabled={isDisabled}
                        >
                            {children}
                        </AntButton>
                    </ButtonStyle>
                </Tooltip>
            ) : (
                <ButtonStyle style={style}>
                    <AntButton
                        ref={ref}
                        className={className}
                        icon={icon}
                        size={size}
                        onClick={onClick}
                        disabled={isDisabled}
                    >
                        {children}
                    </AntButton>
                </ButtonStyle>
            )}
        </Fragment>
    );
});

Button.defaultProps = {
    onClick: null,
    children: null,
    isDisabled: false,
    size: 'small',
    mode: null,
    style: null,
    tooltip: null,
};

const ButtonStyle = styled.div`
    span {
        color: ${(props) => props?.style?.color || '#000'};
    }
    button:hover .anticon {
        color: ${(props) => props?.style?.color || '#000'};
    }
    .anticon {
        font-size: 1rem;
        line-height: 1.5;
        color: ${(props) => props?.style?.color || '#000'};
        border-color: ${(props) => props?.style?.color || '#000'};
    }
`;

export default Button;
