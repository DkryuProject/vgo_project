import React, {
    useState,
    useCallback,
    useEffect,
    useRef,
    useMemo,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useNotification from 'core/hook/useNotification';
import styled from 'styled-components';
import {
    mclGarmentSizePostAsyncAction,
    mclGarmentSizeGetListsAsyncAction,
    mclGarmentSizeDeleteAsyncAction,
} from 'store/mcl/garmentSize/reducer';
import {
    companyGarmentGetSizesAsyncAction,
    companyGarmentGetSizeAsyncAction,
} from 'store/companyInfo/reducer';
import * as confirm from 'components/common/confirm';
import { Tooltip } from 'components/common/tooltip';
import TableButton from 'components/common/table/TableButton';
import CustomTable from 'components/common/CustomTable';
import { Space, Button, Select } from 'antd';
import { CaretRightOutlined, DownloadOutlined } from '@ant-design/icons';

const MclGarmentSize = (props) => {
    const { match, initialShow, show, onShow, onLeftSplit } = props;
    const { mclOptionId } = match.params || '';
    const groupName = useRef(show.garmentSize.groupName || null);
    const rowKey = 'id';
    const editTableRef = useRef();
    const dispatch = useDispatch();
    const [handleNotification] = useNotification();
    const [dataSource, setDataSource] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [sizeGroup, setSizeGroup] = useState(null);
    const [isRender, setIsRender] = useState(false);

    // 사이즈 그룹 조회
    const companyGarmentGetSizes = useSelector(
        (state) => state.companyInfoReducer.get.sizes
    );
    const handleCompanyGarmentGetSizes = useCallback(
        (payload) =>
            dispatch(companyGarmentGetSizesAsyncAction.request(payload)),
        [dispatch]
    );

    // 사이즈 조회
    const companyGarmentGetSize = useSelector(
        (state) => state.companyInfoReducer.get.size
    );
    const handleCompanyGarmentGetSize = useCallback(
        (payload) =>
            dispatch(companyGarmentGetSizeAsyncAction.request(payload)),
        [dispatch]
    );

    const mclGarmentSizeGetLists = useSelector(
        (state) => state.mclGarmentSizeReducer.get.lists
    );
    const handleMclGarmentSizeGetLists = useCallback(
        (payload) =>
            dispatch(mclGarmentSizeGetListsAsyncAction.request(payload)),
        [dispatch]
    );

    const mclGarmentSizePost = useSelector(
        (state) => state.mclGarmentSizeReducer.post
    );
    const handleMclGarmentSizePost = useCallback(
        (payload) => dispatch(mclGarmentSizePostAsyncAction.request(payload)),
        [dispatch]
    );
    const handleMclGarmentSizePostInit = useCallback(
        () => dispatch(mclGarmentSizePostAsyncAction.initial()),
        [dispatch]
    );

    const mclGarmentSizeDelete = useSelector(
        (state) => state.mclGarmentSizeReducer.delete
    );
    const handleMclGarmentSizeDelete = useCallback(
        (payload) => dispatch(mclGarmentSizeDeleteAsyncAction.request(payload)),
        [dispatch]
    );
    const handleMclGarmentSizeDeleteInit = useCallback(
        () => dispatch(mclGarmentSizeDeleteAsyncAction.initial()),
        [dispatch]
    );

    const handleLoad = useCallback(() => {
        // 기존에 등록된 사이즈가 있는데 새로운 아이템 등록을 눌렀을 때
        if (
            !groupName.current &&
            mclGarmentSizeGetLists.data &&
            mclGarmentSizeGetLists.data.list.length > 0
        ) {
            groupName.current =
                mclGarmentSizeGetLists.data.list[0].garmentSize.sizeGroup ||
                null;
        }

        // if (groupName.current && groupName.current !== sizeGroup) {
        //     confirm.warningConfirm(
        //         '등록된 아이템이 초기화 됩니다. 진행 하시겠습니까?',
        //         (e) => {
        //             if (e) {
        //                 const deleteArr =
        //                     mclGarmentSizeGetLists.data &&
        //                     mclGarmentSizeGetLists.data.list.map((v) => {
        //                         return v.id;
        //                     });
        //                 if (deleteArr.length > 0) {
        //                     handleMclGarmentSizeDelete(deleteArr);
        //                 }
        //                 return handleCompanyGarmentGetSize(sizeGroup);
        //             }
        //         }
        //     );
        // } else {
        //     return handleCompanyGarmentGetSize(sizeGroup);
        // }
        return handleCompanyGarmentGetSize(sizeGroup);
    }, [
        groupName,
        sizeGroup,
        mclGarmentSizeGetLists,
        handleCompanyGarmentGetSize,
        // handleMclGarmentSizeDelete,
    ]);

    const handleExcute = useCallback(
        (type) => {
            const {
                selectedRows,
                // , selectedRowKeys
            } = editTableRef.current;

            if (type === 'save') {
                confirm.saveConfirm((e) => {
                    if (e) {
                        if (mclGarmentSizeGetLists.data) {
                            let deleteArr = [];
                            // 선택된 item이 없을 때
                            if (selectedRows.length === 0) {
                                // deleteArr = mclGarmentSizeGetLists.data.list.map(
                                //     (v) => {
                                //         return v.id;
                                //     }
                                // );

                                deleteArr =
                                    mclGarmentSizeGetLists.data.list.reduce(
                                        (acc, cur) => {
                                            if (
                                                companyGarmentGetSize.data?.list.find(
                                                    (v) =>
                                                        v.id ===
                                                        cur.garmentSize.id
                                                )
                                            ) {
                                                acc.push(cur.id);
                                            }

                                            return acc;
                                        },
                                        []
                                    );
                            }
                            // 선택 해제한 아이템 추출
                            // let result = [];
                            // for (let v1 of mclGarmentSizeGetLists.data.list) {
                            //     if (
                            //         !selectedRows.find(
                            //             (v2) => v2.id === v1.garmentSize.id
                            //         )
                            //     ) {
                            //         result.push(v1);
                            //     }
                            // }

                            deleteArr = mclGarmentSizeGetLists.data.list.reduce(
                                (acc, cur) => {
                                    if (
                                        companyGarmentGetSize.data?.list.find(
                                            (v) => v.id === cur.garmentSize.id
                                        ) &&
                                        !selectedRows.find(
                                            (v) => v.id === cur.garmentSize.id
                                        )
                                    ) {
                                        acc.push(cur.id);
                                    }

                                    return acc;
                                },
                                []
                            );

                            // 선택 해제한 아이템을 배열로 변환
                            // deleteArr = result.reduce((acc, cur) => {
                            //     acc.push(cur.id);
                            //     return acc;
                            // }, []);

                            if (deleteArr.length > 0) {
                                handleMclGarmentSizeDelete(deleteArr);
                            }
                        }
                        const newValues = selectedRows.map((v) => {
                            // 조회된 그룹 사이즈의 아이템 id와 현재 등록된 사이즈의 id를 비교하여 현재 등록된 아이템의 id를 추출
                            const currentItem =
                                mclGarmentSizeGetLists.data?.list.find(
                                    (v2) => v2.garmentSize.id === v.id
                                );

                            const obj = {
                                garmentSizeId: v.id,
                                id: currentItem ? currentItem.id : null,
                                // 여기수정
                                poGarmentSize: v.hasOwnProperty('poGarmentSize')
                                    ? Object.keys(v.poGarmentSize).length > 0
                                        ? v.poGarmentSize.id
                                        : v.poGarmentSize
                                    : currentItem?.poGarmentSize || '',
                            };
                            return obj;
                        });

                        return handleMclGarmentSizePost({
                            id: mclOptionId,
                            data: newValues,
                        });
                    }
                });
            }
        },
        [
            mclOptionId,
            mclGarmentSizeGetLists,
            companyGarmentGetSize,
            handleMclGarmentSizePost,
            handleMclGarmentSizeDelete,
        ]
    );

    // 조회
    useEffect(() => {
        setIsLoading(companyGarmentGetSize.isLoading);

        if (companyGarmentGetSize.data) {
            // 데이터에 poGarmentColor 필드가 없다.
            setDataSource(companyGarmentGetSize.data.list);
        }
    }, [companyGarmentGetSize]);

    useEffect(() => {
        handleCompanyGarmentGetSize(groupName.current);
    }, [groupName, handleCompanyGarmentGetSize]);

    // 조회 후 등록된 아이템을 가지고 사이즈 조회한 아이템에 체크
    useEffect(() => {
        if (
            companyGarmentGetSize.data &&
            editTableRef.current &&
            mclGarmentSizeGetLists.data
        ) {
            mclGarmentSizeGetLists.data.list.map((v) => {
                return setTimeout(
                    () =>
                        // 한번 더 검사를 해줘야 에러가 안난다
                        editTableRef.current &&
                        editTableRef.current.handleSelectRows &&
                        editTableRef.current.handleSelectRows({
                            id: v.garmentSize.id,
                            name: v.garmentSize.name,
                            poGarmentSize: v.poGarmentSize,
                        }),
                    100
                );
            });
        }
    }, [companyGarmentGetSize, mclGarmentSizeGetLists, editTableRef, isRender]);

    // 등록
    useEffect(() => {
        if (mclGarmentSizePost.error) {
            return handleNotification({
                type: 'error',
                message: 'Error',
                description: mclGarmentSizePost.error.message,
            });
        } else if (mclGarmentSizePost.data) {
            handleMclGarmentSizeGetLists(mclOptionId);

            onLeftSplit();
            onShow(initialShow);
            return handleNotification({
                type: 'success',
                message: 'Success',
                description: 'Successful creation of MCL Garment Size',
            });
        }
    }, [
        mclGarmentSizePost,
        mclOptionId,
        initialShow,
        handleMclGarmentSizeGetLists,
        handleNotification,
        onShow,
        onLeftSplit,
    ]);

    // 삭제
    useEffect(() => {
        if (mclGarmentSizeDelete.error) {
            return handleNotification({
                type: 'error',
                message: 'Error',
                description: mclGarmentSizeDelete.error.message,
            });
        } else if (mclGarmentSizeDelete.data) {
            handleMclGarmentSizeGetLists(mclOptionId);

            return handleNotification({
                type: 'success',
                message: 'Success',
                description: 'Successful deletion of MCL Garment Size',
            });
        }
    }, [
        mclGarmentSizeDelete,
        mclOptionId,
        handleMclGarmentSizeGetLists,
        handleNotification,
    ]);

    // 초기화
    useEffect(() => {
        return () => {
            handleMclGarmentSizePostInit();
            handleMclGarmentSizeDeleteInit();
        };
    }, [handleMclGarmentSizePostInit, handleMclGarmentSizeDeleteInit]);

    // 테이블
    const columns = useMemo(
        () => [
            {
                title: 'Name',
                dataIndex: 'name',
                editable: true,
                render: (data) => {
                    return (
                        <Tooltip title={data?.name || data}>
                            {data?.name || data}
                        </Tooltip>
                    );
                },
            },
            {
                title: 'BUYER PO SIZE',
                dataIndex: 'poGarmentSize',
                editable: true,
                ellipsis: true,
                selectBox: true,
                selectType: {
                    name: 'mcl',
                    type: 'assignPoSize',
                    path: mclOptionId,
                },
                render: (data, record) => {
                    // garmentSize를 가져와서 id와  companySize의 id를 비교 하여 garmentSize에 있는 poGarmentSize를 보여준다
                    // 수많은 데이터가 리렌더링 및 반복으로 인해 추후 수정요망
                    const _data =
                        mclGarmentSizeGetLists.data &&
                        mclGarmentSizeGetLists.data.list.find(
                            (v) => v.garmentSize.id === record.id
                        );
                    if (data) {
                        return data.hasOwnProperty('name') ? data.name : data;
                    } else if (_data) {
                        return _data.hasOwnProperty('poGarmentSize')
                            ? _data.poGarmentSize
                            : '';
                    } else {
                        return '';
                    }
                },
            },
        ],
        [mclGarmentSizeGetLists, mclOptionId]
    );

    const title = useMemo(
        () => () =>
            (
                <div className="titleWrap">
                    <div className="title">
                        <Space>
                            <CaretRightOutlined />
                            Garment Size Setting
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
                        </Space>
                    </div>
                </div>
            ),
        [handleExcute]
    );

    return (
        <MclGarmentSizeWrap>
            <div id="mclGarmentSizeWrap">
                <div className="titleWrap">
                    <div className="title">
                        <Space>
                            <CaretRightOutlined />
                            GARMENT SIZE SETTING
                        </Space>
                    </div>
                    <div className="functionWrap">
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
                                onShow({
                                    ...initialShow,
                                    garmentSize: {
                                        status: false,
                                    },
                                });
                            }}
                        />
                    </div>
                </div>
                <div className="contentsWrap">
                    <div className="content">
                        <Space>
                            <div className="contentTitle">NAME : </div>
                            <Select
                                placeholder="Select Size group"
                                defaultValue={groupName.current}
                                showSearch
                                onChange={(v) => setSizeGroup(v)}
                                filterOption={(input, option) =>
                                    option.children
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                }
                                onDropdownVisibleChange={(e) => {
                                    if (e) {
                                        handleCompanyGarmentGetSizes();
                                    }
                                }}
                                loading={companyGarmentGetSizes.isLoading}
                                bordered={false}
                            >
                                {companyGarmentGetSizes.data &&
                                    companyGarmentGetSizes.data.list.map(
                                        (v, i) => {
                                            return (
                                                <Select.Option
                                                    key={i}
                                                    value={v}
                                                >
                                                    {v}
                                                </Select.Option>
                                            );
                                        }
                                    )}
                            </Select>

                            <Button
                                onClick={handleLoad}
                                // type="Load"
                                icon={<DownloadOutlined />}
                                size="small"
                            >
                                Load
                            </Button>
                        </Space>
                    </div>

                    <div className="garmentSizeTable">
                        {dataSource.length > 0 && (
                            <CustomTable
                                ref={editTableRef}
                                title={title}
                                rowKey={rowKey}
                                initialColumns={columns}
                                dataSource={dataSource}
                                rowSelection={true}
                                loading={isLoading}
                                pagination={false}
                                onIsRender={setIsRender}
                            />
                        )}
                    </div>
                </div>
            </div>
        </MclGarmentSizeWrap>
    );
};

const MclGarmentSizeWrap = styled.div`
    height: 100%;
    padding: 0.5rem 1rem 0 1rem;
    overflow: auto;

    #mclGarmentSizeWrap {
        min-width: 500px;
        padding: 0.5rem;
        border: 1px solid lightgray;
        border-radius: 3px;
        box-shadow: 3px 3px gray;
        .titleWrap {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .title {
                ${({ theme }) => theme.fonts.h7};
            }
        }

        .contentsWrap {
            padding: 1rem 0rem;
            .content {
                ${({ theme }) => theme.fonts.h5};
            }

            .ant-select {
                border-bottom: 1px solid lightgray;
                border-radius: 0px;
                ${(props) => props.theme.fonts.h5};
            }

            .garmentSizeTable {
                padding: 1rem 0;
            }
        }
    }
`;

export default MclGarmentSize;
