import React, {
    useState,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    forwardRef,
    useImperativeHandle,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useNotification from 'core/hook/useNotification';

import {
    materialOptionGetInfoIdAsyncAction,
    materialOptionPostAsyncAction,
    materialOptionPutDeleteAsyncAction,
} from 'store/material/option/reducer';
import * as confirm from 'components/common/confirm';
import CustomTable from 'components/common/CustomTable';
import { Space } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import { Tooltip } from 'components/common/tooltip';
import TableButton from 'components/common/table/TableButton';
import styled from 'styled-components';

const MaterialRegistrationOption = (props, ref) => {
    const {
        match,
        location,
        infoId,
        infoType,
        materialDataSource,
        rowSelectionType,
    } = props;

    // infoId는 리퍼블리싱시 필요하다
    // infoId ? infoId :
    const materialInfoGetId = useSelector(
        (state) => state.materialInfoReducer.get.id
    );
    const id = match?.params?.id || materialInfoGetId.data?.data?.id;
    // const id = match && match.params ? match.params.id : ''; //  테아블 안에 테이블시 렌더링 안되는

    // const type = infoType
    //     ? infoType
    //     : location && location.state
    //     ? location.state.type
    //     : '';
    const type = location?.state?.type || infoType;

    const rowKey = 'materialOptionID';
    const editTableRef = useRef();
    const dispatch = useDispatch();
    const [handleNotification] = useNotification();
    const [dataSource, setDataSource] = useState([]);

    const materialOptionGetInfoId = useSelector(
        (state) => state.materialOptionReducer.get.infoId
    );
    const handleMaterialOptionGetInfoId = useCallback(
        (payload) =>
            dispatch(materialOptionGetInfoIdAsyncAction.request(payload)),
        [dispatch]
    );
    const handleMaterialOptionGetInfoIdInit = useCallback(
        (payload) =>
            dispatch(materialOptionGetInfoIdAsyncAction.initial(payload)),
        [dispatch]
    );

    const materialOptionPost = useSelector(
        (state) => state.materialOptionReducer.post
    );
    const handleMaterialOptionPost = useCallback(
        (payload) => dispatch(materialOptionPostAsyncAction.request(payload)),
        [dispatch]
    );
    const handleMaterialOptionPostInit = useCallback(
        () => dispatch(materialOptionPostAsyncAction.initial()),
        [dispatch]
    );

    const materialOptionPutDelete = useSelector(
        (state) => state.materialOptionReducer.put.delete
    );
    const handleMaterialOptionPutDelete = useCallback(
        (payload) =>
            dispatch(materialOptionPutDeleteAsyncAction.request(payload)),
        [dispatch]
    );
    const handleMaterialOptionPutDeleteInit = useCallback(
        () => dispatch(materialOptionPutDeleteAsyncAction.initial()),
        [dispatch]
    );

    const userGetEmail = useSelector((state) => state.userReducer.get.email);

    const isDisabled = useMemo(() => {
        if (infoId) return true;

        if (!materialInfoGetId.data) {
            return false;
        }

        return (
            materialInfoGetId.data?.data.supplier.id !==
            userGetEmail.data?.data.company.companyID
        );
    }, [materialInfoGetId, userGetEmail, infoId]);

    useImperativeHandle(ref, () => editTableRef, [editTableRef]);

    const handleExcute = useCallback(
        (_type) => {
            const { selectedRows, selectedRowKeys } = editTableRef.current;
            if (selectedRows.length === 0) {
                return confirm.warningConfirm('No item is selected');
            }
            if (_type === 'save') {
                confirm.saveConfirm((e) => {
                    if (e) {
                        const newValues = selectedRows.map((v) => {
                            const obj = {
                                materialInfoId: id
                                    ? Number(id)
                                    : Number(infoId),
                                materialOptionID:
                                    v.rowStatus === 'new' ? '' : v[rowKey],
                                fashionId: v.fashion ? v.fashion : null,
                                finishingId: v.finishing ? v.finishing : null,
                                dyeingId: v.dyeing ? v.dyeing : null,
                                cw: v.cw ? Number(v.cw) : null,
                                // in 고정
                                // cwUomId: v.cwUom ? v.cwUom.id : null,
                                cwUomId: v.cw
                                    ? process.env.REACT_APP_BASE_URL ===
                                      'https://vgo-api.vengine.io'
                                        ? { id: 20, name: 'in' }
                                        : { id: 30, name: 'in' }
                                    : null,
                                weight: v.weight ? Number(v.weight) : null,
                                // g/m2 고정
                                // weightUomId: v.weightUom
                                //     ? v.weightUom.id
                                //     : null,
                                weightUomId: v.weight
                                    ? type === 'fabric'
                                        ? process.env.REACT_APP_BASE_URL ===
                                          'https://vgo-api.vengine.io'
                                            ? { id: 51, name: 'g/m2' }
                                            : { id: 61, name: 'g/m2' }
                                        : v.weightUom || null
                                    : null,
                            };
                            return obj;
                        });

                        // 타입이 fabric이고
                        // cw, weight 값이 없으면 오류
                        if (
                            type === 'fabric' &&
                            newValues.some((v) => !v.cw || !v.weight)
                        ) {
                            return handleNotification({
                                type: 'error',
                                message: 'Error',
                                description: 'CW, Weight are required values',
                            });
                        }

                        return handleMaterialOptionPost(newValues);
                    }
                });
            } else if (_type === 'delete') {
                confirm.deleteConfirm((e) => {
                    if (e) {
                        return handleMaterialOptionPutDelete(
                            selectedRowKeys.filter((v) => typeof v !== 'string')
                        );
                    }
                });
            }
        },
        [
            id,
            infoId,
            type,
            handleMaterialOptionPost,
            handleMaterialOptionPutDelete,
            handleNotification,
        ]
    );

    // Option 조회
    useEffect(() => {
        if (id) {
            handleMaterialOptionGetInfoId(id);
        }
        return () => {
            handleMaterialOptionGetInfoIdInit();
        };
    }, [handleMaterialOptionGetInfoId, handleMaterialOptionGetInfoIdInit, id]);

    useEffect(() => {
        if (materialOptionGetInfoId.data) {
            setDataSource(materialOptionGetInfoId.data.list);
        } else if (materialDataSource) {
            setDataSource(materialDataSource);
        }
    }, [materialOptionGetInfoId, materialDataSource]);

    // Option 등록
    useEffect(() => {
        if (materialOptionPost.error) {
            return handleNotification({
                type: 'error',
                message: 'Error',
                description: materialOptionPost.error.message,
            });
        } else if (materialOptionPost.data) {
            setDataSource((dataSource) =>
                dataSource.concat(
                    materialOptionPost.data?.list.map((v) => ({
                        materialOptionID: v.materialOptionID,
                        fashion: v.fashion,
                        finishing: v.finishing,
                        dyeing: v.dyeing,
                        cw: v.cw,
                        cwUom: v.cwUom,
                        weight: v.weight,
                        weightUom: v.weightUom,
                        updated: v.updated,
                        createdBy: v.updated,
                    }))
                )
            );
            // handleMaterialOptionGetInfoId(id);
            return handleNotification({
                type: 'success',
                message: 'Success',
                description: 'Material option registration successful',
            });
        }

        return () => handleMaterialOptionPostInit();
    }, [
        materialOptionPost,
        id,
        handleMaterialOptionGetInfoId,
        handleNotification,
        handleMaterialOptionPostInit,
    ]);

    // Option 삭제
    useEffect(() => {
        if (materialOptionPutDelete.error) {
            return handleNotification({
                type: 'error',
                message: 'Error',
                description: materialOptionPutDelete.error.message,
            });
        } else if (materialOptionPutDelete.data) {
            const { selectedRows, dataSource } = editTableRef.current;
            var result = [];
            for (let v1 of dataSource) {
                if (!selectedRows.find((v2) => v2[rowKey] === v1[rowKey])) {
                    result.push(v1);
                }
            }

            setDataSource(result);
            return handleNotification({
                type: 'success',
                message: 'Success',
                description: 'Material option deletion successful',
            });
        }

        return () => handleMaterialOptionPutDeleteInit();
    }, [
        materialOptionPutDelete,
        dataSource,
        handleNotification,
        handleMaterialOptionPutDeleteInit,
        setDataSource,
    ]);

    // 테이블
    const columns = useMemo(
        () => [
            {
                title: 'Fashion',
                dataIndex: 'fashion',
                editable: !isDisabled,
                selectBox: true,
                selectType: { name: 'company', type: 'after' },
                ellipsis: true,
                align: 'left',
                width: type === 'trim' ? '0' : '26.6%',
                render: (data) => (
                    <Tooltip title={data?.name}>{data?.name}</Tooltip>
                ),
            },

            {
                title: 'Finishing',
                dataIndex: 'finishing',
                editable: !isDisabled,
                selectBox: true,
                selectType: { name: 'company', type: 'after' },
                ellipsis: true,
                align: 'left',
                render: (data) => (
                    <Tooltip title={data?.name}>{data?.name}</Tooltip>
                ),
            },
            {
                title: 'Dyeing',
                dataIndex: 'dyeing',
                editable: !isDisabled,
                selectBox: true,
                selectType: { name: 'company', type: 'after' },
                ellipsis: true,
                align: 'left',
                width: type === 'trim' ? '0' : '26.6%',
                render: (data) => (
                    <Tooltip title={data?.name}>{data?.name}</Tooltip>
                ),
            },
            {
                title: 'Cw',
                dataIndex: 'cw',
                editable: !isDisabled,
                ellipsis: true,
                inputType: 'number',
                inputValidate: {
                    max: '99',
                },
                align: 'left',
                // width: type === 'trim' ? '0' : '10%',
                render: (data) => {
                    const value = <div>{data} in</div>;
                    return <Tooltip title={value}>{value}</Tooltip>;
                },
            },
            // in 고정
            // {
            //     title: 'Cw Uom',
            //     dataIndex: 'cwUom',
            //     selectBox: true,
            //     selectType: { name: 'common', type: 'uom', path: 'length' },
            //     editable: !isDisabled,
            //     ellipsis: true,
            //     // width: type === "trim" ? "0" : "1",
            //     render: (data) => (
            //         <Tooltip title={data?.name3 || data?.name}>
            //             {data?.name3 || data?.name}
            //         </Tooltip>
            //     ),
            // },

            {
                title: 'Weight',
                dataIndex: 'weight',
                editable: !isDisabled,
                ellipsis: true,
                inputType: 'number',
                inputValidate: {
                    max: '999',
                },
                align: 'left',
                // width: type === 'trim' ? '0' : '10%',
                render: (data) => {
                    const value = (
                        <div>
                            {data} {type === 'fabric' && 'g/m2'}
                        </div>
                    );
                    return <Tooltip title={value}>{value}</Tooltip>;
                },
            },
            // Fabrc g/m2 고정 / Trim은 g, oz 선택
            {
                title: 'Weight Uom',
                dataIndex: 'weightUom',
                selectBox: true,
                selectType: {
                    name: 'common',
                    type: 'uom',
                    path: 'mass',
                },
                editable: !isDisabled,
                ellipsis: true,
                width: type === 'trim' ? '1' : '0',
                render: (data) => (
                    <Tooltip title={data?.name3 || data?.name}>
                        {data?.name3 || data?.name}
                    </Tooltip>
                ),
            },
        ],
        [type, isDisabled]
    );

    const title = useMemo(
        () => () =>
            (
                <div className="titleWrap">
                    <div
                        className="title"
                        style={{ fontSize: '0.6785rem', fontWeight: 'bold' }}
                    >
                        <Space>
                            <CaretRightOutlined />
                            OPTIONS
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
                                onClick={() => handleExcute('save')}
                            />
                            <TableButton
                                toolTip={{
                                    placement: 'topLeft',
                                    title: 'Add item',
                                    arrowPointAtCenter: true,
                                }}
                                mode="add"
                                size="small"
                                onClick={() => {
                                    if (
                                        id ||
                                        ref ||
                                        materialInfoGetId.data?.data?.id
                                    ) {
                                        editTableRef.current.handleAdd();
                                    } else {
                                        return handleNotification({
                                            type: 'error',
                                            message: 'Error',
                                            description:
                                                'Please create after registering info',
                                        });
                                    }
                                }}
                            />

                            <TableButton
                                toolTip={{
                                    placement: 'topLeft',
                                    title: 'Delete selected item',
                                    arrowPointAtCenter: true,
                                }}
                                mode="remove"
                                size="small"
                                onClick={() => handleExcute('delete')}
                            />
                        </Space>
                    </div>
                </div>
            ),
        [id, ref, materialInfoGetId, handleExcute, handleNotification]
    );

    return (
        <MaterialOption>
            <div className="materialOptionWrap">
                <CustomTable
                    ref={editTableRef}
                    title={title}
                    rowKey={rowKey}
                    initialColumns={columns}
                    dataSource={dataSource}
                    rowSelection={true}
                    rowSelectionType={rowSelectionType}
                    loading={materialOptionGetInfoId.isLoading}
                    pagination={false}
                    // onGetCheckboxProps={(record) => {
                    //     const { rowStatus } = record;
                    //     return {
                    //         disabled: !rowStatus && isDisabled,
                    //     };
                    // }}
                />
            </div>
        </MaterialOption>
    );
};

export default forwardRef(MaterialRegistrationOption);

const MaterialOption = styled.div`
    height: 100%;
    // padding: 0 1rem 1rem 1rem;
    .materialOptionWrap {
        padding: 0.5rem 1rem 1rem 1rem;
        border: 1px solid lightgray;
        border-radius: 3px;
        box-shadow: 3px 3px gray;
    }
`;
