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
    materialYarnGetInfoIdAsyncAction,
    materialYarnPostAsyncAction,
    // materialYarnPutDeleteAsyncAction,
} from 'store/material/yarn/reducer';
import * as confirm from 'components/common/confirm';
import CustomTable from 'components/common/CustomTable';
import { Space } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import { Tooltip } from 'components/common/tooltip';
import TableButton from 'components/common/table/TableButton';
import styled from 'styled-components';

const MaterialRegistrationYarn = (props, ref) => {
    const { match, infoId, onVisible } = props;
    // infoId ? infoId
    const materialInfoGetId = useSelector(
        (state) => state.materialInfoReducer.get.id
    );
    const id = match?.params?.id || materialInfoGetId.data?.data?.id;

    const rowKey = 'materialYarnID';
    const editTableRef = useRef();
    const dispatch = useDispatch();
    const [handleNotification] = useNotification();
    const [dataSource, setDataSource] = useState([]);

    const materialYarnGetInfoId = useSelector(
        (state) => state.materialYarnReducer.get.infoId
    );
    const handleMaterialYarnGetInfoId = useCallback(
        (payload) =>
            dispatch(materialYarnGetInfoIdAsyncAction.request(payload)),
        [dispatch]
    );
    const handleMaterialYarnGetInfoIdInit = useCallback(
        (payload) =>
            dispatch(materialYarnGetInfoIdAsyncAction.initial(payload)),
        [dispatch]
    );

    const materialYarnPost = useSelector(
        (state) => state.materialYarnReducer.post
    );

    const handleMaterialYarnPost = useCallback(
        (payload) => dispatch(materialYarnPostAsyncAction.request(payload)),
        [dispatch]
    );
    const handleMaterialYarnPostInit = useCallback(
        () => dispatch(materialYarnPostAsyncAction.initial()),
        [dispatch]
    );

    // const materialYarnPutDelete = useSelector(
    //     (state) => state.materialYarnReducer.put.delete
    // );
    // const handleMaterialYarnPutDelete = useCallback(
    //     (payload) =>
    //         dispatch(materialYarnPutDeleteAsyncAction.request(payload)),
    //     [dispatch]
    // );
    // const handleMaterialYarnPutDeleteInit = useCallback(
    //     () => dispatch(materialYarnPutDeleteAsyncAction.initial()),
    //     [dispatch]
    // );

    const userGetEmail = useSelector((state) => state.userReducer.get.email);

    const isDisabled = useMemo(() => {
        if (!materialInfoGetId.data) {
            return false;
        }
        return (
            materialInfoGetId.data?.data.supplier.id !==
            userGetEmail.data?.data.company.companyID
        );
    }, [materialInfoGetId, userGetEmail]);

    useImperativeHandle(ref, () => editTableRef, [editTableRef]);

    const handleExcute = useCallback(
        (type) => {
            const { selectedRows, dataSource } = editTableRef.current;

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
                                materialYarnid:
                                    v.rowStatus === 'new' ? '' : v[rowKey],
                                contentsId: v.contents ? v.contents.id : null,
                                rate: v.rate || 0,
                            };

                            return obj;
                        });

                        if (newValues.some((v) => !v.contentsId || !v.rate)) {
                            return handleNotification({
                                type: 'error',
                                message: 'Error',
                                description: 'Yarn are required values',
                            });
                        } else if (
                            dataSource.reduce((acc, cur) => {
                                return Number(acc) + Number(cur.rate || 0);
                            }, 0) !== 100
                        ) {
                            return handleNotification({
                                type: 'error',
                                message: 'Error',
                                description: 'The total rate is not 100.',
                            });
                        }

                        return handleMaterialYarnPost(newValues);
                    }
                });
            } else if (type === 'delete') {
                confirm.deleteConfirm((e) => {
                    if (e) {
                        const { selectedRows, dataSource } =
                            editTableRef.current;
                        let result = [];
                        for (let v1 of dataSource) {
                            if (
                                !selectedRows.find(
                                    (v2) => v2[rowKey] === v1[rowKey]
                                )
                            ) {
                                result.push(v1);
                            }
                        }
                        setDataSource(result);

                        // 로직이 바뀌었고
                        // Fabric Contents 단에서 Item을 따로 저장하거나 삭제하는 기능이 없어졌다
                        // 추후 현재 컴포넌트를 대체하여 삭제해야 한다.

                        // return handleMaterialYarnPutDelete(
                        //     selectedRowKeys.filter((v) => typeof v !== 'string')
                        // );
                    }
                });
            }
        },
        [
            id,
            infoId,
            handleMaterialYarnPost,
            // handleMaterialYarnPutDelete,
            handleNotification,
        ]
    );

    // Yarn 조회
    useEffect(() => {
        if (id) {
            handleMaterialYarnGetInfoId(id);
        }
        return () => {
            handleMaterialYarnGetInfoIdInit();
        };
    }, [handleMaterialYarnGetInfoId, handleMaterialYarnGetInfoIdInit, id]);

    useEffect(() => {
        if (materialYarnGetInfoId.data) {
            setDataSource(materialYarnGetInfoId.data.list);
        }
    }, [materialYarnGetInfoId]);

    // Yarn 등록
    useEffect(() => {
        if (materialYarnPost.error) {
            return handleNotification({
                type: 'error',
                message: 'Error',
                description: materialYarnPost.error.message,
            });
        } else if (materialYarnPost.data) {
            handleMaterialYarnGetInfoId(id);
            return handleNotification({
                type: 'success',
                message: 'Success',
                description: 'Material yarn registration success',
            });
        }

        return () => handleMaterialYarnPostInit();
    }, [
        materialYarnPost,
        id,
        handleMaterialYarnGetInfoId,
        handleNotification,
        handleMaterialYarnPostInit,
    ]);

    // Yarn 삭제
    // useEffect(() => {
    //     if (materialYarnPutDelete.error) {
    //         return handleNotification({
    //             type: 'error',
    //             message: 'Error',
    //             description: materialYarnPutDelete.error.message,
    //         });
    //     } else if (materialYarnPutDelete.data) {
    //         const { selectedRows, dataSource } = editTableRef.current;
    //         let result = [];
    //         for (let v1 of dataSource) {
    //             if (!selectedRows.find((v2) => v2[rowKey] === v1[rowKey])) {
    //                 result.push(v1);
    //             }
    //         }
    //         setDataSource(result);
    //         return handleNotification({
    //             type: 'success',
    //             message: 'Success',
    //             description: 'Material information deletion successful',
    //         });
    //     }

    //     return () => handleMaterialYarnPutDeleteInit();
    // }, [
    //     materialYarnPutDelete,
    //     editTableRef,
    //     dataSource,
    //     handleNotification,
    //     handleMaterialYarnPutDeleteInit,
    //     setDataSource,
    // ]);

    // 테이블
    const columns = useMemo(
        () => [
            {
                title: 'Name',
                dataIndex: 'contents',
                editable: !isDisabled,
                selectBox: true,
                selectType: { name: 'common', type: 'yarn' },
                ellipsis: true,
                align: 'left',
                render: (data) => (
                    <Tooltip title={data?.name}>{data?.name}</Tooltip>
                ),
            },
            {
                title: 'Rate',
                dataIndex: 'rate',
                editable: !isDisabled,
                ellipsis: true,
                inputType: 'number',
                inputValidate: { max: 100 },
                width: '15%',
                align: 'left',
                render: (data) => {
                    const value = <div>{data} %</div>;
                    return <Tooltip title={value}>{value}</Tooltip>;
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
                            FABRIC CONTENTS
                        </Space>
                    </div>
                    <div className="functionWrap">
                        <Space>
                            {/* ref */}
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
            onVisible,
            materialInfoGetId,
            handleNotification,
            handleExcute,
        ]
    );

    return (
        <FabricContentsWrap>
            <CustomTable
                ref={editTableRef}
                title={title}
                rowKey={rowKey}
                initialColumns={columns}
                dataSource={dataSource}
                rowSelection={true}
                loading={materialYarnGetInfoId.isLoading}
                pagination={false}
                // summary={(pageData) => {
                //     let totalRates = 0;

                //     pageData.forEach(({ rate }) => {
                //         totalRates += Number(rate);
                //     });

                //     if (totalRates > 100) {
                //         return (
                //             <>
                //                 <Table.Summary.Row>
                //                     <Table.Summary.Cell>
                //                         <Text type="danger">Alert</Text>
                //                     </Table.Summary.Cell>
                //                     <Table.Summary.Cell colSpan={2}>
                //                         <Text type="danger">
                //                             The total ratio you entered is over
                //                             100. Rate Sum = {totalRates + ' %'}
                //                         </Text>
                //                     </Table.Summary.Cell>
                //                 </Table.Summary.Row>
                //             </>
                //         );
                //     }
                // }}
                // onGetCheckboxProps={(record) => {
                //     const { rowStatus } = record;
                //     return {
                //         disabled: !rowStatus && isDisabled,
                //     };
                // }}
            />
        </FabricContentsWrap>
    );
};

export default forwardRef(MaterialRegistrationYarn);

const FabricContentsWrap = styled.div`
    height: 100%;
    // padding: 1rem;
    overflow: auto;
    padding: 0.5rem 1rem 1rem 1rem;
    border: 1px solid lightgray;
    border-radius: 3px;
    box-shadow: 3px 3px gray;
`;
