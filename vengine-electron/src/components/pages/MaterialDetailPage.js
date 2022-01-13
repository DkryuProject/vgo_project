import React, {
    memo,
    useState,
    useCallback,
    useRef,
    useEffect,
    useMemo,
} from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery } from 'react-query';
import { materialInfoGetDetailApi } from 'core/api/material/info';
import { handleNotification } from 'core/utils/notificationUtil';
import { Form as AntForm } from 'antd';
import {
    materialOfferDeleteApi,
    materialOfferGetDetailApi,
    materialOfferGetListApi,
    materialOfferGetOwnApi,
    materialOfferPostApi,
    materialOfferPostAssignApi,
    materialOfferPutApi,
} from 'core/api/material/offer';
import Loading from 'components/UI/atoms/Loading';
import { MaterialOfferedPrice } from 'components/UI/organisms';
import { MaterialDetail } from 'components/templates';
import { Fragment } from 'react';
import MaterialMyOwned from 'components/UI/organisms/MaterialMyOwned';

const MaterialDetailPage = (props) => {
    const {
        drawer,
        openDrawer,
        closeDrawer,
        materialInfoForm,
        onMaterialInfoSubmit,
        materialYarnTable,
        materialYarnRowKey,
        materialYarnDataSource,
        setMaterialYarnDataSource,
        onMaterialYarnOpenDrawer,
    } = props;
    const params = useParams();
    const { type, materialId } = params || {};

    // User
    const userGetEmail = useSelector((state) => state.userReducer.get.email);

    // Detail Offer
    const [offerId, setOfferId] = useState(null);
    const [materialOfferForm] = AntForm.useForm();
    const materialOfferTable = useRef();
    const materialOfferRowKey = 'id';
    const [materialOfferDataSource, setMaterialOfferDataSource] =
        useState(null);
    const [weightInfo, setWeightInfo] = useState({
        weight: 0,
        weightUOM: {},
    });

    // Detail My Owned Item
    const materialOwnTable = useRef();
    const materialOwnRowKey = 'id';
    const [materialOwnDataSource, setMaterialOwnDataSource] = useState(null);

    // Detail Info Fetch
    const materialInfoGetDetail = useQuery(
        ['materialInfoGetDetail', materialId],
        () => materialInfoGetDetailApi(materialId),
        {
            onSuccess: (res) => {
                const { data } = res;
                const {
                    item_name,
                    category,
                    supplier,
                    structure,
                    constructionEpi,
                    constructionPpi,
                    fabricContents,
                    yarnSizeWrap,
                    yarnSizeWeft,
                    shrinkagePlus,
                    shrinkageMinus,
                    item_detail,
                    usage_type,
                    application,
                    sus_eco,
                } = data;
                setMaterialYarnDataSource(fabricContents);

                materialInfoForm.setFieldsValue({
                    type: type,
                    id: materialId,
                    item_name: item_name,
                    category: category?.id,
                    supplier: supplier?.id,
                    structure: structure,
                    constructionEpi: constructionEpi,
                    constructionPpi: constructionPpi,
                    fabricContents: fabricContents?.map(
                        (v) => `${v?.contents?.name} ${v?.rate}%`
                    ),
                    yarnSizeWrap: yarnSizeWrap,
                    yarnSizeWeft: yarnSizeWeft,
                    shrinkagePlus: shrinkagePlus,
                    shrinkageMinus: shrinkageMinus,
                    item_detail: item_detail,
                    usage_type: usage_type,
                    application: application,
                    sus_eco: sus_eco,
                });

                // Offer를 작성 할때 작성자가 Supplier가 아니면 작성자 회사가 나타나야한다
                materialOfferForm.setFieldsValue({
                    recipientId:
                        isDisabled && userGetEmail.data?.data.company.companyID,
                });
            },
            enabled: !!materialId,
            cacheTime: 0,
        }
    );

    const isDisabled = useMemo(() => {
        return (
            materialInfoGetDetail.data?.data.supplier.id !==
            userGetEmail.data?.data.company.companyID
        );
    }, [materialInfoGetDetail.data, userGetEmail.data, offerId]);

    // Detail Offer Fetch
    const materialOfferGetList = useQuery(
        ['materialOfferGetList', materialId],
        () => materialOfferGetListApi(materialId),
        {
            onSuccess: (res) => {
                const { list } = res;

                setMaterialOfferDataSource(list);
            },
            enabled: !!materialId,
            cacheTime: 0,
        }
    );

    const materialOfferPost = useMutation(
        (payload) => materialOfferPostApi(payload),
        {
            onSuccess: async () => {
                handleNotification({
                    type: 'success',
                    message: 'Success',
                    description: 'Material Offered price creation success',
                });
                closeDrawer('materialOfferPrice');
                await materialInfoGetDetail?.refetch();
                return materialOfferGetList?.refetch();
            },
        }
    );

    const materialOfferPostAssign = useMutation(
        (payload) => materialOfferPostAssignApi(payload),
        {
            onSuccess: () => {
                handleNotification({
                    type: 'success',
                    message: 'Success',
                    description: 'Material Owned Item creation success',
                });
                closeDrawer('materialOfferPrice');
                return materialOfferGetOwn?.refetch();
            },
        }
    );

    const materialOfferPut = useMutation(
        (payload) => materialOfferPutApi(payload),
        {
            onSuccess: async () => {
                handleNotification({
                    type: 'success',
                    message: 'Success',
                    description:
                        'Material Offered price modification successful',
                });
                closeDrawer('materialOfferPrice');
                await materialOfferGetOwn?.refetch();
                return materialOfferGetList?.refetch();
            },
        }
    );

    const materialOfferDelete = useMutation(
        (payload) => materialOfferDeleteApi(payload),
        {
            onSuccess: async () => {
                handleNotification({
                    type: 'success',
                    message: 'Success',
                    description: 'Material Offered price deletion successful',
                });
                closeDrawer('materialOfferPrice');
                await materialInfoGetDetail?.refetch();
                return materialOfferGetList?.refetch();
            },
        }
    );

    const materialOfferGetDetail = useQuery(
        ['materialOfferGetDetail', offerId],
        () => materialOfferGetDetailApi(offerId),
        {
            onSuccess: async (res) => {
                const { data } = res;
                const {
                    currency,
                    itemOption,
                    materialNo,
                    mcq,
                    moq,
                    recipient,
                    itemSizeOption,
                    unitPrice,
                    uom,
                    characteristic,
                    solid_pattern,
                    function: _function,
                    performance,
                    stretch,
                    lead_time,
                    fabricFullWidth,
                    fullWidthUom,
                    season,
                    season_year,
                } = data;

                const {
                    cw,
                    cwUom,
                    weight,
                    weightUom,
                    dyeing,
                    finishing,
                    printing,
                } = itemOption || {};
                const { size, sizeUom } = itemSizeOption || {};

                materialOfferForm.setFieldsValue({
                    // brandId: brand?.id,
                    // buyerId: buyer?.id,
                    currencyId: currency?.id,
                    fabricFullWidth: fabricFullWidth,
                    fullWidthUomId: fullWidthUom?.id,
                    cw: cw,
                    cwUomId: cwUom?.id,
                    dyeing: dyeing,
                    finishing: finishing,
                    materialNo: materialNo,
                    mcq: mcq,
                    moq: moq,
                    printing: printing,
                    recipientId: isDisabled
                        ? userGetEmail.data?.data.company.companyID
                        : recipient?.id || -1,
                    size: size,
                    sizeUomId: sizeUom?.id,
                    seasonID: season?.id,
                    seasonYear: season_year,
                    unitPrice: unitPrice,
                    uomId: uom?.id,
                    weight: weight,
                    weightUomId: weightUom?.id,
                    characteristic: characteristic,
                    solid_pattern: solid_pattern,
                    function: _function,
                    performance: performance,
                    stretch: stretch,
                    lead_time: lead_time,
                });

                setWeightInfo({
                    weight: weight,
                    weightUOM: weightUom,
                });
            },
            enabled: !!offerId,
            cacheTime: 0,
        }
    );

    const isSameWritingCompany =
        materialOfferGetDetail.data?.data?.deputyCompany?.id ===
        userGetEmail.data?.data.company.companyID;

    // Detail Own Fetch
    const materialOfferGetOwn = useQuery(
        ['materialOfferGetOwn', materialId],
        () => materialOfferGetOwnApi(materialId),
        {
            onSuccess: (res) => {
                const { list } = res;
                setMaterialOwnDataSource(list);
            },
            enabled: !!materialId,
            cacheTime: 0,
        }
    );

    // Detail Offer Function
    const handleMaterialOfferSubmit = useCallback(
        (values) => {
            // recipientId ALL 처리
            if (values['recipientId'] < 0) {
                values['recipientId'] = null;
            }

            if (offerId) {
                return materialOfferPut.mutate({
                    id: offerId,
                    data: values,
                });
            } else {
                return materialOfferPost.mutate({
                    id: materialId,
                    data: values,
                });
            }
        },
        [materialId, offerId, materialOfferPut.mutate, materialOfferPost.mutate]
    );

    const handleMaterialOfferMakeMyOwn = useCallback(() => {
        const { selectedRowKeys } = materialOfferTable?.current || {};
        if (selectedRowKeys.length === 0) {
            return handleNotification({
                description: 'No item is selected',
            });
        }

        return materialOfferPostAssign.mutate(selectedRowKeys);
    }, [materialOfferTable, materialOfferPostAssign.mutate]);

    // Detail Own Function
    const handleMaterialOwnSubmit = useCallback(
        (values) => {
            if (offerId) {
                return materialOfferPut.mutate({ id: offerId, data: values });
            }
        },
        [offerId]
    );

    // offer form reset
    useEffect(() => {
        if (!offerId) {
            materialOfferForm.resetFields();
        }
    }, [offerId, materialOfferForm]);

    // Error handler
    useEffect(() => {
        if (materialOfferPost?.error) {
            handleNotification({
                description: materialOfferPost?.error?.response?.data?.message,
            });
            materialOfferPost.reset();
        } else if (materialOfferPut?.error) {
            handleNotification({
                description: materialOfferPut?.error?.response?.data?.message,
            });
            materialOfferPut.reset();
        } else if (materialOfferDelete?.error) {
            handleNotification({
                description:
                    materialOfferDelete?.error?.response?.data?.message,
            });
            materialOfferDelete.reset();
        } else if (materialOfferPostAssign?.error) {
            handleNotification({
                description:
                    materialOfferPostAssign?.error?.response?.data?.message,
            });
            materialOfferPostAssign.reset();
        }
    }, [
        materialOfferPost,
        materialOfferPut,
        materialOfferDelete,
        materialOfferPostAssign,
    ]);

    // const handleInitValue = async (api) => {
    //     try {
    //         const data = await commonBasicGetUomApi('length');
    //         console.log('data: ', data);
    //     } catch (e) {
    //         console.error(e);
    //     }
    //     return 31;
    // };

    // const initialValues = {
    //     recipientId: isDisabled
    //         ? userGetEmail.data?.data.company.companyID
    //         : undefined,
    //     cwUomId: handleInitValue(),
    //     fullWidthUomId: 31,
    //     currencyId: 314,
    //     uomId: type === 'fabric' ? 33 : 54,
    // };

    // Re-rendering
    useEffect(() => {
        if (drawer?.name === 'materialOfferPrice' && drawer?.status) {
            openDrawer(
                'materialOfferPrice',
                <MaterialOfferedPrice
                    isDetail={!!materialOfferGetDetail.data}
                    isDisabled={
                        // !(
                        //     !isDisabled &&
                        //     !(
                        //         materialOfferGetDetail.data?.data?.useYN?.toLowerCase() ===
                        //         'y'
                        //     )
                        // )
                        isDisabled
                    }
                    isUsedInfo={
                        materialOfferGetDetail.data?.data?.useYN?.toLowerCase() ===
                        'y'
                    }
                    isSameWritingCompany={isSameWritingCompany}
                    // initialValues={initialValues}
                    type={type}
                    offerId={offerId}
                    materialOfferForm={materialOfferForm}
                    onMaterialOfferSubmit={handleMaterialOfferSubmit}
                    onMaterialOfferCloseDrawer={() => {
                        setWeightInfo({ weight: 0, weightUOM: {} });
                        return closeDrawer('materialOfferPrice');
                    }}
                    onMaterialOfferDelete={() => {
                        return materialOfferDelete?.mutate([offerId]);
                    }}
                    weightInfo={weightInfo}
                    onWeightInfo={setWeightInfo}
                />
            );
        }
    }, [
        isDisabled,
        isSameWritingCompany,
        offerId,
        materialOfferGetDetail.data,
        drawer.name,
        drawer.status,
        type,
        materialOfferForm,
        handleMaterialOfferSubmit,
        openDrawer,
        closeDrawer,
        weightInfo,
    ]);

    useEffect(() => {
        if (drawer?.name === 'materialMyOwned' && drawer?.status) {
            openDrawer(
                'materialMyOwned',
                <MaterialMyOwned
                    isDisabled={
                        materialOfferGetDetail.data?.data?.useYN?.toLowerCase() ===
                        'y'
                    }
                    type={type}
                    materialOwnForm={materialOfferForm}
                    onMaterialOwnSubmit={handleMaterialOwnSubmit}
                    onMaterialOwnCloseDrawer={() => {
                        setWeightInfo({ weight: 0, weightUOM: {} });
                        return closeDrawer('materialMyOwned');
                    }}
                    onMaterialOwnDelete={() => {
                        return materialOfferDelete?.mutate([offerId]);
                    }}
                    weightInfo={weightInfo}
                    onWeightInfo={setWeightInfo}
                />
            );
        }
    }, [
        isDisabled,
        materialOfferGetDetail.data,
        drawer.name,
        drawer.status,
        type,
        materialOfferForm,
        handleMaterialOwnSubmit,
        openDrawer,
        closeDrawer,
        weightInfo,
        offerId,
    ]);

    return (
        <Fragment>
            {(materialOfferPost?.isLoading ||
                materialOfferPut?.isLoading ||
                materialOfferDelete?.isLoading ||
                materialOfferPostAssign?.isLoading) && <Loading />}
            <MaterialDetail
                isDisabled={isDisabled}
                isUsedInfo={
                    materialInfoGetDetail.data?.data?.useYN?.toLowerCase() ===
                    'y'
                }
                type={type}
                materialId={materialId}
                materialInfoForm={materialInfoForm}
                onMaterialInfoSubmit={onMaterialInfoSubmit}
                materialYarnTable={materialYarnTable}
                materialYarnRowKey={materialYarnRowKey}
                materialYarnDataSource={materialYarnDataSource}
                onMaterialYarnDataSource={setMaterialYarnDataSource}
                onMaterialYarnOpenDrawer={onMaterialYarnOpenDrawer}
                materialOfferForm={materialOfferForm}
                materialOfferTable={materialOfferTable}
                materialOfferRowKey={materialOfferRowKey}
                materialOfferDataSource={materialOfferDataSource}
                onMaterialOfferDataSource={setMaterialOfferDataSource}
                onMaterialOfferOpenDrawer={() => {
                    setOfferId(null);
                    return openDrawer(
                        'materialOfferPrice',
                        <MaterialOfferedPrice
                            // initialValues={
                            //     isDisabled && {
                            //         recipientId:
                            //             userGetEmail.data?.data.company
                            //                 .companyID,
                            //     }
                            // }
                            initialValues={{
                                recipientId: isDisabled
                                    ? userGetEmail.data?.data.company.companyID
                                    : undefined,
                                cwUomId: 31,
                                fullWidthUomId: 31,
                                currencyId: 314,
                                uomId: type === 'fabric' ? 33 : 54,
                            }}
                            type={type}
                            materialOfferForm={materialOfferForm}
                            onMaterialOfferSubmit={handleMaterialOfferSubmit}
                            onMaterialOfferCloseDrawer={() => {
                                setWeightInfo({ weight: 0, weightUOM: {} });
                                return closeDrawer('materialOfferPrice');
                            }}
                            weightInfo={weightInfo}
                            onWeightInfo={setWeightInfo}
                        />
                    );
                }}
                onMaterialOfferClickRow={(id) => {
                    setOfferId(id);
                    openDrawer(
                        'materialOfferPrice',
                        <MaterialOfferedPrice
                            isDetail={!!materialOfferGetDetail.data}
                            isDisabled={
                                // !(
                                //     !isDisabled &&
                                //     !(
                                //         materialOfferGetDetail.data?.data?.useYN?.toLowerCase() ===
                                //         'y'
                                //     )
                                // )
                                isDisabled
                            }
                            isUsedInfo={
                                materialOfferGetDetail.data?.data?.useYN?.toLowerCase() ===
                                'y'
                            }
                            isSameWritingCompany={isSameWritingCompany}
                            type={type}
                            materialOfferForm={materialOfferForm}
                            onMaterialOfferSubmit={handleMaterialOfferSubmit}
                            onMaterialOfferCloseDrawer={() => {
                                setWeightInfo({ weight: 0, weightUOM: {} });
                                return closeDrawer('materialOfferPrice');
                            }}
                            onMaterialOfferDelete={() => {
                                return materialOfferDelete?.mutate([offerId]);
                            }}
                            weightInfo={weightInfo}
                            onWeightInfo={setWeightInfo}
                        />
                    );
                }}
                onMaterialOfferMakeMyOwn={handleMaterialOfferMakeMyOwn}
                materialOwnTable={materialOwnTable}
                materialOwnRowKey={materialOwnRowKey}
                materialOwnDataSource={materialOwnDataSource}
                onMaterialOwnClickRow={(id) => {
                    setOfferId(id);
                    openDrawer(
                        'materialMyOwned',
                        <MaterialMyOwned
                            isDisabled={
                                materialOfferGetDetail.data?.data?.useYN?.toLowerCase() ===
                                'y'
                            }
                            type={type}
                            materialOwnForm={materialOfferForm}
                            onMaterialOwnSubmit={handleMaterialOwnSubmit}
                            onMaterialOwnCloseDrawer={() => {
                                setWeightInfo({ weight: 0, weightUOM: {} });
                                return closeDrawer('materialMyOwned');
                            }}
                            onMaterialOwnDelete={() => {
                                return materialOfferDelete?.mutate([offerId]);
                            }}
                            weightInfo={weightInfo}
                            onWeightInfo={setWeightInfo}
                        />
                    );
                }}
            />
        </Fragment>
    );
};

export default memo(MaterialDetailPage);
