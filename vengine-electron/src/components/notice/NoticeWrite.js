import React, { useCallback, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useNotification from 'core/hook/useNotification';
import useGtag from 'core/hook/useGtag';
import { FilterSelect } from 'components/common/select';
import TableButton from 'components/common/table/TableButton';
import { Input, Row, Col, Form } from 'antd';

import styled from 'styled-components';
import { noticePostAsyncAction } from 'store/notice/reducer';

const NoticeWrite = (props) => {
    const { history } = props;
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

    const noticePost = useSelector((state) => state.noticeReducer.post);
    const handleNoticePost = useCallback(
        (payload) => dispatch(noticePostAsyncAction.request(payload)),
        [dispatch]
    );
    const handleNoticePostInit = useCallback(
        () => dispatch(noticePostAsyncAction.initial()),
        [dispatch]
    );

    const handleSubmit = useCallback(
        (values) => {
            values['status'] = 0;
            return handleNoticePost(values);
        },
        [handleNoticePost]
    );

    // 등록
    useEffect(() => {
        if (noticePost.error) {
            return handleNotification({
                type: 'error',
                message: 'Error',
                description: noticePost.error.message,
            });
        } else if (noticePost.data) {
            history.goBack();
            return handleNotification({
                type: 'success',
                message: 'Success',
                description: 'Announcement creation success',
            });
        }

        return () => handleNoticePostInit();
    }, [noticePost, history, handleNotification, handleNoticePostInit]);

    // Gtag
    useEffect(() => {
        trackPageView({
            page_title: `NOTICE WRITE `,
        });
    }, [trackPageView]);
    return (
        <NoticeWriteWrap>
            <div id="noticeWriteWrap">
                <div className="titleWrap">
                    <div className="title">NOTICE WRITE</div>
                    <div className="functionWrap">
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
                                    label="TYPE"
                                    name="category"
                                    labelAlign="left"
                                    rules={[{ required: true }]}
                                >
                                    {FilterSelect({
                                        _key: 'id',
                                        _value: 'id',
                                        text: 'name',
                                        // defaultValue: 'FABRIC',
                                        placeholder: `Select Type`,
                                        data: { data: { list: typeLists } },
                                        // onChange: (v) => _setType(v),
                                    })}
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="EVENT"
                                    name="event"
                                    labelAlign="left"
                                    rules={[{ required: true }]}
                                >
                                    <Input bordered={false} />
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
                                        bordered={false}
                                        autoSize={{ minRows: 10, maxRows: 10 }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </div>
        </NoticeWriteWrap>
    );
};

const NoticeWriteWrap = styled.div`
    height: 100%;
    overflow: auto;
    padding: 1rem;
    #noticeWriteWrap {
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

export default NoticeWrite;
