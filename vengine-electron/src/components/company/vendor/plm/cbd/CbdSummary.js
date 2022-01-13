import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useNotification from 'core/hook/useNotification';
import useValidateMessage from 'core/hook/useValidateMessage';
import {
    cbdOptionGetIdAsyncAction,
    cbdOptionPostAsyncAction,
    cbdOptionPutAsyncAction,
    cbdOptionDeleteAsyncAction,
    cbdOptionGetListsAsyncAction,
    cbdOptionSimulationGetIdAsyncAction,
} from 'store/cbd/option/reducer';
import { cbdCostingGetListsAsyncAction } from 'store/cbd/costing/reducer';
import styled from 'styled-components';
import * as confirm from 'components/common/confirm';
import TableButton from 'components/common/table/TableButton';
import {
    Row,
    Col,
    Form,
    Input,
    Space,
    Switch,
    InputNumber,
    Drawer,
} from 'antd';
import { PushpinOutlined } from '@ant-design/icons';
import CustomTable from 'components/common/CustomTable';
import { Tooltip } from 'components/common/tooltip';
import formatNumberUtil from 'core/utils/formatNumberUtil';
import CbdOptionCopy from './CbdOptionCopy';

const CbdSummary = (props) => {
    const { match, history, onShowCbdOption, status, onStatus } = props;
    const { cbdId } = match?.params || '';
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const [handleValidateMessage] = useValidateMessage();
    const [handleNotification] = useNotification();
    const isDisabled = useMemo(() => (status ? false : true), [status]);
    const [simulation, setSimulation] = useState([]);
    const [visible, setVisible] = useState(false);

    const cbdCoverGetId = useSelector((state) => state.cbdCoverReducer.get.id);
    const cbdOptionGetId = useSelector(
        (state) => state.cbdOptionReducer.get.id
    );
    const handleCbdOptionGetId = useCallback(
        (payload) => dispatch(cbdOptionGetIdAsyncAction.request(payload)),
        [dispatch]
    );
    const handleCbdOptionGetIdInit = useCallback(
        (payload) => dispatch(cbdOptionGetIdAsyncAction.initial(payload)),
        [dispatch]
    );

    const cbdOptionPost = useSelector((state) => state.cbdOptionReducer.post);
    const handleCbdOptionPost = useCallback(
        (payload) => dispatch(cbdOptionPostAsyncAction.request(payload)),
        [dispatch]
    );
    const handleCbdOptionPostInit = useCallback(
        (payload) => dispatch(cbdOptionPostAsyncAction.initial(payload)),
        [dispatch]
    );

    const cbdOptionPut = useSelector((state) => state.cbdOptionReducer.put);
    const handleCbdOptionPut = useCallback(
        (payload) => dispatch(cbdOptionPutAsyncAction.request(payload)),
        [dispatch]
    );
    const handleCbdOptionPutInit = useCallback(
        (payload) => dispatch(cbdOptionPutAsyncAction.initial(payload)),
        [dispatch]
    );

    const cbdOptionDelete = useSelector(
        (state) => state.cbdOptionReducer.delete
    );
    const handleCbdOptionDelete = useCallback(
        (payload) => dispatch(cbdOptionDeleteAsyncAction.request(payload)),
        [dispatch]
    );
    const handleCbdOptionDeleteInit = useCallback(
        () => dispatch(cbdOptionDeleteAsyncAction.initial()),
        [dispatch]
    );

    const handleCbdOptionGetLists = useCallback(
        (payload) => dispatch(cbdOptionGetListsAsyncAction.request(payload)),
        [dispatch]
    );

    const cbdOptionSimulationGetId = useSelector(
        (state) => state.cbdOptionReducer.get.simulationId
    );
    const handleCbdOptionSimulationGetId = useCallback(
        (payload) =>
            dispatch(cbdOptionSimulationGetIdAsyncAction.request(payload)),
        [dispatch]
    );
    const handleCbdOptionSimulationGetIdInit = useCallback(
        () => dispatch(cbdOptionSimulationGetIdAsyncAction.initial()),
        [dispatch]
    );

    const handleCbdCostingGetLists = useCallback(
        (payload) => dispatch(cbdCostingGetListsAsyncAction.request(payload)),
        [dispatch]
    );

    const cbdInfoPut = useSelector((state) => state.cbdInfoReducer.put);

    const userGetEmail = useSelector((state) => state.userReducer.get.email);

    const handleSubmit = useCallback(
        (values) => {
            values['status'] = status ? 'OPEN' : 'CLOSE';
            values['optionId'] = values['optionId'] || null;
            return handleCbdOptionPost(values);
        },
        [status, handleCbdOptionPost]
    );

    const handleChangeStatus = useCallback(
        (isChecked) => {
            if (!cbdId) return;

            if (isChecked) {
                if (userGetEmail.data?.data?.level?.userLevelId > 1) {
                    onStatus(isChecked);
                    return handleCbdOptionPut({
                        id: cbdId,
                        data: isChecked ? 'OPEN' : 'CLOSE',
                    });
                } else {
                    return handleNotification({
                        type: 'error',
                        message: 'Error',
                        description: 'You do not have permission',
                    });
                }
            } else {
                onStatus(isChecked);
                return handleCbdOptionPut({
                    id: cbdId,
                    data: isChecked ? 'OPEN' : 'CLOSE',
                });
            }
        },
        [cbdId, userGetEmail, handleCbdOptionPut, onStatus, handleNotification]
    );

    // 조회
    useEffect(() => {
        if (cbdId) {
            handleCbdOptionGetId(cbdId);
        }

        return () => handleCbdOptionGetIdInit();
    }, [
        match,
        cbdId,
        cbdInfoPut,
        handleCbdOptionGetId,
        handleCbdOptionGetIdInit,
    ]);

    useEffect(() => {
        if (cbdOptionGetId.error) {
            if (cbdId) {
                return handleNotification({
                    type: 'error',
                    message: 'Error',
                    description: cbdOptionGetId.error.message,
                });
            }
        } else if (cbdOptionGetId.data) {
            const {
                status,
                optionId,
                name,
                finalCost,
                goodsQuantity,
                targetProfit,
                profit,
            } = cbdOptionGetId.data.data;
            onStatus(status === 'OPEN' ? true : false);
            form.setFieldsValue({
                cbdCoverId:
                    cbdCoverGetId.data && cbdCoverGetId.data.data.coverId,
                optionId,
                name,
                finalCost,
                goodsQuantity,
                profitCost: targetProfit,
                profit,
            });

            // simulation 조회
            if (targetProfit) {
                handleCbdOptionSimulationGetId({
                    cbdOptionId: cbdId,
                    targetProfit: targetProfit,
                });
            }
        }
    }, [
        cbdOptionGetId,
        cbdCoverGetId,
        cbdId,
        form,
        handleNotification,
        handleCbdOptionSimulationGetId,
        onStatus,
    ]);

    useEffect(() => {
        if (cbdOptionSimulationGetId.data) {
            setSimulation(
                cbdOptionSimulationGetId?.data?.list.map((v, i) => ({
                    ...v,
                    id: i + 1,
                }))
            );
        }

        return () => handleCbdOptionSimulationGetIdInit();
    }, [
        cbdOptionSimulationGetId,
        setSimulation,
        handleCbdOptionSimulationGetIdInit,
    ]);

    // 등록
    useEffect(() => {
        if (cbdOptionPost.error) {
            return handleNotification({
                type: 'error',
                message: 'Error',
                description: cbdOptionPost.error.message,
            });
        } else if (cbdOptionPost.data) {
            // 등록 후 상세화면으로 이동
            history.replace(
                `/vendor/plm/designcover/cbd/update/${cbdOptionPost.data.data.optionId}`
            );

            handleCbdOptionGetLists(
                cbdCoverGetId.data && cbdCoverGetId.data.data.coverId
            );
            if (cbdId) {
                // Cbd Option 수정시 Final Cost로 direct, indirect의 amount가 계산된다 %시
                handleCbdCostingGetLists({ type: 'direct', id: cbdId });
                handleCbdCostingGetLists({ type: 'indirect', id: cbdId });
            }

            return handleNotification({
                type: 'success',
                message: 'Success',
                description: 'CBD option creation success',
            });
        }

        return () => handleCbdOptionPostInit();
    }, [
        cbdId,
        cbdOptionGetId,
        cbdOptionPost,
        cbdCoverGetId,
        onShowCbdOption,
        handleNotification,
        handleCbdOptionPostInit,
        handleCbdOptionGetLists,
        handleCbdCostingGetLists,
        history,
    ]);

    // 수정
    useEffect(() => {
        if (cbdOptionPut.error) {
            onStatus(true);
            return handleNotification({
                type: 'error',
                message: 'Error',
                description: cbdOptionPut.error.message,
            });
        } else if (cbdOptionPut.data) {
            return handleNotification({
                type: 'success',
                message: 'Success',
                description: 'CBD Option Modification Success',
            });
        }

        return () => handleCbdOptionPutInit();
    }, [cbdOptionPut, handleCbdOptionPutInit, handleNotification, onStatus]);

    // 삭제
    useEffect(() => {
        if (cbdOptionDelete.error) {
            return handleNotification({
                type: 'error',
                message: 'Error',
                description: cbdOptionDelete.error.message,
            });
        } else if (cbdOptionDelete.data) {
            history.goBack();
            return handleNotification({
                type: 'success',
                message: 'Success',
                description: 'CBD option deletion successful',
            });
        }
        return () => handleCbdOptionDeleteInit();
    }, [
        cbdOptionDelete,
        history,
        handleCbdOptionDeleteInit,
        handleNotification,
    ]);

    return (
        <CbdSummaryWrap>
            <Drawer
                title=""
                width="500px"
                placement="right"
                closable={false}
                onClose={() => setVisible(false)}
                visible={visible}
            >
                <CbdOptionCopy
                    cbdId={cbdId}
                    cbdCoverGetId={cbdCoverGetId}
                    onVisible={setVisible}
                />
            </Drawer>
            <div className="titleWrap">
                <div className="title">
                    <Space>
                        <PushpinOutlined />
                        CBD SUMMARY
                    </Space>
                </div>
                <div className="functionWrap">
                    <Space>
                        <TableButton
                            toolTip={{
                                placement: 'topLeft',
                                title: cbdId ? 'Save' : 'Create CBD Summary ',
                                arrowPointAtCenter: true,
                            }}
                            mode="save"
                            size="small"
                            onClick={() =>
                                confirm.saveConfirm(() => {
                                    return form.submit();
                                })
                            }
                        />

                        {cbdId ? (
                            <>
                                <TableButton
                                    toolTip={{
                                        placement: 'topLeft',
                                        title: 'Copy item ',
                                        arrowPointAtCenter: true,
                                    }}
                                    mode="copy"
                                    size="small"
                                    onClick={() => setVisible(true)}
                                />
                                <TableButton
                                    toolTip={{
                                        placement: 'topLeft',
                                        title: 'Delete CBD Summary ',
                                        arrowPointAtCenter: true,
                                    }}
                                    mode="delete"
                                    size="small"
                                    onClick={() =>
                                        confirm.deleteConfirm(() => {
                                            return handleCbdOptionDelete(cbdId);
                                        })
                                    }
                                />
                            </>
                        ) : (
                            <TableButton
                                toolTip={{
                                    placement: 'topLeft',
                                    title: 'Close',
                                    arrowPointAtCenter: true,
                                }}
                                mode="cancel"
                                size="small"
                                onClick={() => history.goBack()}
                            />
                        )}
                    </Space>
                </div>
            </div>
            <div className="contentsWrap">
                {/* <div className="imageWrap">
                    <div className="ratioBox">
                        <div
                            className="ratioContent"
                            style={
                                cbdCoverGetId.data &&
                                cbdCoverGetId.data.data.imagPath && {
                                    backgroundImage: `url(${cbdCoverGetId.data.data.imagPath})`,
                                    backgroundSize: "cover",
                                    resize: "both",
                                }
                            }
                        ></div>
                    </div>
                </div> */}
                <div className="content">
                    <Form
                        // {...layout}
                        layout="vertical"
                        form={form}
                        initialValues={{
                            cbdCoverId:
                                cbdCoverGetId.data &&
                                cbdCoverGetId.data.data.coverId,
                            status:
                                cbdCoverGetId.data &&
                                cbdCoverGetId.data.data.status,
                            finalCost: 0,
                            goodsQuantity: 0,
                            profitCost: 10,
                        }}
                        onFinish={handleSubmit}
                        validateMessages={handleValidateMessage}
                        size="small"
                        // style={{ minWidth: 200, maxWidth: 400 }}
                        // style={{ width: 400 }}
                    >
                        {/* <Row gutter={[10, 10]}>
                            <Col span={4}>
                                <Form.Item name="cbdCoverId" hidden>
                                    <Input />
                                </Form.Item>
                                <Form.Item name="optionId" hidden>
                                    <Input />
                                </Form.Item>
                                <Form.Item label="STATUS">
                                    <Switch
                                        checked={status}
                                        onChange={(isChecked) =>
                                            handleChangeStatus(isChecked)
                                        }
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={4}></Col>
                            <Col span={16}></Col>
                        </Row> */}
                        <Row gutter={[10, 10]}>
                            <Col span={5}>
                                <Form.Item name="cbdCoverId" hidden>
                                    <Input />
                                </Form.Item>
                                <Form.Item name="optionId" hidden>
                                    <Input />
                                </Form.Item>
                                <Form.Item label="Status">
                                    <Switch
                                        checked={status}
                                        onChange={(isChecked) =>
                                            handleChangeStatus(isChecked)
                                        }
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="name"
                                    label="Option Name"
                                    rules={[{ required: true }]}
                                >
                                    <Input
                                        placeholder="Insert Option name"
                                        disabled={
                                            cbdOptionGetId?.data?.data
                                                ?.useYN === 'Y' || isDisabled
                                        }
                                        maxLength="20"
                                        bordered={false}
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="finalCost"
                                    label="Final Cost"
                                    // rules={[{ required: true }]}
                                >
                                    <InputNumber
                                        placeholder="Insert Final cost"
                                        // disabled={isDisabled}
                                        type="number"
                                        onBlur={(e) => {
                                            const { value } = e.target;
                                            form.setFieldsValue({
                                                finalCost: value
                                                    ? parseFloat(value).toFixed(
                                                          2
                                                      )
                                                    : 0,
                                            });
                                        }}
                                        step="0.01"
                                        style={{ width: '100%' }}
                                        bordered={false}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={5}>
                                <Form.Item
                                    name="goodsQuantity"
                                    label="Order QTY"
                                    // rules={[{ required: true }]}
                                >
                                    <InputNumber
                                        placeholder="Insert Order qty"
                                        formatter={(value) =>
                                            `${value}`.replace(
                                                /\B(?=(\d{3})+(?!\d))/g,
                                                ','
                                            )
                                        }
                                        parser={(value) =>
                                            value.replace(/\$\s?|(,*)/g, '')
                                        }
                                        style={{ width: '100%' }}
                                        bordered={false}
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="profitCost"
                                    label="Target Profilt (%)"
                                    rules={[{ required: true }]}
                                >
                                    <InputNumber
                                        placeholder="Insert Profit cost"
                                        // 언제든 수정 가능하도록 변경
                                        // disabled={
                                        //     cbdOptionGetId?.data?.data
                                        //         ?.useYN === 'Y' || isDisabled
                                        // }
                                        onBlur={(e) => {
                                            const { value } = e.target;
                                            form.setFieldsValue({
                                                profitCost: value
                                                    ? parseFloat(value).toFixed(
                                                          2
                                                      )
                                                    : 0,
                                            });
                                        }}
                                        step="0.01"
                                        min={0}
                                        // max={100}
                                        formatter={(value) => `${value}%`}
                                        parser={(value) =>
                                            value.replace('%', '')
                                        }
                                        style={{ width: '100%' }}
                                        bordered={false}
                                    />
                                </Form.Item>
                                <Form.Item label="Profilt (%)">
                                    <div className="fakeInput">
                                        {form.getFieldValue('profit')} %
                                    </div>
                                </Form.Item>
                            </Col>
                            {cbdId && (
                                <>
                                    <Col span={7}>
                                        <CustomTable
                                            rowKey="id"
                                            initialColumns={[
                                                {
                                                    title: 'Cost',
                                                    dataIndex: 'cost',
                                                    render: (data) => {
                                                        const value = (
                                                            <div>
                                                                $
                                                                {formatNumberUtil(
                                                                    data
                                                                )}
                                                            </div>
                                                        );
                                                        return (
                                                            <Tooltip
                                                                title={value}
                                                            >
                                                                {value}
                                                            </Tooltip>
                                                        );
                                                    },
                                                },
                                                {
                                                    title: 'Profit (%)',
                                                    dataIndex: 'targetProfit',
                                                    render: (data) => {
                                                        const value = (
                                                            <div>
                                                                {formatNumberUtil(
                                                                    data
                                                                )}
                                                                %
                                                            </div>
                                                        );
                                                        return (
                                                            <Tooltip
                                                                title={value}
                                                            >
                                                                {value}
                                                            </Tooltip>
                                                        );
                                                    },
                                                },
                                            ]}
                                            dataSource={simulation}
                                            rowSelection={false}
                                            loading={cbdOptionGetId.isLoading}
                                            pagination={false}
                                        />
                                    </Col>
                                    <Col span={7}>
                                        <CustomTable
                                            rowKey="type"
                                            initialColumns={[
                                                {
                                                    title: 'Type',
                                                    dataIndex: 'type',
                                                    render: (data) => {
                                                        const value = (
                                                            <div>
                                                                {data
                                                                    .charAt(0)
                                                                    ?.toUpperCase()}
                                                                {data.slice(1)}
                                                            </div>
                                                        );
                                                        return (
                                                            <Tooltip
                                                                title={value}
                                                            >
                                                                {value}
                                                            </Tooltip>
                                                        );
                                                    },
                                                },
                                                {
                                                    title: 'Portion (%)',
                                                    dataIndex: 'portion',
                                                    render: (data) => {
                                                        const value = (
                                                            <div>
                                                                {formatNumberUtil(
                                                                    data
                                                                )}
                                                                %
                                                            </div>
                                                        );
                                                        return (
                                                            <Tooltip
                                                                title={value}
                                                            >
                                                                {value}
                                                            </Tooltip>
                                                        );
                                                    },
                                                },
                                            ]}
                                            dataSource={
                                                cbdOptionGetId?.data &&
                                                Object.keys(
                                                    cbdOptionGetId?.data?.data
                                                        ?.itemPortion
                                                ).map((v) => ({
                                                    type: v,
                                                    portion:
                                                        cbdOptionGetId?.data
                                                            ?.data?.itemPortion[
                                                            v
                                                        ],
                                                }))
                                            }
                                            rowSelection={false}
                                            loading={cbdOptionGetId.isLoading}
                                            pagination={false}
                                        />
                                    </Col>
                                </>
                            )}
                        </Row>
                    </Form>
                </div>
            </div>
        </CbdSummaryWrap>
    );
};

const CbdSummaryWrap = styled.div`
    padding: 0.5rem;
    border: 1px solid lightgray;
    border-radius: 3px;
    box-shadow: 3px 3px gray;

    .titleWrap {
        display: flex;
        justify-content: space-between;
        // align-items: center;
        .title {
            ${(props) => props.theme.fonts.h7};
        }
    }

    .contentsWrap {
        display: flex;
        padding: 0.4rem 0 1rem 0rem;
        .imageWrap {
            // border: 1px solid red;
            min-width: 10rem;
            padding-left: 2rem;
            .ratioBox {
                ${(props) => props.theme.controls.ratioBox};
            }
            .ratioContent {
                ${(props) => props.theme.controls.ratioContent};
            }
        }

        .content {
            flex-grow: 1;
            padding-top: 1rem;
            margin-left: 1rem;
            .ant-form-item-label {
                label {
                    // color: rgba(0, 0, 0, 0.65);
                    color: #7f7f7f;
                    ${(props) => props.theme.fonts.h5};
                }
            }
            .ant-form-item-control-input-content > input,
            .ant-form-item-control-input-content .fakeInput,
            .ant-input-number-input-wrap > input {
                border-bottom: 1px solid lightgray;
                border-radius: 0px;
                ${(props) => props.theme.fonts.h5};
            }
        }
    }
`;

export default React.memo(CbdSummary);
