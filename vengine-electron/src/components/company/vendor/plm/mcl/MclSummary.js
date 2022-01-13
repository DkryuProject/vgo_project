import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useNotification from 'core/hook/useNotification';
import useValidateMessage from 'core/hook/useValidateMessage';
import {
    mclOptionGetIdAsyncAction,
    mclOptionPostAsyncAction,
    mclOptionPutAsyncAction,
    // mclOptionGetListsAsyncAction,
    mclOptionDeleteAsyncAction,
    mclOptionPutStatusAsyncAction,
} from 'store/mcl/option/reducer';
import { companyGetRelationTypeAsyncAction } from 'store/company/reducer';
import styled from 'styled-components';
import moment from 'moment';
import { FilterSelect } from 'components/common/select';
import TableButton from 'components/common/table/TableButton';
import { Form, Input, Space, Switch, DatePicker, Col, Row, Badge } from 'antd';
import * as confirm from 'components/common/confirm';
import { PushpinOutlined } from '@ant-design/icons';

const CbdSummary = (props) => {
    const {
        match,
        history,
        mclGarmentColorGetLists,
        mclGarmentSizeGetLists,
        mclGarmentMarketGetLists,
    } = props;

    const cbdCoverGetId = useSelector((state) => state.cbdCoverReducer.get.id);
    const { mclOptionId } = (match && match.params) || '';
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const [handleValidateMessage] = useValidateMessage();
    const [handleNotification] = useNotification();
    const [status, setStatus] = useState(true);
    const isDisabled = useMemo(() => (status ? false : true), [status]);
    const [availableItems, setAvailableItems] = useState({
        garmentColor: [],
        garmentSize: [],
        garmentMarket: [],
    });

    useEffect(() => {
        if (
            mclGarmentColorGetLists.data &&
            mclGarmentSizeGetLists.data &&
            mclGarmentMarketGetLists.data
        ) {
            setAvailableItems({
                garmentColor: mclGarmentColorGetLists.data.list.filter(
                    (v) => !v.poGarmentColor
                ),
                garmentSize: mclGarmentSizeGetLists.data.list.filter(
                    (v) => !v.poGarmentSize
                ),
                garmentMarket: mclGarmentMarketGetLists.data.list.filter(
                    (v) => !v.poGarmentMarket
                ),
            });
        }
    }, [
        mclGarmentColorGetLists,
        mclGarmentSizeGetLists,
        mclGarmentMarketGetLists,
        setAvailableItems,
    ]);

    const mclOptionGetId = useSelector(
        (state) => state.mclOptionReducer.get.id
    );
    const handleMclOptionGetId = useCallback(
        (payload) => dispatch(mclOptionGetIdAsyncAction.request(payload)),
        [dispatch]
    );
    const handleMclOptionGetIdInit = useCallback(
        () => dispatch(mclOptionGetIdAsyncAction.initial()),
        [dispatch]
    );

    const mclOptionPost = useSelector((state) => state.mclOptionReducer.post);
    const handleMclOptionPost = useCallback(
        (payload) => dispatch(mclOptionPostAsyncAction.request(payload)),
        [dispatch]
    );
    const handleMclOptionPostInit = useCallback(
        (payload) => dispatch(mclOptionPostAsyncAction.initial(payload)),
        [dispatch]
    );

    const mclOptionPut = useSelector((state) => state.mclOptionReducer.put);
    const handleMclOptionPut = useCallback(
        (payload) => dispatch(mclOptionPutAsyncAction.request(payload)),
        [dispatch]
    );
    const handleMclOptionPutInit = useCallback(
        (payload) => dispatch(mclOptionPutAsyncAction.initial(payload)),
        [dispatch]
    );

    const mclOptionPutStatus = useSelector(
        (state) => state.mclOptionReducer.putStatus
    );
    const handleMclOptionPutStatus = useCallback(
        (payload) => dispatch(mclOptionPutStatusAsyncAction.request(payload)),
        [dispatch]
    );
    const handleMclOptionPutStatusInit = useCallback(
        (payload) => dispatch(mclOptionPutStatusAsyncAction.initial(payload)),
        [dispatch]
    );

    const mclOptionDelete = useSelector(
        (state) => state.mclOptionReducer.delete
    );
    const handleMclOptionDelete = useCallback(
        (payload) => dispatch(mclOptionDeleteAsyncAction.request(payload)),
        [dispatch]
    );
    const handleMclOptionDeleteInit = useCallback(
        () => dispatch(mclOptionDeleteAsyncAction.initial()),
        [dispatch]
    );

    const companyGetRelationType = useSelector(
        (state) => state.companyReducer.get.relationType
    );
    const handleCompanyGetRelationType = useCallback(
        (payload) =>
            dispatch(companyGetRelationTypeAsyncAction.request(payload)),
        [dispatch]
    );

    // const userGetEmail = useSelector((state) => state.userReducer.get.email);

    const handleSubmit = useCallback(
        (values) => {
            console.log('values: ', values);
            // 수정시 status가 빠져야 할것 같다
            values['status'] = status ? 'OPEN' : 'CLOSE';
            values['pcdDate'] = moment(values['pcdDate']).format('YYYY-MM-DD');
            values['factoryID'] =
                typeof values['factoryID'] === 'string'
                    ? mclOptionGetId.data &&
                      mclOptionGetId.data.data.factory.companyID
                    : values['factoryID'];

            // 수정 및 등록
            if (mclOptionId) {
                return handleMclOptionPut({ id: values['id'], data: values });
            } else {
                return handleMclOptionPost(values);
            }
        },
        [
            mclOptionGetId,
            mclOptionId,
            status,
            handleMclOptionPost,
            handleMclOptionPut,
        ]
    );

    const handleChangeStatus = useCallback(
        (isChecked) => {
            if (!mclOptionId) return;

            if (isChecked) {
                // 권한 해제
                // if (userGetEmail.data?.data?.level?.userLevelId > 1) {
                //     setStatus(isChecked);
                //     return handleMclOptionPutStatus({
                //         id: mclOptionId,
                //         data: isChecked ? 'OPEN' : 'CLOSE',
                //     });
                // } else {
                //     return handleNotification({
                //         type: 'error',
                //         message: 'Error',
                //         description: 'You do not have permission',
                //     });
                // }

                setStatus(isChecked);
                return handleMclOptionPutStatus({
                    id: mclOptionId,
                    data: isChecked ? 'OPEN' : 'CLOSE',
                });
            } else {
                setStatus(isChecked);
                return handleMclOptionPutStatus({
                    id: mclOptionId,
                    data: isChecked ? 'OPEN' : 'CLOSE',
                });
            }
        },
        [
            mclOptionId,
            // userGetEmail,
            handleMclOptionPutStatus,
            // handleNotification,
        ]
    );

    // 조회
    useEffect(() => {
        if (mclOptionId) {
            handleMclOptionGetId(mclOptionId);
        }
    }, [mclOptionId, handleMclOptionGetId]);

    // rm po에서 사용해야 하므로 컴포넌트 나갈 때 초기화가 아닌 수동으로 초기화
    useEffect(() => {
        if (!mclOptionId) {
            handleMclOptionGetIdInit();
        }
    }, [mclOptionId, handleMclOptionGetIdInit]);

    useEffect(() => {
        if (mclOptionGetId.error) {
            if (mclOptionId) {
                return handleNotification({
                    type: 'error',
                    message: 'Error',
                    description: 'MCL Option lookup failed',
                });
            }
        } else if (mclOptionGetId.data) {
            const { status, id, name, pcdDate, factory } =
                mclOptionGetId.data.data;
            setStatus(status === 'OPEN' ? true : false);
            form.setFieldsValue({
                mclCoverID:
                    cbdCoverGetId.data && cbdCoverGetId.data.data.mclCover.id,
                id,
                name,
                pcdDate: moment(pcdDate),
                status: status,
                factoryID: factory.companyName,
            });
        } else {
            // 초기화
            setStatus(true);
            form.resetFields();
        }
    }, [mclOptionGetId, cbdCoverGetId, mclOptionId, form, handleNotification]);

    // 삭제
    useEffect(() => {
        if (mclOptionDelete.error) {
            return handleNotification({
                type: 'error',
                message: 'Error',
                description: mclOptionDelete.error.message,
            });
        } else if (mclOptionDelete.data) {
            history.goBack();
            return handleNotification({
                type: 'success',
                message: 'Success',
                description: 'MCL Option deletion successful',
            });
        }
    }, [mclOptionDelete, history, handleNotification]);

    // 등록
    useEffect(() => {
        if (mclOptionPost.error) {
            return handleNotification({
                type: 'error',
                message: 'Error',
                description: mclOptionPost.error.message,
            });
        } else if (mclOptionPost.data) {
            // 등록 후 상세화면으로 이동
            history.replace(
                `/vendor/plm/designcover/mcl/update/${mclOptionPost.data.data.id}`
            );

            return handleNotification({
                type: 'success',
                message: 'Success',
                description: 'MCL Option creation success',
            });
        }
    }, [history, mclOptionPost, handleNotification]);

    // 수정
    useEffect(() => {
        if (mclOptionPut.error) {
            return handleNotification({
                type: 'error',
                message: 'Error',
                description: mclOptionPut.error.message,
            });
        } else if (mclOptionPut.data) {
            return handleNotification({
                type: 'success',
                message: 'Success',
                description: 'MCL Option Modification Success',
            });
        }
    }, [mclOptionPut, handleNotification]);

    // 상태 수정
    useEffect(() => {
        if (mclOptionPutStatus.error) {
            return handleNotification({
                type: 'error',
                message: 'Error',
                description: mclOptionPutStatus.error.message,
            });
        } else if (mclOptionPutStatus.data) {
            return handleNotification({
                type: 'success',
                message: 'Success',
                description: 'MCL Option status modification successful',
            });
        }
        return () => handleMclOptionPutStatusInit();
    }, [mclOptionPutStatus, handleNotification, handleMclOptionPutStatusInit]);

    // 초기화
    useEffect(() => {
        return () => {
            handleMclOptionDeleteInit();
            handleMclOptionPostInit();
            handleMclOptionPutInit();
        };
    }, [
        handleMclOptionDeleteInit,
        handleMclOptionPostInit,
        handleMclOptionPutInit,
    ]);

    return (
        <CbdSummaryWrap>
            <div className="componentWrap">
                <Row gutter={[10, 10]}>
                    <Col span={mclOptionId ? 12 : 24}>
                        <div className="titleWrap">
                            <div className="title">
                                <Space>
                                    <PushpinOutlined />
                                    MCL SUMMARY
                                </Space>
                            </div>
                            <div className="functionWrap">
                                <Space>
                                    <TableButton
                                        toolTip={{
                                            placement: 'topLeft',
                                            title: mclOptionId
                                                ? 'Save'
                                                : 'Create MCL Summary',
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

                                    {mclOptionId ? (
                                        <TableButton
                                            toolTip={{
                                                placement: 'topLeft',
                                                title: 'Delete MCL Summary ',
                                                arrowPointAtCenter: true,
                                            }}
                                            mode="delete"
                                            size="small"
                                            onClick={() =>
                                                confirm.deleteConfirm(() => {
                                                    return handleMclOptionDelete(
                                                        mclOptionId
                                                    );
                                                })
                                            }
                                        />
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
                            <div className="content">
                                <Form
                                    // {...layout}
                                    layout="vertical"
                                    form={form}
                                    initialValues={{
                                        mclCoverID:
                                            cbdCoverGetId.data &&
                                            cbdCoverGetId.data.data.mclCover.id,
                                        status:
                                            cbdCoverGetId.data &&
                                            cbdCoverGetId.data.data.status,
                                    }}
                                    onFinish={handleSubmit}
                                    validateMessages={handleValidateMessage}
                                >
                                    <Form.Item name="mclCoverID" hidden>
                                        <Input />
                                    </Form.Item>
                                    <Form.Item name="id" hidden>
                                        <Input />
                                    </Form.Item>

                                    <Form.Item
                                        // name="status"
                                        label="Status"
                                    >
                                        {/* <Switch
                                checked={checked}
                                onChange={() =>
status((checked) => !checked)
                                }
                            /> */}

                                        <Switch
                                            checked={status}
                                            onChange={(isChecked) =>
                                                handleChangeStatus(isChecked)
                                            }
                                            size="small"
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        name="name"
                                        label="Option Name"
                                        rules={[{ required: true }]}
                                    >
                                        <Input
                                            placeholder="Insert Option name"
                                            disabled={isDisabled}
                                            bordered={false}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        name="factoryID"
                                        label="Manufacture Company"
                                        rules={[{ required: true }]}
                                    >
                                        {FilterSelect({
                                            _key: 'companyID',
                                            _value: 'companyID',
                                            text: 'companyName',
                                            placeholder: `Select Factory name`,
                                            disabled: isDisabled,
                                            data: companyGetRelationType,
                                            onData: () =>
                                                handleCompanyGetRelationType(
                                                    'MANUFACTURER'
                                                ),
                                        })}
                                    </Form.Item>
                                    <Form.Item
                                        name="pcdDate"
                                        label="Initial PCD"
                                        rules={[{ required: true }]}
                                    >
                                        <DatePicker
                                            disabled={isDisabled}
                                            bordered={false}
                                        />
                                    </Form.Item>
                                </Form>
                            </div>
                        </div>
                    </Col>
                    {mclOptionId && (
                        <Col span={12}>
                            <div className="mclWrap">
                                <div className="titleWrap">
                                    <div className="title">
                                        AVAILABLE SETTING ITEMS
                                    </div>
                                </div>
                                <div className="itemsWrap">
                                    {Object.keys(availableItems).map((v) => {
                                        return (
                                            <div className="item" key={v}>
                                                <Row gutter={[0, 10]}>
                                                    <Col span={6}>
                                                        <div className="itemTitle">
                                                            {v
                                                                .charAt(0)
                                                                .toUpperCase()}
                                                            {v.slice(1)}
                                                        </div>
                                                    </Col>
                                                    <Col>
                                                        <Badge
                                                            count={
                                                                availableItems[
                                                                    v
                                                                ].length || '0'
                                                            }
                                                        />
                                                        {'    '}
                                                        {availableItems[v].map(
                                                            (v2, i2) => (
                                                                <span
                                                                    key={v2.id}
                                                                >
                                                                    {/* size는 객체라서 name으로 뽑아야 한다 */}
                                                                    {v2[v]
                                                                        .name ||
                                                                        v2[v]}
                                                                    {availableItems[
                                                                        v
                                                                    ][i2 + 1]
                                                                        ? ', '
                                                                        : ''}
                                                                </span>
                                                            )
                                                        )}
                                                    </Col>
                                                </Row>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </Col>
                    )}
                </Row>
            </div>
        </CbdSummaryWrap>
    );
};

const CbdSummaryWrap = styled.div`
    // border: 1px solid red;
    // padding: 0 1rem 0 0;
    padding: 0.5rem;
    border: 1px solid lightgray;
    border-radius: 3px;
    box-shadow: 3px 3px gray;
    .componentWrap {
        .titleWrap {
            display: flex;
            justify-content: space-between;
            align-items: center;

            .title {
                ${(props) => props.theme.fonts.h7};
            }
        }

        .contentsWrap {
            .content {
                // flex-grow: 1;
                // margin-left: 1rem;
                min-width: 400px;
                max-width: 500px;
                .ant-form-item-label {
                    label {
                        color: #7f7f7f;
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

                .ant-form-item-control-input-content div {
                    border-bottom: 1px solid lightgray;
                    border-radius: 0px;
                    ${(props) => props.theme.fonts.h5};
                }

                .ant-select {
                    border-bottom: 1px solid lightgray;
                    border-radius: 0px;
                    ${(props) => props.theme.fonts.h5};
                }

                .ant-picker.ant-picker-borderless.ant-picker-focused
                    .ant-picker-input {
                    border-bottom: 1px solid lightgray;
                    border-radius: 0px;
                    ${(props) => props.theme.fonts.h5};
                }
            }
        }
        .mclWrap {
            width: 100%;
            height: 100%;
            padding: 1rem;
            border: 1px solid lightgray;
            border-radius: 5px;

            .itemsWrap {
                margin-top: 1rem;

                .itemTitle {
                    color: #7f7f7f;
                    ${(props) => props.theme.fonts.h5}
                }

                span {
                    ${(props) => props.theme.fonts.h5}
                }
            }
        }
    }
`;

export default React.memo(CbdSummary);
