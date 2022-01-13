import styled from 'styled-components';

const SignWrap = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    ${(props) => (props.signin || props.signup) && 'min-width: 1000px'};
    transform: translate(-50%, -50%);

    .shadow {
        border-radius: 3px;
        box-shadow: 3px 3px #c0c0c0;
    }

    .titleWrap {
        h2 {
            ${({ theme }) => theme.fonts.h2};
        }
        h3 {
            ${({ theme }) => theme.fonts.h3};
        }
    }

    .ant-card {
        margin: ${({ theme }) => theme.margins.xxxl}
            ${(props) => (props.signin ? '30%' : '2%')} 0;

        .ant-card-head-title {
            ${({ theme }) => theme.fonts.h7};
        }

        .formInput .ant-input,
        .ant-select-selector {
            ${({ theme }) => theme.fonts.display_3};
        }

        .formButton {
            width: 100%;

            & + .formButton {
                // margin-top: 1rem;
                margin-top: ${({ theme }) => theme.margins.xxl};
            }
        }
    }

    .ant-col.ant-col-8.ant-form-item-label {
        label {
            color: '#7f7f7f';
            ${(props) => props.theme.fonts.h5};
        }
    }

    .ant-form-item-control-input-content
        .ant-select.ant-select-borderless.ant-select-single.ant-select-show-arrow.ant-select-show-search {
        border-bottom: 1px solid lightgray;
        border-radius: 0px;
        ${(props) => props.theme.fonts.h5};
    }

    .ant-select.ant-select-borderless.ant-select-multiple.ant-select-show-search {
        border-bottom: 1px solid lightgray;
        border-radius: 0px;
        ${(props) => props.theme.fonts.h5};
    }

    .ant-form-item-control-input-content > input {
        border-bottom: 1px solid lightgray;
        border-radius: 0px;
        ${(props) => props.theme.fonts.h5};
    }

    .ant-input-number-input-wrap {
        border-bottom: 1px solid lightgray;
        border-radius: 0px;
        ${(props) => props.theme.fonts.h5};
    }

    .ant-form-item-control-input-content > span {
        border-bottom: 1px solid lightgray;
        border-radius: 0px;
        ${(props) => props.theme.fonts.h5};
    }

    .ant-select-dropdown.ant-select-dropdown-placement-bottomLeft.ant-select-dropdown-hidden {
        display: none;
    }

    .ant-select-selection-placeholder,
    .ant-input-password input {
        text-align: left;
        ${(props) => props.theme.fonts.h5};
    }

    .buttonWrap {
        display: flex;
        justify-content: flex-end;
        .ant-form-item {
            margin-bottom: 0;
        }
    }
`;

export default SignWrap;
