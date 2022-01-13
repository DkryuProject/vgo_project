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
    materialSubsidiaryGetInfoIdAsyncAction,
    materialSubsidiaryPostAsyncAction,
    materialSubsidiaryPutDeleteAsyncAction,
} from 'store/material/subsidiary/reducer';
import * as confirm from 'components/common/confirm';
import CustomTable from 'components/common/CustomTable';
import { Space } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import { Tooltip } from 'components/common/tooltip';
import TableButton from 'components/common/table/TableButton';
import styled from 'styled-components';

const MaterialRegistrationSubsidiary = (props, ref) => {
    const {
        match,
        infoId,
        onVisible,
        materialDataSource,
        rowSelectionType,
        // onVisible,
        // onSelectedSubsidiaryRowKeys,
        // onSelectedSubsidiaryRows,
    } = props;
    const materialInfoGetId = useSelector(
        (state) => state.materialInfoReducer.get.id
    );
    const id = match?.params?.id || materialInfoGetId.data?.data?.id;

    const rowKey = 'materialSubsidiarySizeId';
    const editTableRef = useRef();
    const dispatch = useDispatch();
    const [handleNotification] = useNotification();
    const [dataSource, setDataSource] = useState([]);

    const materialSubsidiaryGetInfoId = useSelector(
        (state) => state.materialSubsidiaryReducer.get.infoId
    );
    const handleMaterialSubsidiaryGetInfoId = useCallback(
        (payload) =>
            dispatch(materialSubsidiaryGetInfoIdAsyncAction.request(payload)),
        [dispatch]
    );
    const handleMaterialSubsidiaryGetInfoIdInit = useCallback(
        (payload) =>
            dispatch(materialSubsidiaryGetInfoIdAsyncAction.initial(payload)),
        [dispatch]
    );

    const materialSubsidiaryPost = useSelector(
        (state) => state.materialSubsidiaryReducer.post
    );
    const handleMaterialSubsidiaryPost = useCallback(
        (payload) =>
            dispatch(materialSubsidiaryPostAsyncAction.request(payload)),
        [dispatch]
    );
    const handleMaterialSubsidiaryPostInit = useCallback(
        () => dispatch(materialSubsidiaryPostAsyncAction.initial()),
        [dispatch]
    );

    const materialSubsidiaryPutDelete = useSelector(
        (state) => state.materialSubsidiaryReducer.put.delete
    );
    const handleMaterialSubsidiaryPutDelete = useCallback(
        (payload) =>
            dispatch(materialSubsidiaryPutDeleteAsyncAction.request(payload)),
        [dispatch]
    );
    const handleMaterialSubsidiaryPutDeleteInit = useCallback(
        () => dispatch(materialSubsidiaryPutDeleteAsyncAction.initial()),
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
        (type) => {
            const { selectedRows, selectedRowKeys } = editTableRef.current;

            if (selectedRows.length === 0) {
                return confirm.warningConfirm('No item is selected');
            }
            if (type === 'save') {
                confirm.saveConfirm((e) => {
                    if (e) {
                        const newValues = selectedRows.map((v, i) => {
                            const obj = {
                                materialInfoId: id
                                    ? Number(id)
                                    : Number(infoId),
                                materialSubsidiarySizeId:
                                    v.rowStatus === 'new' ? '' : v[rowKey],
                                size: v.size,
                                sizeUomId: v.sizeUom,
                            };

                            return obj;
                        });

                        if (newValues.some((v) => !v.size || !v.sizeUomId)) {
                            return handleNotification({
                                type: 'error',
                                message: 'Error',
                                description: 'Size are required values',
                            });
                        }

                        return handleMaterialSubsidiaryPost(newValues);
                    }
                });
            } else if (type === 'delete') {
                confirm.deleteConfirm((e) => {
                    if (e) {
                        return handleMaterialSubsidiaryPutDelete(
                            selectedRowKeys.filter((v) => typeof v !== 'string')
                        );
                    }
                });
            }
        },
        [
            id,
            infoId,
            handleMaterialSubsidiaryPost,
            handleMaterialSubsidiaryPutDelete,
            handleNotification,
        ]
    );

    // Subsidiary 조회
    useEffect(() => {
        if (id) {
            handleMaterialSubsidiaryGetInfoId(id);
        }
        return () => {
            handleMaterialSubsidiaryGetInfoIdInit();
        };
    }, [
        handleMaterialSubsidiaryGetInfoId,
        handleMaterialSubsidiaryGetInfoIdInit,
        id,
    ]);

    useEffect(() => {
        if (materialSubsidiaryGetInfoId.data) {
            setDataSource(materialSubsidiaryGetInfoId.data.list);
        } else if (materialDataSource) {
            setDataSource(materialDataSource);
        }
    }, [materialSubsidiaryGetInfoId, materialDataSource]);

    // Subsidiary 등록
    useEffect(() => {
        if (materialSubsidiaryPost.error) {
            return handleNotification({
                type: 'error',
                message: 'Error',
                description: materialSubsidiaryPost.error.message,
            });
        } else if (materialSubsidiaryPost.data) {
            setDataSource((dataSource) =>
                dataSource.concat(
                    materialSubsidiaryPost.data?.list.map((v) => ({
                        materialSubsidiarySizeId: v.materialSubsidiarySizeId,
                        size: v.size,
                        sizeUom: v.sizeUom,
                        updated: v.updated,
                    }))
                )
            );

            // 위에 데이터를 받으면 새로고침 할 필요가 없다
            // if (id) {
            //     handleMaterialSubsidiaryGetInfoId(id);
            // }
            return handleNotification({
                type: 'success',
                message: 'Success',
                description: 'Material size registration success',
            });
        }

        return () => handleMaterialSubsidiaryPostInit();
    }, [
        id,
        materialSubsidiaryPost,
        handleMaterialSubsidiaryGetInfoId,
        handleNotification,
        handleMaterialSubsidiaryPostInit,
        setDataSource,
    ]);

    // Subsidiary 삭제
    useEffect(() => {
        if (materialSubsidiaryPutDelete.error) {
            return handleNotification({
                type: 'error',
                message: 'Error',
                description: materialSubsidiaryPutDelete.error.message,
            });
        } else if (materialSubsidiaryPutDelete.data) {
            const { selectedRows, dataSource } = editTableRef.current;
            let result = [];
            for (let v1 of dataSource) {
                if (!selectedRows.find((v2) => v2[rowKey] === v1[rowKey])) {
                    result.push(v1);
                }
            }

            setDataSource(result);
            return handleNotification({
                type: 'success',
                message: 'Success',
                description: 'Material size deletion successful',
            });
        }

        return () => handleMaterialSubsidiaryPutDeleteInit();
    }, [
        materialSubsidiaryPutDelete,
        dataSource,
        handleNotification,
        handleMaterialSubsidiaryPutDeleteInit,
        setDataSource,
    ]);

    // 테이블
    const columns = useMemo(
        () => [
            {
                title: 'Name',
                dataIndex: 'size',
                // inputType: 'number',
                editable: !isDisabled,
                ellipsis: true,
                align: 'left',
                render: (data) => <Tooltip title={data}>{data}</Tooltip>,
            },
            {
                title: 'Uom',
                dataIndex: 'sizeUom',
                editable: !isDisabled,
                selectBox: true,
                selectType: {
                    name: 'common',
                    type: 'list',
                    path: 'uom',
                    filter: 'counting&length&mass',
                },
                ellipsis: true,
                align: 'left',
                width: '15%',
                render: (data) => {
                    const _data = data?.name3 || data?.name;
                    return <Tooltip title={_data}>{_data}</Tooltip>;
                },
            },
        ],
        [isDisabled]
    );
    const title = useMemo(
        () => () =>
            (
                <div className="titleWrap">
                    <div className="title">
                        <Space
                            style={{
                                fontSize: '0.6875rem',
                                color: '#000000',
                                fontWeight: 'bold',
                            }}
                        >
                            <CaretRightOutlined />
                            ITEM SIZE
                        </Space>
                    </div>
                    <div className="functionWrap">
                        <Space>
                            {onVisible ? (
                                <TableButton
                                    toolTip={{
                                        placement: 'topLeft',
                                        title: 'Save item',
                                        arrowPointAtCenter: true,
                                    }}
                                    mode="save"
                                    size="small"
                                    onClick={() => onVisible(false)}
                                >
                                    Assign
                                </TableButton>
                            ) : (
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
                            )}

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
        [
            id,
            ref,
            materialInfoGetId,
            onVisible,
            handleExcute,
            handleNotification,
        ]
    );
    return (
        <MaterialSubsidiaryWrap>
            <CustomTable
                ref={editTableRef}
                title={title}
                rowKey={rowKey}
                initialColumns={columns}
                dataSource={dataSource}
                rowSelection={true}
                rowSelectionType={rowSelectionType}
                loading={materialSubsidiaryGetInfoId.isLoading}
                pagination={false}
                // onGetCheckboxProps={(record) => {
                //     const { rowStatus } = record;
                //     return {
                //         disabled: !rowStatus && isDisabled,
                //     };
                // }}
            />
        </MaterialSubsidiaryWrap>
    );
};

export default forwardRef(MaterialRegistrationSubsidiary);

const MaterialSubsidiaryWrap = styled.div`
    height: 100%;
    padding: 0.5rem 1rem 1rem 1rem;
    overflow: auto;

    border: 1px solid lightgray;
    border-radius: 3px;
    box-shadow: 3px 3px gray;
`;
