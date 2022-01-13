import React, {
    useState,
    useCallback,
    useRef,
    useContext,
    useEffect,
    Fragment,
    useMemo,
} from 'react';
import { Route } from 'react-router-dom';
import { useMutation, useQuery } from 'react-query';
import { handleKeyMap } from 'core/utils/keyMapUtil';
import { handleNotification } from 'core/utils/notificationUtil';
import { DrawerContext } from 'components/context/drawerContext';
import { ModalContext } from 'components/context/modalContext';
import {
    materialInfoDeleteApi,
    materialInfoGetExcelTemplateApi,
    materialInfoGetPagesApi,
    materialInfoPostApi,
    materialInfoPostExcelUploadApi,
    materialInfoPutApi,
} from 'core/api/material/info';
import { MaterialCreate, MaterialList } from 'components/templates';
import MaterialDetailPage from './MaterialDetailPage';
import { Form as AntForm } from 'antd';
import { MaterialExcelUpload, MaterialYarn } from 'components/UI/organisms';
import Loading from 'components/UI/atoms/Loading';

const MaterialPage = (props) => {
    const { match, history } = props;
    const { drawer, openDrawer, closeDrawer } = useContext(DrawerContext);
    const { modal, openModal, closeModal } = useContext(ModalContext);
    const [type, setType] = useState('fabric');

    // List
    const materialListTable = useRef();
    const materialListRowKey = 'id';
    const [materialListDataSource, setMaterialListDataSource] = useState(null);
    const [materialListPagination, setMaterialListPagination] = useState({
        current: 1,
        pageSize: 15,
        searchKeyword: '',
        total: 0,
        type: null,
    });

    // Info
    const [materialInfoForm] = AntForm.useForm();

    // Yarn
    const materialYarnTable = useRef();
    const materialYarnRowKey = 'id';
    const [materialYarnDataSource, setMaterialYarnDataSource] = useState(null);

    // Excel Upload
    const materialExcelUploadRowKey = 'index';
    const [materialExcelUploadDataSource, setMaterialExcelUploadDataSource] =
        useState(null);
    const [materialType, setMaterialType] = useState('fabric');

    // Info Fetch
    const materialInfoGetPages = useQuery(
        ['materialInfoGetPages', materialListPagination],
        () => materialInfoGetPagesApi(materialListPagination),
        {
            onSuccess: (res) => {
                const { content, totalElements, number, size } = res?.page;
                setMaterialListDataSource(content);
                setMaterialListPagination((materialListPagination) => ({
                    ...materialListPagination,
                    current: number,
                    pageSize: size,
                    total: totalElements,
                }));
            },
            cacheTime: 0,
            keepPreviousData: true,
        }
    );

    const materialInfoPost = useMutation(
        (payload) => materialInfoPostApi(payload),
        {
            onSuccess: (res) => {
                handleNotification({
                    type: 'success',
                    message: 'Success',
                    description: 'Material creation success',
                });
                history.replace(`${match?.url}/detail/${type}/${res?.data}`);
            },
        }
    );

    const materialInfoPut = useMutation(
        (payload) => materialInfoPutApi(payload),
        {
            onSuccess: () =>
                handleNotification({
                    type: 'success',
                    message: 'Success',
                    description: 'Material modification successful',
                }),
        }
    );

    const materialInfoDelete = useMutation(
        (payload) => materialInfoDeleteApi(payload),
        {
            onSuccess: () => {
                handleNotification({
                    type: 'success',
                    message: 'Success',
                    description: 'Material deletion successful',
                });
                return materialInfoGetPages?.refetch();
            },
        }
    );

    // Excel Upload Fetch
    const uploadProps = useMemo(
        () => ({
            name: 'file',
            multiple: false,
            action: `${process.env.REACT_APP_BASE_URL}/v1/material/excel/upload/${materialType}`,
            headers: {
                'X-AUTH-TOKEN': localStorage.getItem('authToken'),
                'X-Requested-With': null,
            },
            onChange(info) {
                const { status } = info.file;
                if (status === 'uploading') {
                    setMaterialExcelUploadDataSource(
                        (materialExcelUploadDataSource) => ({
                            ...materialExcelUploadDataSource,
                            isLoading: true,
                        })
                    );
                }
                if (status === 'done') {
                    setMaterialExcelUploadDataSource({
                        isLoading: false,
                        errorList: info?.file?.response?.data?.errorList?.map(
                            (v, i) => ({
                                ...v,
                                index: i + 1,
                            })
                        ),
                        excelList: info?.file?.response?.data?.excelList?.map(
                            (v, i) => ({
                                ...v,
                                index: i + 1,
                            })
                        ),
                        fileName: info?.file?.response?.data?.fileName,
                    });
                } else if (status === 'error') {
                    setMaterialExcelUploadDataSource(() => ({
                        isLoading: false,
                        errorList: [],
                        excelList: [],
                        fileName: null,
                    }));
                }
            },
            onDrop(e) {
                console.log('Dropped files', e.dataTransfer.files);
            },
        }),
        [materialType, setMaterialExcelUploadDataSource]
    );

    const materialInfoPostExcelUpload = useMutation(
        (payload) => materialInfoPostExcelUploadApi(payload),
        {
            onSuccess: (res) => {
                handleNotification({
                    type: 'success',
                    message: 'Success',
                    description: 'Material excel upload success',
                });
                closeModal();
                return materialInfoGetPages?.refetch();
            },
            onError: () => {
                handleNotification({
                    type: 'error',
                    message: 'Error',
                    description: 'Material excel upload failed',
                });
            },
        }
    );

    const { mutate: handleMaterialInfoGetExcelTemplate } = useMutation(
        (payload) => materialInfoGetExcelTemplateApi(payload),
        {
            onSuccess: (res, req) => {
                const blob = new Blob([res], {
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                });
                const blobURL = window.URL.createObjectURL(blob);
                const tempLink = document.createElement('a');
                tempLink.style.display = 'none';
                tempLink.href = blobURL;
                tempLink.setAttribute('download', `${req}.xlsx`);
                document.body.appendChild(tempLink);
                tempLink.click();
                document.body.removeChild(tempLink);
                window.URL.revokeObjectURL(blobURL);
            },
        }
    );

    // Detail Info Function
    const handleMaterialInfoSubmit = useCallback(
        (values) => {
            const keyMap = {
                category: 'categoryId',
                fabricContents: 'materialYarnRequestList',
                supplier: 'supplierId',
            };

            let _values = handleKeyMap(values, keyMap);

            _values['materialYarnRequestList'] = materialYarnDataSource?.map(
                (v) => ({
                    contentsId: v?.contents?.id,
                    rate: v?.rate,
                })
            );

            if (_values['id']) {
                materialInfoPut.mutate({
                    id: _values['id'],
                    data: _values,
                });
            } else {
                _values['type'] = type;
                materialInfoPost.mutate(_values);
            }
        },
        [type, materialYarnDataSource, materialInfoPost, materialInfoPut]
    );

    var handleMaterialInfoExcute = useCallback(
        (type) => {
            const { selectedRowKeys } = materialListTable?.current || {};
            if (selectedRowKeys.length === 0) {
                return handleNotification({
                    description: 'No item is selected',
                });
            } else if (type === 'delete') {
                materialInfoDelete.mutate(selectedRowKeys);
            }
        },
        [materialListTable, materialInfoDelete]
    );

    // Yarn Function
    const handleMaterialYarnAssign = useCallback(() => {
        const { dataSource } = materialYarnTable?.current || {};

        // 총합이 100
        if (
            dataSource.reduce((acc, cur) => {
                return Number(acc) + Number(cur.rate || 0);
            }, 0) !== 100
        ) {
            return handleNotification({
                description: 'The total rate is not 100.',
            });
        }

        materialInfoForm.setFieldsValue({
            fabricContents: dataSource
                ?.sort((a, b) => {
                    if (a?.rate > b?.rate) {
                        return -1;
                    }
                    if (a?.rate < b?.rate) {
                        return 1;
                    }
                    return 0;
                })
                ?.map((v) => `${v?.contents?.name} ${v?.rate}%`),
        });
        setMaterialYarnDataSource(dataSource);
        closeDrawer('materialYarn');
    }, [
        materialYarnTable,
        materialInfoForm,
        setMaterialYarnDataSource,
        closeDrawer,
    ]);

    const handleMaterialYarnDelete = useCallback(() => {
        const { selectedRowKeys, dataSource } =
            materialYarnTable?.current || {};

        const result = dataSource?.reduce((acc, cur) => {
            if (
                !selectedRowKeys?.find((v2) => v2 === cur[materialYarnRowKey])
            ) {
                acc.push(cur);
            }

            return acc;
        }, []);

        setMaterialYarnDataSource(result);
    }, [materialYarnTable, materialYarnRowKey, setMaterialYarnDataSource]);

    const handleMaterialYarnOpenDrawer = useCallback(
        () =>
            openDrawer(
                'materialYarn',
                <MaterialYarn
                    materialYarnTable={materialYarnTable}
                    materialYarnRowKey={materialYarnRowKey}
                    materialYarnDataSource={materialYarnDataSource}
                    onMaterialYarnAssign={handleMaterialYarnAssign}
                    onExcute={() => handleYarnExcute('yarnDelete')}
                    onMaterialYarnCloseDrawer={() =>
                        closeDrawer('materialYarn')
                    }
                />
            ),
        [
            materialYarnTable,
            materialYarnRowKey,
            materialYarnDataSource,
            handleMaterialYarnAssign,
            openDrawer,
            closeDrawer,
            handleYarnExcute, // eslint-disable-line
        ]
    );

    var handleYarnExcute = useCallback(
        (type) => {
            const { selectedRows } = materialYarnTable?.current || {};
            if (selectedRows?.length === 0) {
                return handleNotification({
                    description: 'No item is selected',
                });
            } else if (type === 'yarnDelete') {
                return handleMaterialYarnDelete();
            }
        },
        [materialYarnTable, handleMaterialYarnDelete]
    );

    // Excel Upload Function
    const handleMaterialExcelUploadModal = useCallback(() => {
        return openModal(
            'FILE UPLOAD',
            <MaterialExcelUpload.FileUpload
                materialExcelUploadRowKey={materialExcelUploadRowKey}
                materialExcelUploadDataSource={materialExcelUploadDataSource}
                materialType={materialType}
                onMaterialType={setMaterialType}
                uploadProps={uploadProps}
            />,
            handleMaterialExcelUploadSubmit
        );
    }, [
        materialExcelUploadRowKey,
        materialExcelUploadDataSource,
        materialType,
        setMaterialType,
        uploadProps,
        openModal,
        handleMaterialExcelUploadSubmit, // eslint-disable-line
    ]);

    var handleMaterialExcelUploadSubmit = useCallback(() => {
        if (materialInfoPostExcelUpload?.isLoading) return;
        return materialInfoPostExcelUpload.mutate({
            type: materialType,
            data: { fileName: materialExcelUploadDataSource.fileName },
        });
    }, [
        materialType,
        materialExcelUploadDataSource,
        materialInfoPostExcelUpload,
    ]);

    // Error handler
    useEffect(() => {
        if (materialInfoPut?.error) {
            handleNotification({
                description: materialInfoPut?.error?.response?.data?.message,
            });
            materialInfoPut.reset();
        } else if (materialInfoPost?.error) {
            handleNotification({
                description: materialInfoPost?.error?.response?.data?.message,
            });
            materialInfoPost.reset();
        } else if (materialInfoDelete?.error) {
            handleNotification({
                description: materialInfoDelete?.error?.response?.data?.message,
            });
            materialInfoDelete.reset();
        }
    }, [materialInfoPut, materialInfoPost, materialInfoDelete]);

    // Re-rendering
    useEffect(() => {
        if (drawer?.name === 'materialYarn' && drawer?.status) {
            openDrawer(
                'materialYarn',
                <MaterialYarn
                    materialYarnTable={materialYarnTable}
                    materialYarnRowKey={materialYarnRowKey}
                    materialYarnDataSource={materialYarnDataSource}
                    onMaterialYarnAssign={handleMaterialYarnAssign}
                    onExcute={() => handleYarnExcute('yarnDelete')}
                    onMaterialYarnCloseDrawer={() =>
                        closeDrawer('materialYarn')
                    }
                />
            );
        }
    }, [
        materialYarnTable,
        materialYarnRowKey,
        materialYarnDataSource,
        openDrawer,
        closeDrawer,
        handleMaterialYarnAssign,
        handleYarnExcute,
    ]);

    useEffect(() => {
        if (modal) {
            openModal(
                'FILE UPLOAD',
                <MaterialExcelUpload.FileUpload
                    materialExcelUploadRowKey={materialExcelUploadRowKey}
                    materialExcelUploadDataSource={
                        materialExcelUploadDataSource
                    }
                    materialType={materialType}
                    onMaterialType={setMaterialType}
                    uploadProps={uploadProps}
                />,
                () => handleMaterialExcelUploadSubmit()
            );
        }
    }, [
        materialExcelUploadRowKey,
        materialExcelUploadDataSource,
        materialType,
        uploadProps,
        modal,
        openModal,
        // handleMaterialExcelUploadSubmit, // 무한 렌더링으로 인해 임시 주석
    ]);

    return (
        <Fragment>
            {materialInfoPost?.isLoading ||
                materialInfoPost?.isLoading ||
                (materialInfoDelete?.isLoading && <Loading />)}
            <Route exact path={match.path}>
                <MaterialList
                    {...props}
                    materialListTable={materialListTable}
                    materialListRowKey={materialListRowKey}
                    materialListDataSource={materialListDataSource}
                    materialListPagination={materialListPagination}
                    materialListIsLoading={materialInfoGetPages?.isLoading}
                    onMaterialListPagination={setMaterialListPagination}
                    onMaterialListClickRow={useCallback(
                        (type, id) =>
                            history.push(`${match?.url}/detail/${type}/${id}`),
                        [history, match]
                    )}
                    onMaterialListClickCreate={useCallback(
                        () => history.push(`${match?.url}/create`),
                        [history, match]
                    )}
                    onMaterialListDelete={() =>
                        handleMaterialInfoExcute('delete')
                    }
                    materialType={materialType}
                    onMaterialExcelUploadModal={handleMaterialExcelUploadModal}
                    onMaterialInfoGetExcelTemplate={
                        handleMaterialInfoGetExcelTemplate
                    }
                />
            </Route>

            <Route path={`${match.path}/create`}>
                <MaterialCreate
                    type={type}
                    onType={setType}
                    materialInfoForm={materialInfoForm}
                    onMaterialInfoSubmit={handleMaterialInfoSubmit}
                    onMaterialYarnOpenDrawer={handleMaterialYarnOpenDrawer}
                />
            </Route>

            <Route path={`${match.path}/detail/:type/:materialId`}>
                <MaterialDetailPage
                    drawer={drawer}
                    openDrawer={openDrawer}
                    closeDrawer={closeDrawer}
                    materialInfoForm={materialInfoForm}
                    onMaterialInfoSubmit={handleMaterialInfoSubmit}
                    materialYarnTable={materialYarnTable}
                    materialYarnRowKey={materialYarnRowKey}
                    materialYarnDataSource={materialYarnDataSource}
                    setMaterialYarnDataSource={setMaterialYarnDataSource}
                    onMaterialYarnOpenDrawer={handleMaterialYarnOpenDrawer}
                />
            </Route>
        </Fragment>
    );
};

export default MaterialPage;
