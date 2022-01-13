import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useNotification from 'core/hook/useNotification';
import useValidateMessage from 'core/hook/useValidateMessage';
import { companySearchListsAsyncAction } from 'store/companyInfo/reducer';
import { cbdOptionGetListsAsyncAction } from 'store/cbd/option/reducer';
import {
    mclPrebookingPostAsyncAction,
    mclPrebookingGetListsAsyncAction,
    mclPrebookingPutAsyncAction,
} from 'store/mcl/prebooking/reducer';

import moment from 'moment';
import * as confirm from 'components/common/confirm';
import styled from 'styled-components';
import TableButton from 'components/common/table/TableButton';
import { Input, Space, Form, DatePicker } from 'antd';
import { FilterSelect } from 'components/common/select';
import { CaretRightOutlined } from '@ant-design/icons';

const MclStyleAssign = (props) => {
    const { match, initialShow, show, onShow, onLeftSplit } = props;
    const { mclOptionId } = match.params || '';
    // 생성된 row id 수정에 필요
    const prebookingId = show.styleAssign.id || '';
    const { RangePicker } = DatePicker;
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const mclstyleAssignForm = useRef();
    const [handleNotification] = useNotification();
    const [handleValidateMessage] = useValidateMessage();
    const [mclPrebookingGetId, setMclPrebookingGetId] = useState(null);

    const companyInfoGetLists = useSelector(
        (state) => state.companyInfoReducer.searchLists
    );
    const handleCompanyInfoGetLists = useCallback(
        (payload) => dispatch(companySearchListsAsyncAction.request(payload)),
        [dispatch]
    );

    const cbdOptionGetLists = useSelector(
        (state) => state.cbdOptionReducer.get.lists
    );
    const handleCbdOptionGetLists = useCallback(
        (payload) => dispatch(cbdOptionGetListsAsyncAction.request(payload)),
        [dispatch]
    );

    const mclPrebookingPost = useSelector(
        (state) => state.mclPrebookingReducer.post
    );
    const handleMclPrebookingPost = useCallback(
        (payload) => dispatch(mclPrebookingPostAsyncAction.request(payload)),
        [dispatch]
    );
    const handleMclPrebookingPostInit = useCallback(
        () => dispatch(mclPrebookingPostAsyncAction.initial()),
        [dispatch]
    );

    const mclPrebookingPut = useSelector(
        (state) => state.mclPrebookingReducer.put
    );
    const handleMclPrebookingPut = useCallback(
        (payload) => dispatch(mclPrebookingPutAsyncAction.request(payload)),
        [dispatch]
    );
    const handleMclPrebookingPutInit = useCallback(
        () => dispatch(mclPrebookingPutAsyncAction.initial()),
        [dispatch]
    );

    const handleMclPrebookingGetLists = useCallback(
        (payload) =>
            dispatch(mclPrebookingGetListsAsyncAction.request(payload)),
        [dispatch]
    );

    // 사용해보고 추후에 삭제 예정
    const cbdCoverGetId = useSelector((state) => state.cbdCoverReducer.get.id);

    const mclPrebookingGetLists = useSelector(
        (state) => state.mclPrebookingReducer.get.lists
    );

    const handleSubmit = useCallback(
        (values) => {
            if (prebookingId) {
                const newValue = {};
                newValue['cbdOptionId'] =
                    typeof values['cbdOptionId'] === 'string'
                        ? mclPrebookingGetId.cbdOption.optionId
                        : values['cbdOptionId'];
                newValue['id'] = mclPrebookingGetId.id;

                handleMclPrebookingPut(newValue);
            } else {
                values['mclOptionID'] = mclOptionId;
                values['shipDateFrom'] = moment(values['shipDate'][0]).format(
                    'YYYY-MM-DD'
                );
                values['shipDateTo'] = moment(values['shipDate'][1]).format(
                    'YYYY-MM-DD'
                );

                // values 안에 shipDate를 제거 후 실행
                const newValues = Object.keys(values).reduce((acc, key) => {
                    if (key === 'shipDate') {
                        return acc;
                    } else {
                        acc[key] = values[key];
                        return acc;
                    }
                }, {});

                return handleMclPrebookingPost(newValues);
            }
        },
        [
            mclOptionId,
            prebookingId,
            mclPrebookingGetId,
            handleMclPrebookingPost,
            handleMclPrebookingPut,
        ]
    );

    // id로 조회
    useEffect(() => {
        if (mclPrebookingGetLists.data && prebookingId) {
            const _ = mclPrebookingGetLists.data.list.find(
                (v) => v.id === prebookingId
            );
            setMclPrebookingGetId(_);
        }
    }, [mclPrebookingGetLists, prebookingId]);

    useEffect(() => {
        if (mclPrebookingGetId) {
            form.setFieldsValue({
                styleNumber: mclPrebookingGetId.styleNumber,
                companyProgramID: mclPrebookingGetId.program.name,
                cbdOptionId:
                    mclPrebookingGetId.cbdOption &&
                    mclPrebookingGetId.cbdOption.name,
                shipDate: [
                    moment(mclPrebookingGetId?.shipDateFrom),
                    moment(mclPrebookingGetId?.shipDateTo),
                ],
            });
        }
    }, [mclPrebookingGetId, form]);

    // 등록
    useEffect(() => {
        if (mclPrebookingPost.error) {
            return handleNotification({
                type: 'error',
                message: 'Error',
                description: mclPrebookingPost.error.message,
            });
        } else if (mclPrebookingPost.data) {
            handleMclPrebookingGetLists(mclOptionId);
            onLeftSplit();
            return handleNotification({
                type: 'success',
                message: 'Success',
                description: 'Successful creation of MCL style Assign',
            });
        }

        return () => handleMclPrebookingPostInit();
    }, [
        mclPrebookingPost,
        mclOptionId,
        onLeftSplit,
        handleMclPrebookingGetLists,
        handleMclPrebookingPostInit,
        handleNotification,
    ]);

    // 수정
    useEffect(() => {
        if (mclPrebookingPut.error) {
            return handleNotification({
                type: 'error',
                message: 'Error',
                description: mclPrebookingPut.error.message,
            });
        } else if (mclPrebookingPut.data) {
            handleMclPrebookingGetLists(mclOptionId);
            onLeftSplit();
            return handleNotification({
                type: 'success',
                message: 'Success',
                description: 'Successfully modified MCL style assignment',
            });
        }

        return () => handleMclPrebookingPutInit();
    }, [
        mclPrebookingPut,
        mclOptionId,
        onLeftSplit,
        handleMclPrebookingGetLists,
        handleNotification,
        handleMclPrebookingPutInit,
    ]);

    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };

    return (
        <MclStyleAssignWrap>
            <div id="mclStyleAssignWrap">
                <div className="titleWrap">
                    <div className="title">
                        <Space>
                            <CaretRightOutlined />
                            STYLE APPLY OPTION
                        </Space>
                    </div>
                    <div className="functionWrap">
                        <Space>
                            <TableButton
                                toolTip={{
                                    placement: 'topLeft',
                                    title: 'Save item',
                                    arrowPointAtCenter: true,
                                }}
                                mode="save"
                                size="small"
                                onClick={() =>
                                    confirm.saveConfirm(() =>
                                        mclstyleAssignForm.current.submit()
                                    )
                                }
                            />

                            <TableButton
                                toolTip={{
                                    placement: 'topLeft',
                                    title: 'Close',
                                    arrowPointAtCenter: true,
                                }}
                                mode="cancel"
                                size="small"
                                onClick={() => {
                                    onLeftSplit();
                                    onShow({
                                        ...initialShow,
                                        styleAssign: {
                                            status: false,
                                        },
                                    });
                                }}
                            />
                        </Space>
                    </div>
                </div>
                <div className="contentsWrap">
                    <div className="content">
                        <Form
                            {...layout}
                            ref={mclstyleAssignForm}
                            form={form}
                            onFinish={handleSubmit}
                            validateMessages={handleValidateMessage}
                        >
                            <Form.Item
                                name="styleNumber"
                                label="Style#"
                                rules={[{ required: true }]}
                            >
                                <Input
                                    placeholder="Insert Style number"
                                    disabled={prebookingId ? true : false}
                                    bordered={false}
                                />
                            </Form.Item>
                            <Form.Item
                                name="companyProgramID"
                                label="Program Type"
                                rules={[{ required: true }]}
                            >
                                {FilterSelect({
                                    _key: 'id',
                                    value: 'id',
                                    text: 'name',
                                    placeholder: 'Select Program type',
                                    filterType: 'program',
                                    data: companyInfoGetLists,
                                    onData: () =>
                                        handleCompanyInfoGetLists('program'),
                                    disabled: prebookingId ? true : false,
                                })}
                            </Form.Item>
                            <Form.Item name="cbdOptionId" label="Cbd Option">
                                {FilterSelect({
                                    _key: 'optionId',
                                    value: 'optionId',
                                    text: 'name',
                                    placeholder: 'Select CBD option',
                                    filter: (v) => v.status !== 'OPEN',
                                    data: cbdOptionGetLists,
                                    onData: () =>
                                        handleCbdOptionGetLists(
                                            cbdCoverGetId.data &&
                                                cbdCoverGetId.data.data.coverId
                                        ),
                                })}
                            </Form.Item>
                            <Form.Item
                                name="shipDate"
                                label="Shipping Window"
                                rules={[{ required: true }]}
                            >
                                <RangePicker
                                    bordered={false}
                                    disabled={prebookingId ? true : false}
                                />
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </div>
        </MclStyleAssignWrap>
    );
};

const MclStyleAssignWrap = styled.div`
    height: 100%;
    overflow: auto;
    padding: 1rem;

    #mclStyleAssignWrap {
        min-width: 500px;
        padding: 0.5rem;
        border: 1px solid lightgray;
        border-radius: 3px;
        box-shadow: 3px 3px gray;
        .titleWrap {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .title {
                ${({ theme }) => theme.fonts.h7};
            }
        }

        .contentsWrap {
            margin-top: 1rem;
            .content {
                .contentTitle {
                    ${({ theme }) => theme.fonts.h5};
                }
            }
            .ant-form-item-label {
                label {
                    ${(props) => props.theme.fonts.h5};
                }
            }

            .ant-form-item-control-input-content > input {
                border-bottom: 1px solid lightgray;
                border-radius: 0px;
                ${(props) => props.theme.fonts.h5};
            }

            .ant-input-number-input-wrap > input {
                border-bottom: 1px solid lightgray;
                border-radius: 0px;
                ${(props) => props.theme.fonts.h5};
            }

            .ant-select {
                border-bottom: 1px solid lightgray;
                border-radius: 0px;
                ${(props) => props.theme.fonts.h5};
            }

            .ant-form-item-control-input-content div {
                border-bottom: 1px solid lightgray;
                border-radius: 0px;
                ${(props) => props.theme.fonts.h5};
            }
        }
    }
`;

export default MclStyleAssign;
