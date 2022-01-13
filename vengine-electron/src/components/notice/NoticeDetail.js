import React, { useCallback, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useNotification from 'core/hook/useNotification';
import dateFormat from 'core/utils/dateUtil';
import useGtag from 'core/hook/useGtag';
import { FilterSelect } from 'components/common/select';
import TableButton from 'components/common/table/TableButton';
import { Input, Row, Col, Form } from 'antd';
import styled from 'styled-components';
import { noticePutAsyncAction } from 'store/notice/reducer';

const NoticeDetail = (props) => {
    const {
        history,
        location: { state },
    } = props;
    const dispatch = useDispatch();
    const [handleNotification] = useNotification();
    const { trackPageView } = useGtag();
    const [form] = Form.useForm();
    const typeLists = useMemo(
        () => [
            { id: 0, name: 'OPEN' },
            { id: 1, name: 'UPDATE' },
            { id: 2, name: 'OTHER' },
        ],
        []
    );

    const noticePut = useSelector((state) => state.noticeReducer.put);
    const handleNoticePut = useCallback(
        (payload) => dispatch(noticePutAsyncAction.request(payload)),
        [dispatch]
    );
    const handleNoticePutInit = useCallback(
        () => dispatch(noticePutAsyncAction.initial()),
        [dispatch]
    );

    const userGetEmail = useSelector((state) => state.userReducer.get.email);

    const handleSubmit = useCallback(
        (values) => {
            values['status'] = 0;
            return handleNoticePut({
                id: Number(state?.detail?.id),
                data: {
                    ...values,
                    category:
                        typeof values['category'] === 'string'
                            ? state?.detail?.category
                            : values['category'],
                },
            });
        },
        [state, handleNoticePut]
    );

    // 조회
    useEffect(() => {
        form.setFieldsValue({
            category: typeLists?.find((v) => v.id === state?.detail?.category)
                ?.name,
            event: state?.detail?.event,
            detail: state?.detail?.detail,
        });
    }, [state, form, typeLists]);

    // 수정
    useEffect(() => {
        if (noticePut.error) {
            return handleNotification({
                type: 'error',
                message: 'Error',
                description: noticePut.error.message,
            });
        } else if (noticePut.data) {
            history.goBack();
            return handleNotification({
                type: 'success',
                message: 'Success',
                description: 'Notice modification successful',
            });
        }

        return () => handleNoticePutInit();
    }, [noticePut, history, handleNotification, handleNoticePutInit]);

    // Gtag
    useEffect(() => {
        trackPageView({
            page_title: `NOTICE DETAIL`,
        });
    }, [trackPageView]);

    return (
        <NoticeDetailWrap>
            <div id="noticeDetailWrap">
                <div className="titleWrap">
                    <div className="title">NOTICE DETAIL</div>
                    <div className="functionWrap">
                        {userGetEmail.data?.data?.level?.userLevelId === 3 && (
                            <TableButton
                                toolTip={{
                                    placement: 'topRight',
                                    title: 'NOTICE CREATE',
                                    arrowPointAtCenter: true,
                                }}
                                mode="write"
                                size="small"
                                onClick={() => {
                                    form.submit();
                                }}
                            />
                        )}
                    </div>
                </div>
                <div className="contentsWrap">
                    <Form
                        form={form}
                        onFinish={handleSubmit}
                        size="small"
                        bordered={false}
                    >
                        <Row gutter={[100, 10]}>
                            <Col span={12}>
                                <Form.Item
                                    label="TYPE   "
                                    name="category"
                                    labelAlign="left"
                                    rules={[{ required: true }]}
                                >
                                    {userGetEmail.data?.data?.level
                                        ?.userLevelId === 3 ? (
                                        FilterSelect({
                                            _key: 'id',
                                            _value: 'id',
                                            text: 'name',
                                            placeholder: `Select Type`,
                                            data: { data: { list: typeLists } },
                                        })
                                    ) : (
                                        <Input
                                            bordered={false}
                                            readOnly={
                                                userGetEmail.data?.data?.level
                                                    ?.userLevelId !== 3
                                            }
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="CREATED DATE"
                                    labelAlign="left"
                                >
                                    <Input
                                        value={dateFormat(
                                            state?.detail?.created
                                        )}
                                        readOnly
                                        bordered={false}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="EVENT"
                                    name="event"
                                    labelAlign="left"
                                    rules={[{ required: true }]}
                                >
                                    <Input
                                        bordered={false}
                                        readOnly={
                                            userGetEmail.data?.data?.level
                                                ?.userLevelId !== 3
                                        }
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="UPDATED DATE"
                                    labelAlign="left"
                                >
                                    <Input
                                        value={dateFormat(
                                            state?.detail?.updated
                                        )}
                                        readOnly
                                        bordered={false}
                                    />
                                </Form.Item>
                            </Col>

                            <Col span={24}>
                                <Form.Item
                                    label="DETAIL"
                                    name="detail"
                                    labelAlign="left"
                                    rules={[{ required: true }]}
                                >
                                    <Input.TextArea
                                        placeholder="Insert Construction"
                                        readOnly={
                                            userGetEmail.data?.data?.level
                                                ?.userLevelId !== 3
                                        }
                                        bordered={false}
                                        autoSize={{ minRows: 10, maxRows: 10 }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </div>
        </NoticeDetailWrap>
    );
};

const NoticeDetailWrap = styled.div`
    height: 100%;
    overflow: auto;
    padding: 1rem;
    #noticeDetailWrap {
        min-width: 500px;
        padding: 0.5rem;
        border: 1px solid lightgray;
        border-radius: 3px;
        box-shadow: 3px 3px gray;
        .titleWrap {
            display: flex;
            justify-content: space-between;
            margin-bottom: 1rem;
            .title {
                ${(props) => props.theme.fonts.h7};
            }
        }

        .ant-form-item-label {
            label {
                ${({ theme }) => theme.fonts.h5};
            }
        }

        .ant-select-selection-placeholder {
            ${(props) => props.theme.fonts.h5};
        }

        .ant-form-item-control-input-content
            .ant-select.ant-select-borderless.ant-select-single.ant-select-show-arrow.ant-select-show-search {
            border-bottom: 1px solid lightgray;
            border-radius: 0px;
            ${(props) => props.theme.fonts.h5};
        }

        .ant-picker-input {
            border-bottom: 1px solid lightgray;
            border-radius: 0px;
            ${(props) => props.theme.fonts.h5};
        }

        .ant-input-number-input-wrap > input {
            border-bottom: 1px solid lightgray;
            border-radius: 0px;
            ${(props) => props.theme.fonts.h5};
        }

        .ant-form-item-control-input-content > input {
            border-bottom: 1px solid lightgray;
            border-radius: 0px;
            ${(props) => props.theme.fonts.h5};
        }

        .ant-form-item-control-input-content > textarea {
            border-bottom: 1px solid lightgray;
            border-radius: 0px;
            ${(props) => props.theme.fonts.h5};
        }
    }
`;

export default NoticeDetail;
