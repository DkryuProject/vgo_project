import React, {
    useState,
    useMemo,
    useCallback,
    useEffect,
    useRef,
    useContext,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useNotification from 'core/hook/useNotification';
import useGtag from 'core/hook/useGtag';
import useValidateMessage from 'core/hook/useValidateMessage';

import {
    companySearchListsAsyncAction,
    // companyInfoSaveAsyncAction,
} from 'store/companyInfo/reducer';
import { commonBasicGetListsAsyncAction } from 'store/common/basic/reducer';
import {
    mclPlanningGetListsAsyncAction,
    mclPlanningGetIdAsyncAction,
    mclPlanningPostCopyAsyncAction,
    mclPlanningPutIdAsyncAction,
    mclPlanningPutStatusAsyncAction,
    mclPlanningDeleteAsyncAction,
} from 'store/mcl/planning/reducer';

import styled from 'styled-components';
import {
    Form,
    Input,
    Space,
    Drawer,
    Tabs,
    Radio,
    Checkbox,
    Switch,
    InputNumber,
} from 'antd';
import { FilterSelect } from 'components/common/select';
import * as confirm from 'components/common/confirm';
import TableButton from 'components/common/table/TableButton';
import { PushpinOutlined } from '@ant-design/icons';
import { Tooltip } from 'components/common/tooltip';
import CustomTable from 'components/common/CustomTable';
import formatNumberUtil from 'core/utils/formatNumberUtil';
import { useMutation, useQuery } from 'react-query';
import { Ellipsis, Select } from 'components/UI/atoms';
import { MaterialOfferedPrice } from 'components/UI/organisms';
import { handleNotification } from 'core/utils/notificationUtil';
import { DrawerContext } from 'components/context/drawerContext';
import {
    materialOfferGetListApi,
    materialOfferPostApi,
} from 'core/api/material/offer';
import handleCalculationResult from 'core/utils/uomUtil';
import { Fragment } from 'react';
import { commonBasicGetListsApi } from 'core/api/common/basic';
const { TabPane } = Tabs;

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};
const MaterialOption = React.memo((props) => {
    const { visible, onVisible, onOption } = props;
    const editTableRef = useRef();
    const rowKey = 'id';
    const [dataSource, setDataSource] = useState([]);
    const [materialOfferForm] = Form.useForm();
    const { openDrawer, closeDrawer } = useContext(DrawerContext);

    // Detail Offer Fetch
    const {
        isFetching: materialOfferGetListIsFetching,
        refetch: materialOfferGetListRefetch,
    } = useQuery(
        ['materialOfferGetList', visible.id],
        () => materialOfferGetListApi(visible.id),
        {
            onSuccess: (res) => {
                const { list } = res;
                setDataSource(list);
            },
            enabled: !!visible.id,
            cacheTime: 0,
        }
    );

    const { mutateAsync: materialOfferPostMutate } = useMutation((payload) =>
        materialOfferPostApi(payload)
    );

    // Detail Offer Function
    const handleMaterialOfferSubmit = async (values) => {
        // recipientId ALL 처리
        if (values['recipientId'] < 0) {
            values['recipientId'] = null;
        }

        try {
            const res = await materialOfferPostMutate({
                id: values['materialId'],
                data: values,
            });

            if (res) {
                handleNotification({
                    type: 'success',
                    message: 'Success',
                    description: 'Material Offered price Create Success',
                });
                closeDrawer('materialOfferPrice');
                return materialOfferGetListRefetch();
            }
        } catch (error) {
            console.log(error);
        }
    };

    // 테이블
    const columns = useMemo(
        () => [
            {
                title: 'Material No.',
                dataIndex: 'materialNo',
                render: (data) => (
                    <Tooltip title={data || '-'}>{data || '-'}</Tooltip>
                ),
            },
            {
                title: 'Buying Company',
                dataIndex: 'recipient',
                align: 'left',
                ellipsis: true,
                render: (data) => (
                    <Tooltip title={data?.name || 'ALL'}>
                        {data?.name || 'ALL'}
                    </Tooltip>
                ),
            },
            {
                title: 'Item Size Options',
                dataIndex: 'itemSizeOption',
                align: 'left',
                ellipsis: true,
                width: visible.type === 'fabric' ? '0' : '10%',
                render: (data) => {
                    const { size, sizeUom } = data;
                    const output = (
                        <Ellipsis>
                            * Item Size :{' '}
                            {size ? (
                                <span>
                                    {size} {sizeUom?.name3}
                                </span>
                            ) : (
                                '-'
                            )}
                        </Ellipsis>
                    );

                    return <Tooltip title={output}>{output}</Tooltip>;
                },
            },
            {
                title: 'Item Options',
                dataIndex: 'itemOption',
                align: 'left',
                ellipsis: true,
                render: (data, record) => {
                    const {
                        cw,
                        cwUom,
                        weight,
                        weightUom,
                        finishing,
                        dyeing,
                        printing,
                    } = data || {};
                    const {
                        function: _function,
                        performance,
                        characteristic,
                        solid_pattern,
                        stretch,
                    } = record || {};
                    const output = (
                        <Fragment>
                            <Ellipsis>
                                * Width/Weight:{' '}
                                {cw ? (
                                    <span>
                                        {cw} {cwUom?.name3 || 'inch'}
                                    </span>
                                ) : (
                                    '-'
                                )}{' '}
                                /{' '}
                                {weight ? (
                                    <span>
                                        {' '}
                                        {weight} {weightUom?.name3 || 'GSM'}
                                    </span>
                                ) : (
                                    '-'
                                )}
                                * Dyeing: {dyeing || '-'}
                                {visible?.type === 'fabric' && (
                                    <Fragment>
                                        * Function: {_function || '-'}
                                    </Fragment>
                                )}
                            </Ellipsis>
                            <Ellipsis>
                                * Post Processing: {finishing || '-'}
                                {visible?.type === 'fabric' && (
                                    <Fragment>
                                        * Performance: {performance || '-'} *
                                        Stretch: {stretch || '-'}
                                    </Fragment>
                                )}
                            </Ellipsis>
                            <Ellipsis>
                                * Printing: {printing || '-'}
                                {visible?.type === 'fabric' && (
                                    <Fragment>
                                        * Characteristic:{' '}
                                        {characteristic || '-'} * Soild/Pattern:{' '}
                                        {solid_pattern || '-'}
                                    </Fragment>
                                )}
                            </Ellipsis>
                        </Fragment>
                    );
                    return (
                        <Tooltip
                            title={
                                <Fragment>
                                    <div>
                                        * Width/Weight:{' '}
                                        {cw ? (
                                            <span>
                                                {cw} {cwUom?.name3 || 'inch'}
                                            </span>
                                        ) : (
                                            '-'
                                        )}{' '}
                                        /{' '}
                                        {weight ? (
                                            <span>
                                                {' '}
                                                {weight}{' '}
                                                {weightUom?.name3 || 'GSM'}
                                            </span>
                                        ) : (
                                            '-'
                                        )}
                                        * Dyeing: {dyeing || '-'}
                                        {visible?.type === 'fabric' && (
                                            <Fragment>
                                                * Function: {_function || '-'}
                                            </Fragment>
                                        )}
                                    </div>
                                    <div>
                                        * Post Processing: {finishing || '-'}{' '}
                                        {visible?.type === 'fabric' && (
                                            <Fragment>
                                                * Performance:{' '}
                                                {performance || '-'} * Stretch:{' '}
                                                {stretch || '-'}
                                            </Fragment>
                                        )}
                                    </div>
                                    <div>
                                        * Printing: {printing || '-'}
                                        {visible?.type === 'fabric' && (
                                            <Fragment>
                                                * Characteristic:{' '}
                                                {characteristic || '-'} *
                                                Soild/Pattern:{' '}
                                                {solid_pattern || '-'}
                                            </Fragment>
                                        )}
                                    </div>
                                </Fragment>
                            }
                        >
                            {output}
                        </Tooltip>
                    );
                },
            },
            {
                title: 'Unit Price & UOM',
                align: 'left',
                ellipsis: true,
                render: (_, record) => {
                    const { unitPrice, currency, uom } = record || {};
                    const output = (
                        <Fragment>
                            <Ellipsis>
                                * Currency: {currency?.name2 || '-'}
                            </Ellipsis>
                            <Ellipsis>
                                * Unit Price: {currency?.name3 || '-'}{' '}
                                {unitPrice || '-'}
                            </Ellipsis>
                            <Ellipsis>* UOM: {uom?.name3 || '-'}</Ellipsis>
                        </Fragment>
                    );
                    return (
                        <Tooltip
                            title={
                                <Fragment>
                                    <div>
                                        * Currency: {currency?.name2 || '-'}
                                    </div>
                                    <div>
                                        * Unit Price: {currency?.name3 || '-'}{' '}
                                        {unitPrice || '-'}
                                    </div>
                                    <div>* UOM: {uom?.name3 || '-'}</div>
                                </Fragment>
                            }
                        >
                            {output}
                        </Tooltip>
                    );
                },
            },
            {
                title: 'Minimum Order',
                align: 'left',
                ellipsis: true,
                render: (_, record) => {
                    const { mcq, moq, lead_time } = record || {};
                    const output = (
                        <Fragment>
                            <Ellipsis>* MCQ: {mcq ?? '-'}</Ellipsis>
                            <Ellipsis>* MOQ: {moq ?? '-'}</Ellipsis>
                            <Ellipsis>* Lead Time: {lead_time || '-'}</Ellipsis>
                        </Fragment>
                    );
                    return (
                        <Tooltip
                            title={
                                <Fragment>
                                    <div>* MCQ: {mcq ?? '-'}</div>
                                    <div>* MOQ: {moq ?? '-'}</div>
                                    <div>* Lead Time: {lead_time || '-'}</div>
                                </Fragment>
                            }
                        >
                            {output}
                        </Tooltip>
                    );
                },
            },
            {
                title: 'Modified Date/Time/By',
                dataIndex: 'updated',
                align: 'left',
                ellipsis: true,
                render: (data, record) => {
                    const output = (
                        <Fragment>
                            <Ellipsis>* Modified Data/Time: {data}</Ellipsis>
                            <Ellipsis>
                                * By: {record?.createdBy?.userName}
                            </Ellipsis>
                        </Fragment>
                    );
                    return (
                        <Tooltip
                            title={
                                <Fragment>
                                    <div>* Modified Data/Time: {data}</div>
                                    <div>
                                        * By: {record?.createdBy?.userName}
                                    </div>
                                </Fragment>
                            }
                        >
                            {output}
                        </Tooltip>
                    );
                },
            },
        ],
        [visible.type]
    );

    const title = () => (
        <div className="titleWrap">
            <div className="title">
                <Space>
                    <PushpinOutlined />
                    OFFERED PRICE
                </Space>
            </div>
            <div className="functionWrap">
                <Space>
                    <TableButton
                        toolTip={{
                            placement: 'topLeft',
                            title: 'Assign',
                            arrowPointAtCenter: true,
                        }}
                        mode="save"
                        size="small"
                        onClick={() => {
                            onOption(editTableRef.current.selectedRows[0]);
                            return onVisible({ status: false });
                        }}
                    >
                        Assign
                    </TableButton>
                    <TableButton
                        toolTip={{
                            placement: 'topLeft',
                            title: 'Create',
                            arrowPointAtCenter: true,
                        }}
                        mode="add"
                        size="small"
                        onClick={() =>
                            openDrawer(
                                'materialOfferPrice',
                                <MaterialOfferedPrice
                                    initialValues={{
                                        cwUomId: 31,
                                        fullWidthUomId: 31,
                                        currencyId: 314,
                                        uomId:
                                            visible?.type === 'fabric'
                                                ? 33
                                                : 54,
                                    }}
                                    type={visible?.type}
                                    materialOfferForm={materialOfferForm}
                                    onMaterialOfferSubmit={(values) =>
                                        handleMaterialOfferSubmit({
                                            ...values,
                                            materialId: visible?.id,
                                        })
                                    }
                                    onMaterialOfferCloseDrawer={() =>
                                        closeDrawer('materialOfferPrice')
                                    }
                                />
                            )
                        }
                    />
                </Space>
            </div>
        </div>
    );

    return (
        <OptionWrap>
            <CustomTable
                ref={editTableRef}
                title={title}
                rowKey={rowKey}
                initialColumns={columns}
                dataSource={dataSource}
                rowSelection={true}
                rowSelectionType="radio"
                loading={materialOfferGetListIsFetching}
            />
        </OptionWrap>
    );
});

const MclMaterialDetail = (props) => {
    const { match, initialShow, show, onShow, onLeftSplit } = props;

    // 해당 Material Item의 type과 id
    const { type, id } = show.materialDetail;
    const mclOptionId = (match && match.params.mclOptionId) || '';
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const [handleValidateMessage] = useValidateMessage();
    const [handleNotification] = useNotification();
    const { trackPageView } = useGtag();
    const [netYy, setNetYy] = useState(0);
    const [loss, setLoss] = useState(0);
    const [option, setOption] = useState(null);
    const [visible, setVisible] = useState({
        id: null,
        type: null,
        status: false,
    });
    const [uom, setUom] = useState(null);
    const [unitPrice, setUnitPrice] = useState(0);
    const [color, setColor] = useState({ type: 'NotApplicable', ids: [] });
    const [size, setSize] = useState({ type: 'NotApplicable', ids: [] });
    const [market, setMarket] = useState({ type: 'NotApplicable', ids: [] });
    const [status, setStatus] = useState(null);

    const grossYy = useMemo(() => {
        return parseFloat(netYy * (loss / 100 + 1)).toFixed(3);
    }, [netYy, loss]);

    const isDisabled = useMemo(() => (status ? false : true), [status]);

    const handleCompanySearchLists = useCallback(
        (payload) => dispatch(companySearchListsAsyncAction.request(payload)),
        [dispatch]
    );

    const companyInfoSave = useSelector(
        (state) => state.companyInfoReducer.save
    );

    const mclPlanningGetId = useSelector(
        (state) => state.mclPlanningReducer.get.id
    );
    const handleMclPlanningGetId = useCallback(
        (payload) => dispatch(mclPlanningGetIdAsyncAction.request(payload)),
        [dispatch]
    );
    const handleMclPlanningGetIdInit = useCallback(
        () => dispatch(mclPlanningGetIdAsyncAction.initial()),
        [dispatch]
    );

    const mclPlanningPutId = useSelector(
        (state) => state.mclPlanningReducer.put.id
    );
    const handleMclPlanningPutId = useCallback(
        (payload) => dispatch(mclPlanningPutIdAsyncAction.request(payload)),
        [dispatch]
    );
    const handleMclPlanningPutIdInit = useCallback(
        () => dispatch(mclPlanningPutIdAsyncAction.initial()),
        [dispatch]
    );

    const mclPlanningPutStatus = useSelector(
        (state) => state.mclPlanningReducer.put.status
    );
    const handleMclPlanningPutStatus = useCallback(
        (payload) => dispatch(mclPlanningPutStatusAsyncAction.request(payload)),
        [dispatch]
    );
    const handleMclPlanningPutStatusInit = useCallback(
        () => dispatch(mclPlanningPutStatusAsyncAction.initial()),
        [dispatch]
    );

    const mclPlanningDelete = useSelector(
        (state) => state.mclPlanningReducer.delete
    );
    const handleMclPlanningDelete = useCallback(
        (payload) => dispatch(mclPlanningDeleteAsyncAction.request(payload)),
        [dispatch]
    );
    const handleMclPlanningDeleteInit = useCallback(
        () => dispatch(mclPlanningDeleteAsyncAction.initial()),
        [dispatch]
    );

    const handleMclPlanningGetLists = useCallback(
        (payload) => dispatch(mclPlanningGetListsAsyncAction.request(payload)),
        [dispatch]
    );

    // Actual color
    const commonBasicGetLists = useSelector(
        (state) => state.commonBasicReducer.get.lists
    );
    const handleCommonBasicGetLists = useCallback(
        (payload) => dispatch(commonBasicGetListsAsyncAction.request(payload)),
        [dispatch]
    );

    // GARMENT COLOR
    const mclGarmentColorGetLists = useSelector(
        (state) => state.mclGarmentColorReducer.get.lists
    );

    // GARMENT SIZE
    const mclGarmentSizeGetLists = useSelector(
        (state) => state.mclGarmentSizeReducer.get.lists
    );

    // GARMENT MARKET
    const mclGarmentMarketGetLists = useSelector(
        (state) => state.mclGarmentMarketReducer.get.lists
    );

    const mclPlanningPostCopy = useSelector(
        (state) => state.mclPlanningReducer.post.copy
    );
    const handleMclPlanningPostCopy = useCallback(
        (payload) => dispatch(mclPlanningPostCopyAsyncAction.request(payload)),
        [dispatch]
    );
    const handleMclPlanningPostCopyInit = useCallback(
        (payload) => dispatch(mclPlanningPostCopyAsyncAction.initial(payload)),
        [dispatch]
    );

    // 수정
    const handleSubmit = useCallback(
        (values) => {
            if (mclPlanningGetId.data) {
                const data = {
                    status: 'OPEN',
                    actualColor:
                        typeof values.actualColor === 'string'
                            ? mclPlanningGetId.data.data.commonActualColor.id
                            : values.actualColor,
                    colorDependency: color,
                    itemColor: values.itemColor,
                    marketDependency: market,
                    materialOfferId: option?.id || null,
                    mclMaterialUomId:
                        typeof values.mclMaterialUomId === 'string'
                            ? uom?.id
                            : values.mclMaterialUomId,
                    netYy: netYy,
                    sizeDependency: size,
                    sizeMemo: values.sizeMemo,
                    tolerance: values.tolerance,
                    usagePlace: values.usagePlace,
                    unitPrice: unitPrice,
                };

                return handleMclPlanningPutId({ id: id, data: data });
            }
        },
        [
            id,
            mclPlanningGetId,
            netYy,
            color,
            size,
            market,
            option,
            uom,
            unitPrice,
            handleMclPlanningPutId,
        ]
    );

    const handleMaterialCopy = useCallback(async () => {
        // const values = form.getFieldsValue();
        const values = await form.validateFields();

        if (mclPlanningGetId.data) {
            const { id, commonActualColor, mclMaterialUom } =
                mclPlanningGetId.data.data;

            const newValues = {
                status: 'OPEN',
                materialOfferId: option?.id || null,
                sizeMemo: values.sizeMemo,
                itemColor: values.itemColor,
                actualColor:
                    typeof values.actualColor === 'string'
                        ? commonActualColor.id
                        : values.actualColor,
                tolerance: values.tolerance,
                netYy: netYy,
                usagePlace: values.usagePlace,
                mclMaterialUomId:
                    typeof values.mclMaterialUomId === 'string'
                        ? mclMaterialUom.id
                        : values.mclMaterialUomId,
                marketDependency: market,
                colorDependency: color,
                sizeDependency: size,
            };

            handleMclPlanningPostCopy({ id: id, data: newValues });
        }
    }, [
        form,
        mclPlanningGetId,
        color,
        market,
        size,
        option,
        netYy,

        handleMclPlanningPostCopy,
    ]);

    const handleDelete = () => {
        return handleMclPlanningDelete(id);
    };

    const handleChangeStatus = useCallback(
        (isChecked) => {
            if (isChecked) {
                // 권한 해제
                // if (userGetEmail.data?.data?.level?.userLevelId > 1) {
                //     setStatus(isChecked);
                //     return handleMclPlanningPutStatus({
                //         id: id,
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
                return handleMclPlanningPutStatus({
                    id: id,
                    data: isChecked ? 'OPEN' : 'CLOSE',
                });
            } else {
                setStatus(isChecked);
                return handleMclPlanningPutStatus({
                    id: id,
                    data: isChecked ? 'OPEN' : 'CLOSE',
                });
            }
        },
        [id, handleMclPlanningPutStatus]
    );

    const handleDependency = (variable, fn, arr, column, isDisabled) => {
        arr = arr || [];
        return (
            <div>
                <Radio.Group
                    value={variable.type}
                    onChange={(e) =>
                        fn((prev) => {
                            const type = e.target.value;
                            return {
                                ...prev,
                                type: type,
                                ids: type === 'All' ? arr.map((v) => v.id) : [],
                            };
                        })
                    }
                    disabled={isDisabled}
                    size="small"
                >
                    <Radio value="All">All</Radio>
                    <Radio value="Selective">Selective</Radio>
                    <Radio value="NotApplicable">Not Applicable</Radio>
                </Radio.Group>
                <div style={{ marginTop: '1rem' }}>
                    <Checkbox.Group
                        options={arr.map((v) => ({
                            label:
                                typeof v[column] === 'string'
                                    ? v[column]
                                    : v[column].name,
                            value: v.id,
                            disabled: variable.type === 'NotApplicable',
                        }))}
                        value={variable.ids}
                        onChange={(v) =>
                            fn((prev) => {
                                const length = arr.length;

                                return {
                                    ...prev,
                                    type: !v.length
                                        ? 'NotApplicable'
                                        : v.length === length
                                        ? 'All'
                                        : 'Selective',
                                    ids: v,
                                };
                            })
                        }
                        disabled={isDisabled}
                        size="small"
                    />
                </div>
            </div>
        );
    };

    // usage 생성 후 조회
    useEffect(() => {
        if (companyInfoSave.data) {
            handleCompanySearchLists('usage');
        }
    }, [companyInfoSave, handleCompanySearchLists]);

    // 조회
    useEffect(() => {
        if (id) {
            handleMclPlanningGetId(id);
        }

        return () => handleMclPlanningGetIdInit();
    }, [id, handleMclPlanningGetId, handleMclPlanningGetIdInit]);

    useEffect(() => {
        if (mclPlanningGetId.error) {
            return handleNotification({
                type: 'error',
                message: 'Error',
                description: mclPlanningGetId.error.message,
            });
        } else if (mclPlanningGetId.data) {
            const {
                usagePlace,
                netYy,
                tolerance,
                mclMaterialUom,
                unitPrice,
                materialAfterManufacturingFinishing,
                materialAfterManufacturingDyeing,
                materialAfterManufacturingFashion,
                fabricCw,
                fabricWeight,
                fabricWeightUom,
                subsidiarySize,
                subsidiarySizeUom,
                fabricColorName,
                commonActualColor,
                colorDependency,
                sizeDependency,
                marketDependency,
                status,
                sizeMemo,
                material_offer_uom,
            } = mclPlanningGetId.data.data;

            setNetYy(netYy);
            setLoss(tolerance);
            setOption((option) => ({
                ...option,
                unitPrice: unitPrice,
                uom: material_offer_uom,
                itemOption: {
                    finishing: materialAfterManufacturingFinishing,
                    dyeing: materialAfterManufacturingDyeing,
                    printing: materialAfterManufacturingFashion,
                    cw: fabricCw,
                    weight: fabricWeight,
                    weightUom: fabricWeightUom,
                },
                itemSizeOption: {
                    size: subsidiarySize,
                    sizeUom: subsidiarySizeUom,
                },
            }));
            setUnitPrice(unitPrice);
            setUom(mclMaterialUom);
            setColor((color) => ({
                ...color,
                type: colorDependency.type,
                ids: colorDependency.infos.map((v) => v.id),
            }));
            setSize((color) => ({
                ...color,
                type: sizeDependency.type,
                ids: sizeDependency.infos.map((v) => v.id),
            }));
            setMarket((color) => ({
                ...color,
                type: marketDependency.type,
                ids: marketDependency.infos.map((v) => v.id),
            }));

            setStatus(status === 'OPEN' ? true : false);

            form.setFieldsValue({
                usagePlace: usagePlace,
                netYy: netYy,
                tolerance: tolerance,
                mclMaterialUomId: mclMaterialUom ? mclMaterialUom.name3 : null, // id
                itemColor: fabricColorName,
                actualColor: commonActualColor ? commonActualColor.name1 : null, // id
                sizeMemo: sizeMemo,
            });
        }
    }, [
        mclPlanningGetId,
        form,
        setNetYy,
        setLoss,
        setOption,
        setUnitPrice,
        setUom,
        handleNotification,
    ]);

    useEffect(() => {
        if ((type === 'fabric', mclPlanningGetId.data && uom)) {
            // const { unitPrice } = mclPlanningGetId.data?.data;

            setUnitPrice(
                parseFloat(
                    handleCalculationResult(
                        option?.unitPrice,
                        option?.uom?.name3,
                        'yard',
                        {
                            cw: option?.itemOption?.fabricCw,
                            weight: option?.itemOption?.fabricWeight,
                        }
                    )
                ).toFixed(2)
            );
        }
    }, [type, mclPlanningGetId.data, uom, option, setUnitPrice]);

    // 수정
    useEffect(() => {
        if (mclPlanningPutId.error) {
            return handleNotification({
                type: 'error',
                message: 'Error',
                description: mclPlanningPutId.error.message,
            });
        } else if (mclPlanningPutId.data) {
            handleMclPlanningGetLists(mclOptionId);
            if (!visible.status) {
                // onShow(initialShow);
                // onLeftSplit();
                return handleNotification({
                    type: 'success',
                    message: 'Success',
                    description:
                        'Successfully modifying MCL material information',
                });
            }
        }
        return () => handleMclPlanningPutIdInit();
    }, [
        mclPlanningPutId,
        visible,
        mclOptionId,
        initialShow,
        onShow,
        onLeftSplit,
        handleMclPlanningPutIdInit,
        handleNotification,
        handleMclPlanningGetLists,
    ]);

    // 수정 status
    useEffect(() => {
        if (mclPlanningPutStatus.error) {
            setStatus(true);
            return handleNotification({
                type: 'error',
                message: 'Error',
                description: mclPlanningPutStatus.error.message,
            });
        } else if (mclPlanningPutStatus.data) {
            handleMclPlanningGetLists(mclOptionId);
            return handleNotification({
                type: 'success',
                message: 'Success',
                description: 'MCL Material status modification successful',
            });
        }
        // return () => handleMclPlanningPutStatusInit();
    }, [
        mclPlanningPutStatus,
        mclOptionId,
        handleMclPlanningGetLists,
        // handleMclPlanningPutStatusInit,
        handleNotification,
        setStatus,
    ]);

    useEffect(() => {
        return () => handleMclPlanningPutStatusInit();
    }, [handleMclPlanningPutStatusInit]);

    // 삭제
    useEffect(() => {
        if (mclPlanningDelete.error) {
            return handleNotification({
                type: 'error',
                message: 'Error',
                description: mclPlanningDelete.error.message,
            });
        } else if (mclPlanningDelete.data) {
            handleMclPlanningGetLists(mclOptionId);
            onShow(initialShow);
            onLeftSplit();
            return handleNotification({
                type: 'success',
                message: 'Success',
                description: 'Successful deletion of MCL material information',
            });
        }

        return () => handleMclPlanningDeleteInit();
    }, [
        mclPlanningDelete,
        type,
        mclOptionId,
        id,
        onShow,
        initialShow,
        onLeftSplit,
        handleMclPlanningGetLists,
        handleMclPlanningGetId,
        handleNotification,
        handleMclPlanningDeleteInit,
    ]);

    // Mcl Material Copy
    useEffect(() => {
        if (mclPlanningPostCopy.error) {
            return handleNotification({
                type: 'error',
                message: 'Error',
                description: mclPlanningPostCopy.error.message,
            });
        } else if (mclPlanningPostCopy.data) {
            handleMclPlanningGetLists(mclOptionId);
            return handleNotification({
                type: 'success',
                message: 'Success',
                description: 'Successful copying of MCL material information',
            });
        }

        return () => handleMclPlanningPostCopyInit();
    }, [
        mclOptionId,
        mclPlanningPostCopy,
        handleNotification,
        handleMclPlanningPostCopyInit,
        handleMclPlanningGetLists,
    ]);

    // Gtag
    useEffect(() => {
        trackPageView({
            page_title: `${type?.toUpperCase()} | PLANNING MATERIAL DETAIL | MCL OPTION DETAIL | DESIGN COVER | PLM  `,
        });
    }, [type, trackPageView]);

    return (
        <MclMaterialDetailOutterWrap>
            <Drawer
                // title={visible.type}
                width="700px"
                placement="right"
                closable={false}
                onClose={() =>
                    setVisible({
                        status: false,
                    })
                }
                visible={visible.status}
            >
                {visible.id && (
                    <MaterialOption
                        {...props}
                        visible={visible}
                        onVisible={setVisible}
                        mclPlanningGetId={mclPlanningGetId}
                        onOption={setOption}
                    />
                )}
            </Drawer>

            <div id="MclMaterialDetailWrap">
                <div className="titleWrap">
                    <div className="title">
                        <Space>
                            <PushpinOutlined />
                            ITEM DETAIL INFORMATION
                        </Space>
                    </div>
                    <div className="functionWrap">
                        <Space>
                            <TableButton
                                toolTip={{
                                    placement: 'topLeft',
                                    title: 'Copy Item',
                                    arrowPointAtCenter: true,
                                }}
                                mode="copy"
                                size="small"
                                onClick={handleMaterialCopy}
                            />

                            <TableButton
                                toolTip={{
                                    placement: 'topLeft',
                                    title: 'Save Item',
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
                                    return onShow(initialShow);
                                }}
                            />

                            <TableButton
                                toolTip={{
                                    placement: 'topLeft',
                                    title: 'Delete Item',
                                    arrowPointAtCenter: true,
                                }}
                                mode="delete"
                                size="small"
                                onClick={() =>
                                    confirm.deleteConfirm(() => handleDelete())
                                }
                            />
                        </Space>
                    </div>
                </div>
                <div className="contentsWrap">
                    <div className="content">
                        <Form
                            {...layout}
                            form={form}
                            onFinish={handleSubmit}
                            validateMessages={handleValidateMessage}
                            initialValues={{
                                netYy: 0,
                                tolerance: 0,
                                unitPrice: 0,
                            }}
                        >
                            <Form.Item label="Status">
                                <Switch
                                    checked={status}
                                    onChange={(isChecked) =>
                                        handleChangeStatus(isChecked)
                                    }
                                    size="small"
                                />
                            </Form.Item>
                            <Form.Item name="usagePlace" label="Usage">
                                <Input
                                    placeholder="Insert Usage name"
                                    disabled={isDisabled}
                                    bordered={false}
                                />
                            </Form.Item>
                            <Form.Item name="netYy" label="Net yy">
                                <InputNumber
                                    placeholder="Insert Net yy"
                                    type="number"
                                    onChange={(e) => {
                                        const value = e
                                            ? parseFloat(e).toFixed(3)
                                            : 0;
                                        form.setFieldsValue({
                                            netYy: value,
                                        });

                                        setNetYy(value);
                                    }}
                                    formatter={(value) =>
                                        value.replace(
                                            /\B(?=(\d{3})+(?!\d))/g,
                                            ','
                                        )
                                    }
                                    parser={(value) =>
                                        value.replace(/\$\s?|(,*)/g, '')
                                    }
                                    step="0.001"
                                    disabled={isDisabled}
                                    style={{ width: '100%' }}
                                    bordered={false}
                                />
                            </Form.Item>
                            <Form.Item name="tolerance" label="Loss">
                                <InputNumber
                                    type="number"
                                    placeholder="Insert Loss"
                                    onChange={(e) => {
                                        const value = e
                                            ? parseFloat(e)?.toFixed(2)
                                            : 0;
                                        form.setFieldsValue({
                                            tolerance: value,
                                        });

                                        setLoss(value);
                                    }}
                                    formatter={(value) =>
                                        value.replace(
                                            /\B(?=(\d{3})+(?!\d))/g,
                                            ','
                                        )
                                    }
                                    parser={(value) =>
                                        value.replace(/\$\s?|(,*)/g, '')
                                    }
                                    disabled={isDisabled}
                                    style={{ width: '100%' }}
                                    bordered={false}
                                />
                            </Form.Item>
                            <Form.Item name="grossYy" label="Gross yy">
                                <div
                                    className="fakeInput"
                                    data-disabled={isDisabled}
                                >
                                    {parseFloat(
                                        formatNumberUtil(grossYy)
                                    ).toFixed(3)}
                                </div>
                            </Form.Item>
                            <Form.Item
                                name="mclMaterialUomId"
                                label="UOM (Vendor)"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <Select
                                    _key="id"
                                    _value="id"
                                    _text="name3"
                                    onFilter={(v) =>
                                        type === 'fabric'
                                            ? v.name2 === 'length' &&
                                              v.name3 === 'yard'
                                            : v.name2 === 'counting' ||
                                              v.name2 === 'length' ||
                                              v.name2 === 'mass'
                                    }
                                    requestKey="materialOfferdPriceRegistrationUom"
                                    onRequestApi={() =>
                                        commonBasicGetListsApi('uom')
                                    }
                                    bordered={false}
                                />
                            </Form.Item>
                            <Form.Item label="Unit Price">
                                <InputNumber
                                    value={unitPrice}
                                    placeholder="Insert Unit price"
                                    onChange={(e) => {
                                        const value = e
                                            ? parseFloat(e).toFixed(
                                                  type === 'fabric' ? 2 : 5
                                              )
                                            : 0;

                                        setUnitPrice(value);
                                    }}
                                    formatter={(value) =>
                                        value.replace(
                                            /\B(?=(\d{3})+(?!\d))/g,
                                            ','
                                        )
                                    }
                                    parser={(value) =>
                                        value.replace(/\$\s?|(,*)/g, '')
                                    }
                                    disabled={isDisabled}
                                    style={{ width: '100%' }}
                                    bordered={false}
                                />
                            </Form.Item>
                            <Form.Item name="amount" label="Amount">
                                <div
                                    className="fakeInput"
                                    data-disabled={isDisabled}
                                >
                                    {formatNumberUtil(
                                        (grossYy * unitPrice)?.toFixed(
                                            type === 'fabric' ? 2 : 5
                                        )
                                    )}
                                </div>
                            </Form.Item>
                            <Form.Item name="itemColor" label="Item Color">
                                <Input
                                    placeholder="Insert Item Color"
                                    disabled={isDisabled}
                                    bordered={false}
                                />
                            </Form.Item>
                            {type === 'fabric' ? (
                                <Form.Item
                                    name="actualColor"
                                    label="Actual Color"
                                >
                                    {FilterSelect({
                                        _key: 'id',
                                        value: 'id',
                                        text: 'name1',
                                        placeholder: 'Select Color',
                                        disabled: isDisabled,
                                        data: commonBasicGetLists,
                                        onData: () =>
                                            handleCommonBasicGetLists(
                                                'actual_color'
                                            ),
                                    })}
                                </Form.Item>
                            ) : (
                                <>
                                    {/* <Form.Item label="Item Size">
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'flex-end',
                                            }}
                                        >
                                            <TableButton
                                                toolTip={{
                                                    placement: 'topLeft',
                                                    title: 'Size Modify',
                                                    arrowPointAtCenter: true,
                                                }}
                                                size="small"
                                                // title="Modify"
                                                disabled={isDisabled}
                                                onClick={() =>
                                                    setVisible({
                                                        id: mclPlanningGetId
                                                            .data?.data
                                                            .materialInfo.id,
                                                        type: type,
                                                        status: true,
                                                    })
                                                }
                                                mode="modify"
                                            />
                                            <div className="textValue">
                                                {option?.itemSizeOption?.size ||
                                                    '-'}{' '}
                                                {option?.itemSizeOption?.size &&
                                                    option?.itemSizeOption
                                                        ?.sizeUom?.name3}
                                            </div>
                                        </div>
                                    </Form.Item> */}
                                </>
                            )}

                            <Form.Item
                                name="fabricType"
                                label={
                                    type === 'fabric'
                                        ? 'Fabric Type'
                                        : 'Category'
                                }
                            >
                                <div className="textValue">
                                    {mclPlanningGetId.data?.data?.materialInfo
                                        ?.category?.typeC
                                        ? `${mclPlanningGetId.data?.data?.materialInfo?.category?.typeC} / ${mclPlanningGetId.data?.data?.materialInfo?.category?.typeB}`
                                        : mclPlanningGetId.data?.data
                                              ?.materialInfo?.category?.typeB}
                                </div>
                            </Form.Item>

                            <Form.Item name="supplier" label="Supplier">
                                <div className="textValue">
                                    {mclPlanningGetId.data?.data?.materialInfo
                                        ?.supplier?.name || '-'}
                                </div>
                            </Form.Item>
                            {type === 'fabric' ? (
                                <>
                                    <Form.Item
                                        name="fabricContents"
                                        label="Contents"
                                    >
                                        <div className="textValue">
                                            {mclPlanningGetId.data?.data.materialInfo.fabricContents?.map(
                                                (v) =>
                                                    `${v.rate}% ${v.contents.name} `
                                            ) || '-'}
                                        </div>
                                    </Form.Item>
                                    <Form.Item
                                        name="fabricConstruction"
                                        label="Construction"
                                    >
                                        <div className="textValue">
                                            {mclPlanningGetId.data?.data
                                                ?.materialInfo
                                                ?.constructionType || '-'}{' '}
                                            {mclPlanningGetId.data?.data
                                                ?.materialInfo
                                                ?.constructionEpi || '-'}{' '}
                                            {mclPlanningGetId.data?.data
                                                ?.materialInfo
                                                ?.constructionPpi || '-'}{' '}
                                            {mclPlanningGetId.data?.data
                                                ?.materialInfo?.yarnSizeWrap ||
                                                '-'}{' '}
                                            {mclPlanningGetId.data?.data
                                                ?.materialInfo?.yarnSizeWeft ||
                                                '-'}{' '}
                                            {mclPlanningGetId.data?.data
                                                ?.materialInfo?.shrinkagePlus >
                                                0 && '+'}
                                            {mclPlanningGetId.data?.data
                                                ?.materialInfo?.shrinkagePlus ||
                                                '-'}{' '}
                                            {mclPlanningGetId.data?.data
                                                ?.materialInfo?.shrinkageMinus >
                                                0 && '-'}
                                            {mclPlanningGetId.data?.data
                                                ?.materialInfo
                                                ?.shrinkageMinus || '-'}{' '}
                                        </div>
                                    </Form.Item>
                                </>
                            ) : (
                                <>
                                    <Form.Item
                                        name="subsidiaryDetail"
                                        label="Item Detail"
                                    >
                                        <div className="textValue">
                                            {mclPlanningGetId.data?.data
                                                ?.subsidiaryDetail || '-'}
                                        </div>
                                    </Form.Item>
                                    <Form.Item
                                        name="sizeMemo"
                                        label="Size Description"
                                    >
                                        <Input
                                            placeholder="Insert Size description"
                                            bordered={false}
                                        />
                                    </Form.Item>
                                </>
                            )}

                            <Form.Item
                                name="supplierMaterial"
                                label="Mill Article#"
                            >
                                <div className="textValue">
                                    {mclPlanningGetId.data?.data
                                        ?.supplierMaterial || '-'}
                                </div>
                            </Form.Item>
                            {type === 'fabric' && (
                                <Fragment>
                                    <Form.Item label="Usage Type">
                                        <div className="textValue">
                                            {mclPlanningGetId.data?.data
                                                ?.materialInfo?.usage_type ||
                                                '-'}
                                        </div>
                                    </Form.Item>

                                    <Form.Item label="Sus/Eco">
                                        <div className="textValue">
                                            {mclPlanningGetId.data?.data
                                                ?.materialInfo?.sus_eco || '-'}
                                        </div>
                                    </Form.Item>

                                    <Form.Item label="Application">
                                        <div className="textValue">
                                            {mclPlanningGetId.data?.data
                                                ?.materialInfo?.application ||
                                                '-'}
                                        </div>
                                    </Form.Item>
                                </Fragment>
                            )}

                            {type !== 'accessories' && (
                                <Form.Item name="materialOption" label="Option">
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'flex-end',
                                        }}
                                    >
                                        <TableButton
                                            toolTip={{
                                                placement: 'topLeft',
                                                title: 'Option Modify',
                                                arrowPointAtCenter: true,
                                            }}
                                            size="small"
                                            disabled={isDisabled}
                                            onClick={() =>
                                                setVisible({
                                                    id:
                                                        mclPlanningGetId.data &&
                                                        mclPlanningGetId.data
                                                            .data.materialInfo
                                                            .id,
                                                    type: type,
                                                    status: true,
                                                })
                                            }
                                            mode="modify"
                                        />

                                        <div className="textValue">
                                            {option?.itemOption?.finishing ||
                                                '-'}{' '}
                                            {type === 'fabric' &&
                                                (option?.itemOption?.dyeing ||
                                                    '-')}{' '}
                                            {type === 'fabric' &&
                                                (option?.itemOption?.printing ||
                                                    '-')}{' '}
                                            {option?.itemOption?.cw || '-'}
                                            {option?.itemOption?.cw &&
                                                'inch'}{' '}
                                            {option?.itemOption?.weight || '-'}
                                            {(option?.itemOption?.weight &&
                                                option?.itemOption?.weightUom
                                                    ?.name3) ||
                                                'GSM'}
                                        </div>
                                    </div>
                                </Form.Item>
                            )}
                        </Form>
                        <div id="dependencyWrap">
                            <Tabs defaultActiveKey="color">
                                <TabPane tab="COLOR" key="color">
                                    {handleDependency(
                                        color,
                                        setColor,
                                        mclGarmentColorGetLists.data?.list,
                                        'garmentColor',
                                        isDisabled
                                    )}
                                </TabPane>
                                {type !== 'fabric' && (
                                    <>
                                        <TabPane tab="SIZE" key="size">
                                            {handleDependency(
                                                size,
                                                setSize,
                                                mclGarmentSizeGetLists.data
                                                    ?.list,
                                                'garmentSize',
                                                isDisabled
                                            )}
                                        </TabPane>
                                        <TabPane tab="MARKET" key="market">
                                            {handleDependency(
                                                market,
                                                setMarket,
                                                mclGarmentMarketGetLists?.data
                                                    ?.list,
                                                'garmentMarket',
                                                isDisabled
                                            )}
                                        </TabPane>
                                    </>
                                )}
                            </Tabs>
                        </div>
                    </div>
                </div>
            </div>
        </MclMaterialDetailOutterWrap>
    );
};

const MclMaterialDetailOutterWrap = styled.div`
    height: 100%;
    padding: 1rem;
    overflow: auto;

    #MclMaterialDetailWrap {
        min-width: 500px;
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
                ${(props) => props.theme.fonts.h6};
            }
        }
        .ant-form-item-control-input-content {
            height: 100%;
        }

        .contentsWrap {
            .content {
                .fakeInput {
                    height: 100%;
                    padding: 4px 11px;
                    background-color: #fff;
                    border-bottom: 1px solid lightgray;
                    // border: 1px solid #d9d9d9;
                    // border-radius: 2px;
                    ${(props) => props.theme.fonts.h5};
                    &[data-disabled='true'] {
                        color: rgba(0, 0, 0, 0.25);
                        cursor: no-drop;
                    }
                }

                .textValue {
                    height: 100%;
                    padding: 4px 11px;
                }

                .ant-form-item-label {
                    label {
                        color: #7f7f7f;
                        ${(props) => props.theme.fonts.h5};
                    }
                }
                #dependencyWrap {
                    .ant-tabs-content-holder span {
                        ${(props) => props.theme.fonts.h5};
                    }
                }
            }
        }

        .ant-select-selector {
            background-color: white;
        }

        .ant-form-item-control-input-content input {
            background-color: white;
        }

        .ant-select-selection-placeholder {
            ${(props) => props.theme.fonts.h5};
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

const OptionWrap = styled.div`
    height: 100%;
    padding: 1rem;
    overflow: auto;
    min-width: 500px;

    border: 1px solid lightgray;
    border-radius: 3px;
    box-shadow: 3px 3px gray;
    .titleWrap {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        .title {
            ${(props) => props.theme.fonts.h6};
        }
    }
`;

export default React.memo(MclMaterialDetail);
