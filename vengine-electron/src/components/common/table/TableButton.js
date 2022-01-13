import React from 'react';
import styled, { css } from 'styled-components';
import { Tooltip, Button } from 'antd';
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
    LogoutOutlined,
    FormOutlined,
    SnippetsOutlined,
    BellOutlined,
} from '@ant-design/icons';

const TableButton = (props) => {
    const { size, toolTip, onClick, mode, children, disabled } = props;

    const icon = (() => {
        if (children) return false;
        switch (mode) {
            case 'write':
                return <FormOutlined className="icon" />;
            case 'save':
                return <CheckOutlined className="icon" />;
            case 'add':
                return <PlusCircleOutlined className="icon" />;
            case 'remove':
                return <MinusCircleOutlined className="icon" />;
            case 'cancel':
                return <CloseOutlined className="icon" />;
            case 'reset':
                return <RedoOutlined className="icon" />;
            case 'copy':
                return <CopyOutlined className="icon" />;
            case 'modify':
                return <EditOutlined className="icon" />;
            case 'delete':
                return <DeleteOutlined className="icon" />;
            case 'search':
                return <SearchOutlined className="icon" />;
            case 'bell':
                return (
                    <BellOutlined
                        className="icon"
                        style={{
                            color: '#068485',
                        }}
                    />
                );
            case 'question':
                return (
                    <SnippetsOutlined
                        className="icon"
                        style={{
                            color: '#068485',
                        }}
                    />
                );
            case 'user':
                return (
                    <UserOutlined
                        className="icon"
                        style={{
                            color: '#068485',
                        }}
                    />
                );
            case 'company':
                return (
                    <CopyrightOutlined
                        className="icon"
                        style={{
                            color: '#068485',
                        }}
                    />
                );
            case 'logout':
                return (
                    <LogoutOutlined
                        className="icon"
                        style={{
                            color:
                                process.env.REACT_APP_BASE_URL ===
                                'https://vgo-api.vengine.io'
                                    ? 'red'
                                    : 'blue',
                        }}
                    />
                );
            default:
                return;
        }
    })();

    return (
        <>
            {toolTip ? (
                <Tooltip
                    placement={toolTip.placement}
                    title={toolTip.title}
                    arrowPointAtCenter={toolTip.arrowPointAtCenter}
                >
                    <ButtonWrap mode={mode}>
                        <Button
                            className="button"
                            icon={icon}
                            size={size}
                            onClick={onClick}
                            disabled={disabled}
                        >
                            {children}
                        </Button>
                    </ButtonWrap>
                </Tooltip>
            ) : (
                <ButtonWrap mode={mode}>
                    <Button
                        className="button"
                        icon={icon}
                        size={size}
                        onClick={onClick}
                        disabled={disabled}
                    >
                        {children}
                    </Button>
                </ButtonWrap>
            )}
        </>
    );
};

const ButtonWrap = styled.div`
    .button {
        padding-top: 3px;
        .icon {
            font-size: 16px;
        }

        border-color: #000000;
        color: #000000;
        .icon {
            color: #000000;
        }

        ${(props) => {
            if (
                props.mode === 'user' ||
                props.mode === 'company' ||
                props.mode === 'question' ||
                props.mode === 'logout' ||
                props.mode === 'bell'
            ) {
                if (props.mode === 'logout') {
                    return process.env.REACT_APP_BASE_URL ===
                        'https://vgo-api.vengine.io'
                        ? css`
                              border-color: red;
                          `
                        : css`
                              border-color: blue;
                          `;
                }
                return css`
                    border-color: #068485;
                `;
            }
        }}
    }
`;

// const ButtonWrap = styled.div`
//     .button {
//         padding-top: 3px;
//         .icon {
//             font-size: 16px;
//         }

//         ${(props) => {
//             switch (props.mode) {
//                 case "save":
//                     return css`
//                         border-color: #4693ff;
//                         color: #4693ff;
//                         .icon {
//                             color: #4693ff;
//                         }
//                     `;
//                 case "add":
//                     return css`
//                         border-color: #4693ff;
//                         color: #4693ff;
//                         .icon {
//                             color: #4693ff;
//                         }
//                     `;
//                 case "remove":
//                     return css`
//                         border-color: #ff4d4f;
//                         color: #ff4d4f;
//                         .icon {
//                             color: #ff4d4f;
//                         }
//                     `;
//                 case "cancel":
//                     return css`
//                         border-color: #ff4d4f;
//                         color: #ff4d4f;
//                         .icon {
//                             color: #ff4d4f;
//                         }
//                     `;
//                 case "reset":
//                     return css`
//                         border-color: #73d13d;
//                         color: #73d13d;
//                         .icon {
//                             color: #73d13d;
//                         }
//                     `;
//                 case "copy":
//                     return css`
//                         border-color: #000;
//                         color: #000;
//                         .icon {
//                             color: #000;
//                         }
//                     `;
//                 case "delete":
//                     return css`
//                         border-color: #000;
//                         color: #000;
//                         .icon {
//                             color: #000;
//                         }
//                     `;
//                 case "search":
//                     return css`
//                         border-color: #40a9ff;
//                         color: #40a9ff;
//                         .icon {
//                             color: #40a9ff;
//                         }
//                     `;
//                 default:
//                     return;
//             }
//         }}
// `;
export default TableButton;
