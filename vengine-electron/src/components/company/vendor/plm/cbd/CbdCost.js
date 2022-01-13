import React, { useCallback, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useNotification from 'core/hook/useNotification';
import {
    companySearchListsAsyncAction,
    // companyInfoSaveAsyncAction,
} from 'store/companyInfo/reducer';
import {
    cbdCostingPostAsyncAction,
    cbdCostingGetListsAsyncAction,
    cbdCostingGetIdAsyncAction,
    cbdCostingDeleteAsyncAction,
} from 'store/cbd/costing/reducer';
import useValidateMessage from 'core/hook/useValidateMessage';
import styled from 'styled-components';
import { Form, Input, InputNumber, Space } from 'antd';
import { FilterSelect } from 'components/common/select';
import * as confirm from 'components/common/confirm';
import { PushpinOutlined } from '@ant-design/icons';
import TableButton from 'components/common/table/TableButton';

const CbdCost = (props) => {
    const { type, match, initialShow, show, onShow, onLeftSplit, isDisabled } =
        props;
    const { cbdId } = match.params || '';
    const id = show[type].id || null;
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const cbdCostForm = useRef();
    const [handleValidateMessage] = useValidateMessage();
    const [handleNotification] = useNotification();
    const layout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
    };

    const companySearchLists = useSelector(
        (state) => state.companyInfoReducer.searchLists
    );
    const handleCompanySearchLists = useCallback(
        (payload) => dispatch(companySearchListsAsyncAction.request(payload)),
        [dispatch]
    );

    // const companyInfoSave = useSelector(
    //     (state) => state.companyInfoReducer.save
    // );
    // const handleCompanyInfoSave = useCallback(
    //     (payload) => dispatch(companyInfoSaveAsyncAction.request(payload)),
    //     [dispatch]
    // );

    const cbdCostingGetId = useSelector(
        (state) => state.cbdCostingReducer.get.id
    );
    const handlecbdCostingGetId = useCallback(
        (payload) => dispatch(cbdCostingGetIdAsyncAction.request(payload)),
        [dispatch]
    );
    const handlecbdCostingGetIdInit = useCallback(
        () => dispatch(cbdCostingGetIdAsyncAction.initial()),
        [dispatch]
    );

    const cbdCostingPost = useSelector((state) => state.cbdCostingReducer.post);
    const handlecbdCostingPost = useCallback(
        (payload) => dispatch(cbdCostingPostAsyncAction.request(payload)),
        [dispatch]
    );
    const handlecbdCostingPostInit = useCallback(
        () => dispatch(cbdCostingPostAsyncAction.initial()),
        [dispatch]
    );

    const cbdCostingDelete = useSelector(
        (state) => state.cbdCostingReducer.delete
    );
    const handlecbdCostingDelete = useCallback(
        (payload) => dispatch(cbdCostingDeleteAsyncAction.request(payload)),
        [dispatch]
    );
    const handlecbdCostingDeletetInit = useCallback(
        () => dispatch(cbdCostingDeleteAsyncAction.initial()),
        [dispatch]
    );

    const handleCbdCostingGetLists = useCallback(
        (payload) => dispatch(cbdCostingGetListsAsyncAction.request(payload)),
        [dispatch]
    );

    const handleSubmit = (values) => {
        if (cbdCostingGetId.data) {
            const newValues = { ...values };
            newValues['companyCostId'] =
                typeof newValues.companyCostId === 'string'
                    ? cbdCostingGetId.data.data.companyCost.id
                    : newValues.companyCostId;

            return handlecbdCostingPost(newValues);
        }
        return handlecbdCostingPost(values);
    };

    const handleDelete = () => {
        return handlecbdCostingDelete([id]);
    };

    // const handleAddItem = () => {
    //     const el = document.getElementById(String('companyCostId'));
    //     if (el) {
    //         handleCompanyInfoSave({
    //             data: [{ rowStatus: 'new', name: el.value }],
    //             type: type,
    //         });
    //     }
    // };

    useEffect(() => {
        if (id) {
            handlecbdCostingGetId(id);
        }
    }, [id, handlecbdCostingGetId]);

    useEffect(() => {
        if (cbdCostingGetId.error) {
        } else if (cbdCostingGetId.data) {
            const { companyCost, cbdCostingId, costValue, valueKind } =
                cbdCostingGetId.data.data;
            form.setFieldsValue({
                cbdCostingId: cbdCostingId,
                costValue: costValue,
                valueKind: valueKind,
                companyCostId: companyCost.name,
            });
        }
    }, [cbdCostingGetId, form]);

    // 초기화
    useEffect(() => {
        return () => handlecbdCostingGetIdInit();
    }, [handlecbdCostingGetIdInit]);

    useEffect(() => {
        if (cbdCostingDelete.error) {
        } else if (cbdCostingDelete.data) {
            handleCbdCostingGetLists({ type: type, id: cbdId });
            onLeftSplit();
            onShow({
                ...initialShow,
                [type]: {
                    status: false,
                },
            });
        }

        return () => handlecbdCostingDeletetInit();
    }, [
        cbdCostingDelete,
        type,
        cbdId,
        initialShow,
        onShow,
        onLeftSplit,
        handleCbdCostingGetLists,
        handlecbdCostingDeletetInit,
    ]);

    useEffect(() => {
        if (cbdCostingPost.error) {
            return handleNotification({
                type: 'error',
                message: 'Error',
                description: cbdCostingPost.error.message,
            });
        } else if (cbdCostingPost.data) {
            handleCbdCostingGetLists({ type: type, id: cbdId });
            onLeftSplit();
            onShow({
                ...initialShow,
                [type]: {
                    status: false,
                },
            });
            return handleNotification({
                type: 'success',
                message: 'Success',
                description: 'CBD Direct Option Creation Success',
            });
        }

        return () => handlecbdCostingPostInit();
    }, [
        cbdCostingPost,
        type,
        cbdId,
        initialShow,
        onShow,
        onLeftSplit,
        handleCbdCostingGetLists,
        handleNotification,
        handlecbdCostingPostInit,
    ]);

    // useEffect(() => {
    //     if (companyInfoSave.data) {
    //         handleCompanySearchLists(type);
    //     }
    // }, [companyInfoSave, type, handleCompanySearchLists]);

    return (
        <CbdCostOutterWrap>
            <div id="cbdCostWrap">
                <div className="titleWrap">
                    <div className="title">
                        <Space>
                            <PushpinOutlined />
                            {type === 'direct'
                                ? 'DIRECT COST'
                                : 'INDIRECT COST'}
                        </Space>
                    </div>
                    <div className="functionWrap">
                        <Space>
                            {!isDisabled && (
                                <TableButton
                                    toolTip={{
                                        placement: 'topLeft',
                                        title:
                                            type === 'direct'
                                                ? 'DIRECT Create'
                                                : 'INDIRECT Create',
                                        arrowPointAtCenter: true,
                                    }}
                                    mode="save"
                                    size="small"
                                    onClick={() => cbdCostForm.current.submit()}
                                />
                            )}

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
                                    return onShow({
                                        ...initialShow,
                                        [type]: {
                                            status: false,
                                        },
                                    });
                                }}
                            />

                            {!isDisabled && id && (
                                <TableButton
                                    toolTip={{
                                        placement: 'topLeft',
                                        title:
                                            type === 'direct'
                                                ? 'DIRECT Delete'
                                                : 'INDIRECT Delete',
                                        arrowPointAtCenter: true,
                                    }}
                                    mode="delete"
                                    size="small"
                                    onClick={() =>
                                        confirm.deleteConfirm(() =>
                                            handleDelete()
                                        )
                                    }
                                />
                            )}

                            {/* <Tooltip
                                placement="topLeft"
                                title={
                                    type === 'direct'
                                        ? 'DIRECT Create'
                                        : 'INDIRECT Create'
                                }
                                arrowPointAtCenter
                            >
                                <Button
                                    icon={
                                        <CheckOutlined
                                            style={{
                                                fontSize: '16px',
                                                color: '#000000',
                                            }}
                                        />
                                    }
                                    size="small"
                                    style={{
                                        borderColor: '#000000',
                                        paddingTop: '3px',
                                    }}
                                    onClick={() =>
                                        confirm.saveConfirm(() =>
                                            cbdCostForm.current.submit()
                                        )
                                    }
                                />
                            </Tooltip>
                            <Tooltip
                                placement="topRight"
                                title="Close"
                                arrowPointAtCenter
                            >
                                <Button
                                    icon={
                                        <CloseOutlined
                                            style={{
                                                fontSize: '16px',
                                                color: '#000000',
                                            }}
                                        />
                                    }
                                    size="small"
                                    style={{
                                        borderColor: '#000000',
                                        paddingTop: '3px',
                                    }}
                                    onClick={() => {
                                        onLeftSplit();
                                        return onShow({
                                            ...initialShow,
                                            [type]: {
                                                status: false,
                                            },
                                        });
                                    }}
                                />
                            </Tooltip>
                            {id && (
                                <Tooltip
                                    placement="topRight"
                                    title={
                                        type === 'direct'
                                            ? 'DIRECT Delete'
                                            : 'INDIRECT Delete'
                                    }
                                    arrowPointAtCenter
                                >
                                    <Button
                                        icon={
                                            <DeleteOutlined
                                                style={{
                                                    fontSize: '16px',
                                                    color: '#000000',
                                                }}
                                            />
                                        }
                                        style={{
                                            borderColor: '#000000',
                                            paddingTop: 3,
                                        }}
                                        size="small"
                                        onClick={() =>
                                            confirm.deleteConfirm(() =>
                                                handleDelete()
                                            )
                                        }
                                    />
                                </Tooltip>
                            )} */}
                        </Space>
                    </div>
                </div>
                <div className="contensWrap">
                    <Form
                        {...layout}
                        ref={cbdCostForm}
                        form={form}
                        initialValues={{
                            type: type,
                            cbdOptionId: cbdId,
                        }}
                        onFinish={handleSubmit}
                        validateMessages={handleValidateMessage}
                        size="small"
                    >
                        <Form.Item name="type" hidden>
                            <Input />
                        </Form.Item>
                        <Form.Item name="cbdOptionId" hidden>
                            <Input />
                        </Form.Item>
                        <Form.Item name="cbdCostingId" hidden>
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="companyCostId"
                            label="NAME"
                            rules={[{ required: true }]}
                        >
                            {FilterSelect({
                                _key: 'id',
                                value: 'id',
                                text: 'name',
                                placeholder: 'Select Name',
                                filterType: type,
                                data: companySearchLists,
                                onData: () => handleCompanySearchLists(type),
                                // onAddItem: () => handleAddItem(),
                                disabled: isDisabled,
                            })}
                            {/* <FilterSelect
                                _key="id"
                                value="id"
                                text="name"
                                placeholder="Select Name"
                                filterType={type}
                                data={companySearchLists}
                                onData={() => handleCompanySearchLists(type)}
                                onAddItem={() => handleAddItem()}
                            /> */}
                        </Form.Item>
                        <Form.Item
                            name="valueKind"
                            label="TYPE"
                            rules={[{ required: true }]}
                        >
                            {FilterSelect({
                                _key: 'type',
                                value: 'type',
                                text: 'type',
                                placeholder: 'Select  Type',
                                data: {
                                    data: {
                                        list: [
                                            { type: 'NUM' },
                                            { type: 'PERCENT' },
                                        ],
                                    },
                                },
                                disabled: isDisabled,
                            })}

                            {/* <FilterSelect
                                _key="type"
                                value="type"
                                text="type"
                                placeholder="Select Type"
                                data={{
                                    data: {
                                        list: [
                                            { type: "NUM" },
                                            { type: "PERCENT" },
                                        ],
                                    },
                                }}
                            /> */}
                        </Form.Item>
                        <Form.Item
                            name="costValue"
                            label="UNIT PRICE / %"
                            rules={[{ required: true }]}
                        >
                            <InputNumber
                                placeholder="Insert Cost value"
                                type="number"
                                onBlur={(e) => {
                                    const { value } = e.target;
                                    form.setFieldsValue({
                                        costValue: value
                                            ? parseFloat(value).toFixed(2)
                                            : 0,
                                    });
                                }}
                                step="0.01"
                                disabled={isDisabled}
                                style={{ width: '100%' }}
                                bordered={false}
                            />
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </CbdCostOutterWrap>
    );
};

const CbdCostOutterWrap = styled.div`
    height: 100%;
    padding: 1rem;
    overflow: auto;

    #cbdCostWrap {
        min-width: 400px;
        padding: 0.5rem;
        border: 1px solid lightgray;
        border-radius: 3px;
        box-shadow: 3px 3px gray;
        .titleWrap {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
            .title {
                ${({ theme }) => theme.fonts.h7};
            }
        }

        .ant-form-item-label {
            label {
                color: rgba(0, 0, 0, 0.65);
                ${(props) => props.theme.fonts.h5};
            }
        }

        .ant-select-selector {
            background-color: white;
        }

        .ant-form-item-control-input-content > input {
            border-bottom: 1px solid lightgray;
            border-radius: 0px;
            ${(props) => props.theme.fonts.h5};
        }

        .ant-form-item-control-input-content > div {
            border-bottom: 1px solid lightgray;
            border-radius: 0px;
            ${(props) => props.theme.fonts.h5};
        }
    }
`;

export default CbdCost;
