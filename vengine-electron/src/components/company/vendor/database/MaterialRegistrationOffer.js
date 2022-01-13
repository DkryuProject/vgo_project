import React, {
    useState,
    useCallback,
    useEffect,
    useMemo,
    useRef,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useNotification from 'core/hook/useNotification';
import {
    materialOfferGetInfoIdAsyncAction,
    materialOfferPostAsyncAction,
    materialOfferPutDeleteAsyncAction,
} from 'store/material/offer/reducer';
import * as confirm from 'components/common/confirm';
import CustomTable from 'components/common/CustomTable';
import { Space } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import { Tooltip } from 'components/common/tooltip';
import TableButton from 'components/common/table/TableButton';
import styled from 'styled-components';
import dateFormat from 'core/utils/dateUtil';
import { JcBetween } from 'styles/Layout';
import formatNumberUtil from 'core/utils/formatNumberUtil';

const MaterialRegistrationOffer = (props) => {
    const {
        match,
        location,
        infoId,
        infoType,
        // onSelectedOptionRowKeys,
    } = props;
    // infoId ? infoId :

    const materialInfoGetId = useSelector(
        (state) => state.materialInfoReducer.get.id
    );
    const id = match?.params?.id || materialInfoGetId.data?.data?.id;
    const type = location.state ? location.state.type : infoType;
    const rowKey = 'materialOfferId';
    const editTableRef = useRef();
    const dispatch = useDispatch();
    const [handleNotification] = useNotification();
    const [dataSource, setDataSource] = useState([]);

    const materialOfferGetInfoId = useSelector(
        (state) => state.materialOfferReducer.get.infoId
    );
    const handleMaterialOfferGetInfoId = useCallback(
        (payload) =>
            dispatch(materialOfferGetInfoIdAsyncAction.request(payload)),
        [dispatch]
    );
    const handleMaterialOfferGetInfoIdInit = useCallback(
        (payload) =>
            dispatch(materialOfferGetInfoIdAsyncAction.initial(payload)),
        [dispatch]
    );

    const materialOfferPost = useSelector(
        (state) => state.materialOfferReducer.post
    );
    const handleMaterialOfferPost = useCallback(
        (payload) => dispatch(materialOfferPostAsyncAction.request(payload)),
        [dispatch]
    );
    const handleMaterialOfferPostInit = useCallback(
        () => dispatch(materialOfferPostAsyncAction.initial()),
        [dispatch]
    );

    const materialOfferPutDelete = useSelector(
        (state) => state.materialOfferReducer.put.delete
    );
    const handleMaterialOfferPutDelete = useCallback(
        (payload) =>
            dispatch(materialOfferPutDeleteAsyncAction.request(payload)),
        [dispatch]
    );
    const handleMaterialOfferPutDeleteInit = useCallback(
        () => dispatch(materialOfferPutDeleteAsyncAction.initial()),
        [dispatch]
    );

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
                                // materialInfoId: id
                                //     ? Number(id)
                                //     : Number(infoId),
                                materialOfferId:
                                    v.rowStatus === 'new' ? '' : v[rowKey],
                                materialSubsidiarySizeId: v.subsidiary
                                    ? v.subsidiary.materialSubsidiarySizeId ||
                                      v.subsidiary.id
                                    : null,
                                // supplier면 buyer 선택 vendor면 자기 회사 삽입
                                recipientId: !isDisabled
                                    ? v.notEditable?.id
                                    : userGetEmail.data?.data.company.companyID,
                                buyerCompanyId: v.buyerCompany?.id,
                                brandId: v.brand?.id,
                                materialOptionId:
                                    v.option?.materialOptionID || v.option?.id,
                                uomId: v.uom.id,
                                unitPrice: v.unitPrice,
                                currencyId: v.currency.id,
                                moq: v.moq || 0,
                                mcq: v.mcq || 0,
                            };
                            return obj;
                        });

                        return handleMaterialOfferPost({
                            id: id ? Number(id) : Number(infoId),
                            data: newValues,
                        });
                    }
                });
            } else if (type === 'delete') {
                confirm.deleteConfirm((e) => {
                    if (e) {
                        return handleMaterialOfferPutDelete(
                            selectedRowKeys.filter((v) => typeof v !== 'string')
                        );
                    }
                });
            }
        },
        [
            id,
            infoId,
            isDisabled,
            userGetEmail,
            handleMaterialOfferPost,
            handleMaterialOfferPutDelete,
        ]
    );

    // Option 조회
    useEffect(() => {
        if (id) {
            handleMaterialOfferGetInfoId(id);
        }
        return () => {
            handleMaterialOfferGetInfoIdInit();
        };
    }, [handleMaterialOfferGetInfoId, handleMaterialOfferGetInfoIdInit, id]);

    useEffect(() => {
        if (materialOfferGetInfoId.data) {
            setDataSource(materialOfferGetInfoId.data.list);
        }
    }, [materialOfferGetInfoId]);

    // Option 등록
    useEffect(() => {
        if (materialOfferPost.error) {
            return handleNotification({
                type: 'error',
                message: 'Error',
                description: materialOfferPost.error.message,
            });
        } else if (materialOfferPost.data) {
            handleMaterialOfferGetInfoId(id);
            return handleNotification({
                type: 'success',
                message: 'Success',
                description: 'Material offered price creation success',
            });
        }

        return () => handleMaterialOfferPostInit();
    }, [
        materialOfferPost,
        id,
        handleMaterialOfferGetInfoId,
        handleNotification,
        handleMaterialOfferPostInit,
    ]);

    // Option 삭제
    useEffect(() => {
        if (materialOfferPutDelete.error) {
            return handleNotification({
                type: 'error',
                message: 'Error',
                description: materialOfferPutDelete.error.message,
            });
        } else if (materialOfferPutDelete.data) {
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

        return () => handleMaterialOfferPutDeleteInit();
    }, [
        materialOfferPutDelete,
        dataSource,
        handleNotification,
        handleMaterialOfferPutDeleteInit,
        setDataSource,
    ]);

    // 테이블
    const columns = useMemo(
        () => [
            {
                title: 'Recipient',
                dataIndex: 'notEditable',
                editable: !isDisabled,
                selectBox: true,
                selectType: {
                    name: 'company',
                    type: 'relation',
                    path: 'BUYER',
                },
                ellipsis: true,
                align: 'left',
                width: '10%',
                render: (_, record) => {
                    const { recipient } = record;
                    // add시 data === null 인데 글쓴이가 vendor 입장이면 회사명 supplier 입장이면 ''
                    // All시 data.name === null
                    // 지정된 buyer가 있을 시 data.name === 지정된 buyer
                    let value = null;
                    if (recipient) {
                        value = recipient?.name || 'All';
                    } else {
                        value = !isDisabled
                            ? recipient?.name
                            : userGetEmail.data?.data.company.companyName;
                    }
                    return <Tooltip title={value}>{value}</Tooltip>;
                },
            },
            {
                title: 'Buyer',
                dataIndex: 'buyerCompany',
                editable: !isDisabled,
                selectBox: true,
                selectType: {
                    name: 'company',
                    type: 'relation',
                    path: 'BUYER',
                },
                ellipsis: true,
                align: 'left',
                width: '10%',
                render: (data) => (
                    <Tooltip title={data?.name}>{data?.name}</Tooltip>
                ),
            },

            {
                title: 'Brand',
                dataIndex: 'brand',
                editable: !isDisabled,
                selectBox: true,
                selectType: { name: 'company', type: 'brand' },
                ellipsis: true,
                align: 'left',
                width: '10%',
                render: (data) => (
                    <Tooltip title={data?.name}>{data?.name}</Tooltip>
                ),
            },

            {
                title: 'Item Size',
                dataIndex: 'subsidiary',
                editable: !isDisabled,
                selectBox: true,
                selectType: {
                    name: 'material',
                    type: 'subsidary',
                    path: id,
                },
                ellipsis: true,
                align: 'left',
                width: type === 'fabric' ? '0' : '1',
                render: (data) => {
                    const _data = data?.data || data;
                    const value = (
                        <div>
                            {_data?.size} {_data?.sizeUom?.name3}
                        </div>
                    );
                    return <Tooltip title={value}>{value}</Tooltip>;
                },
            },

            {
                title: 'Item Options',
                dataIndex: 'option',
                editable: !isDisabled,
                selectBox: true,
                selectType: {
                    name: 'material',
                    type: 'option',
                    path: id,
                },
                ellipsis: true,
                align: 'left',
                width: type === 'accessories' ? '0' : '20%',
                render: (_, record) => {
                    const { option } = record?.data || record;
                    const value = (
                        <div>
                            * Finished/Dye Method : Nano{' '}
                            {option?.fashion?.name ||
                                option?.data?.fashion?.name}{' '}
                            {option?.finishing?.name ||
                                option?.data?.finishing?.name}{' '}
                            {option?.dyeing?.name || option?.data?.dyeing?.name}
                        </div>
                    );

                    return <Tooltip title={value}>{value}</Tooltip>;
                },
            },
            {
                title: 'Currency',
                dataIndex: 'currency',
                editable: !isDisabled,
                selectBox: true,
                selectType: { name: 'common', type: 'currency' },
                ellipsis: true,
                align: 'left',
                width: '5%',
                render: (data) => {
                    const _data = data?.name2 || data?.name;
                    return <Tooltip title={_data}>{_data}</Tooltip>;
                },
            },
            {
                title: 'Unit Price',
                dataIndex: 'unitPrice',
                editable: !isDisabled,
                ellipsis: true,
                inputType: 'decimals',
                inputValidate: { maxLength: type === 'fabric' ? 2 : 5 },
                align: 'right',
                width: '5%',
                render: (data) => {
                    const _data = formatNumberUtil(data);
                    return <Tooltip title={_data}>{_data}</Tooltip>;
                },
            },
            {
                title: 'Uom',
                dataIndex: 'uom',
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
                width: '5%',
                render: (data) => (
                    <Tooltip title={data?.name3 || data?.name}>
                        {data?.name3 || data?.name}
                    </Tooltip>
                ),
            },

            {
                title: 'Moq',
                dataIndex: 'moq',
                editable: !isDisabled,
                ellipsis: true,
                inputType: 'number',
                inputValidate: { max: 9999999999 },
                align: 'right',
                width: '5%',
                render: (data) => {
                    const _data = formatNumberUtil(data);
                    return <Tooltip title={_data}>{_data}</Tooltip>;
                },
            },
            {
                title: 'Mcq',
                dataIndex: 'mcq',
                editable: !isDisabled,
                ellipsis: true,
                inputType: 'number',
                inputValidate: { max: 9999999999 },
                align: 'right',
                width: '5%',
                render: (data) => {
                    const _data = formatNumberUtil(data);
                    return <Tooltip title={_data}>{_data}</Tooltip>;
                },
            },
            {
                title: 'Modified Date/Time/By',
                dataIndex: 'notEditable',
                ellipsis: true,
                align: 'left',
                width: '15%',
                render: (_, record) => {
                    const { createdBy, updated } = record;
                    const value = (
                        <div>
                            <JcBetween>
                                <div>* Date/Time : </div>
                                <div>{dateFormat(updated)}</div>
                            </JcBetween>
                            <JcBetween>
                                <div>* By : </div>
                                <div>{createdBy?.userName}</div>
                            </JcBetween>
                        </div>
                    );
                    return <Tooltip title={value}>{value}</Tooltip>;
                },
            },
        ],
        [type, id, isDisabled, userGetEmail]
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
                            OFFRED PRICE OPTION
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
        [id, materialInfoGetId, handleNotification, handleExcute]
    );

    return (
        <MaterialOffer>
            <div className="materialOfferWrap">
                <CustomTable
                    ref={editTableRef}
                    title={title}
                    rowKey={rowKey}
                    // recipient 컬럼을 supplier가 작성했을시 보이고 vendor가 작성했을시 안보인다
                    // column에서 width로 해결 되지 않아서 필터 사용
                    // initialColumns={columns.filter(
                    //     (v) => v.dataIndex !== 'recipient' || !isDisabled
                    // )}
                    initialColumns={columns}
                    dataSource={dataSource}
                    rowSelection={true}
                    loading={materialOfferGetInfoId.isLoading}
                    pagination={false}
                    onGetCheckboxProps={(record) => {
                        const { rowStatus } = record;
                        return {
                            disabled: !rowStatus && isDisabled,
                        };
                    }}
                />
            </div>
        </MaterialOffer>
    );
};

export default MaterialRegistrationOffer;

// BUYER는 내가 relation한 회사만 나온다
// BRAND는 내가 buyer-subsidiary한 회사만 나온다 (내가 BUYER로 선택한 회사 자체가 buyer-subsidiary한 회사가 나오는게 아니다)

const MaterialOffer = styled.div`
    height: 100%;
    // padding: 0 1rem 1rem 1rem;
    .materialOfferWrap {
        padding: 0.5rem 1rem 1rem 1rem;
        border: 1px solid lightgray;
        border-radius: 3px;
        box-shadow: 3px 3px gray;
    }
`;
