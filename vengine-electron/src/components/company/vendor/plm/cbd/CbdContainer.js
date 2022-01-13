import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useSelector } from 'react-redux';
import extractValueUtil from 'core/utils/extractValueUtil';
import styled from 'styled-components';
import { SplitPane } from 'react-collapse-pane';
import { Button, Row, Col, Tooltip } from 'antd';
import {
    CbdAssign,
    CbdOption,
    CbdCost,
    CbdMaterialWrite,
    CbdMaterialDetail,
    Document,
} from './';

const CbdContainer = (props) => {
    const { history, match } = props;
    const { cbdId } = match.params || null;
    const [status, setStatus] = useState(cbdId ? false : true);
    const [visibleDocuemnt, setVisibleDocument] = useState(false);
    const isDisabled = useMemo(() => {
        return !status;
    }, [status]);

    const leftSplit = useRef();
    const rightSplit = useRef();
    // console.log("leftSplit ====> ", leftSplit);
    const initialShow = {
        fabric: {
            status: false,
            id: null,
        },
        trim: {
            status: false,
            id: null,
        },
        accessories: {
            status: false,
            id: null,
        },
        direct: {
            status: false,
            id: null,
        },
        indirect: {
            status: false,
            id: null,
        },
        materialWrite: {
            type: null,
            status: false,
            id: null,
        },
        materialDetail: {
            type: null,
            status: false,
            id: null,
        },
    };
    const [show, setShow] = useState(initialShow);
    const cbdCoverGetId = useSelector((state) => state.cbdCoverReducer.get.id);

    const handleLeftSplit = () => {
        if (leftSplit.current) {
            leftSplit.current.click();
        }
    };

    const handleRightSplit = () => {
        if (rightSplit.current) {
            rightSplit.current.click();
        }
    };

    const Write = () => {
        if (show.fabric.status) {
            return (
                <CbdAssign
                    {...props}
                    type="fabric"
                    initialShow={initialShow}
                    show={show}
                    onShow={setShow}
                    onLeftSplit={handleLeftSplit}
                />
            );
        } else if (show.trim.status) {
            return (
                <CbdAssign
                    {...props}
                    type="trim"
                    initialShow={initialShow}
                    show={show}
                    onShow={setShow}
                    onLeftSplit={handleLeftSplit}
                />
            );
        } else if (show.accessories.status) {
            return (
                <CbdAssign
                    {...props}
                    type="accessories"
                    initialShow={initialShow}
                    show={show}
                    onShow={setShow}
                    onLeftSplit={handleLeftSplit}
                />
            );
        } else if (show.direct.status) {
            return (
                <CbdCost
                    {...props}
                    type="direct"
                    initialShow={initialShow}
                    show={show}
                    onShow={setShow}
                    onLeftSplit={handleLeftSplit}
                    isDisabled={isDisabled}
                />
            );
        } else if (show.indirect.status) {
            return (
                <CbdCost
                    {...props}
                    type="indirect"
                    initialShow={initialShow}
                    show={show}
                    onShow={setShow}
                    onLeftSplit={handleLeftSplit}
                    isDisabled={isDisabled}
                />
            );
        } else if (show.materialWrite.status) {
            return (
                <CbdMaterialWrite
                    {...props}
                    type={show.materialWrite.type}
                    initialShow={initialShow}
                    show={show}
                    onShow={setShow}
                    onLeftSplit={handleLeftSplit}
                />
            );
        } else if (show.materialDetail.status) {
            return (
                <CbdMaterialDetail
                    {...props}
                    cbdCoverGetId={cbdCoverGetId}
                    type={show.materialDetail.type}
                    initialShow={initialShow}
                    show={show}
                    onShow={setShow}
                    onLeftSplit={handleLeftSplit}
                    isDisabled={isDisabled}
                />
            );
        } else {
            return null;
        }
    };

    // cover Id 없으면 cover container로 이동
    useEffect(() => {
        if (!cbdCoverGetId.data) {
            history.goBack();
        }
    }, [history, cbdCoverGetId]);

    // Split Pane
    useEffect(() => {
        const el = document.querySelectorAll('.Pane.splitPane');

        if (Object.keys(show).some((v) => show[v].status)) {
            if (el.length > 0) {
                el[1].style.flexGrow = 1;
            }
        } else {
            if (el.length > 0) {
                el[1].style.flexGrow = 0;
            }
        }
    }, [show]);

    const verticalCollapseOptions = {
        beforeToggleButton: <Button>⬅</Button>,
        afterToggleButton: <Button>➡</Button>,
        overlayCss: {
            backgroundColor: '#ffffff',
            // backgroundImage:
            //     "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsA_k11z0I1ZZiONOzYF7DCIBR1FV1o7_Spw&usqp=CAU')",
            // backgroundRepeat: "no-repeat",
            // backgroundSize: "contain",
            borderTop: '4px solid #096dd9',
        },
        buttonTransition: 'none',
        buttonPositionOffset: -30,
        collapsedSize: 30, //50
        collapseTransitionTimeout: 350,
    };

    const verticalCollapseOptions2 = {
        beforeToggleButton: (
            <Button ref={leftSplit} onClick={() => setShow(initialShow)}>
                ➡
            </Button>
        ),
        afterToggleButton: <Button ref={rightSplit}>⬅</Button>,
        overlayCss: { backgroundColor: '#ffffff' },
        buttonTransition: 'zoom',
        buttonPositionOffset: -30,
        collapsedSize: 0,
        collapseTransitionTimeout: 350,
        collapseDirection: 'right',
    };

    return (
        <CbdContainerWrap>
            <div id="infoWrap">
                <Row>
                    <Col span={3}>
                        <div className="infoTitle">Buyer</div>
                        <div className="infoDesc">
                            <Tooltip
                                placement="topRight"
                                title={extractValueUtil({
                                    data: cbdCoverGetId.data,
                                    field: 'buyer',
                                    property: 'name',
                                })}
                                arrowPointAtCenter
                            >
                                {extractValueUtil({
                                    data: cbdCoverGetId.data,
                                    field: 'buyer',
                                    property: 'name',
                                })}
                            </Tooltip>
                        </div>
                    </Col>
                    <Col span={3}>
                        <div className="infoTitle">Brand</div>
                        <div className="infoDesc">
                            <Tooltip
                                placement="topRight"
                                title={extractValueUtil({
                                    data: cbdCoverGetId.data,
                                    field: 'brand',
                                    property: 'name',
                                })}
                                arrowPointAtCenter
                            >
                                {extractValueUtil({
                                    data: cbdCoverGetId.data,
                                    field: 'brand',
                                    property: 'name',
                                })}
                            </Tooltip>
                        </div>
                    </Col>
                    <Col span={3}>
                        <div className="infoTitle">Design#</div>
                        <div className="infoDesc">
                            <Tooltip
                                placement="topRight"
                                title={extractValueUtil({
                                    data: cbdCoverGetId.data,
                                    field: 'designNumber',
                                })}
                                arrowPointAtCenter
                            >
                                {extractValueUtil({
                                    data: cbdCoverGetId.data,
                                    field: 'designNumber',
                                })}
                            </Tooltip>
                        </div>
                    </Col>
                    <Col span={3}>
                        <div className="infoTitle">Season</div>
                        <div className="infoDesc">
                            <Tooltip
                                placement="topRight"
                                title={
                                    <div>
                                        {extractValueUtil({
                                            data: cbdCoverGetId.data,
                                            field: 'season',
                                            property: 'name',
                                        })}{' '}
                                        {extractValueUtil({
                                            data: cbdCoverGetId.data,
                                            field: 'seasonYear',
                                        })}
                                    </div>
                                }
                                arrowPointAtCenter
                            >
                                <div>
                                    {extractValueUtil({
                                        data: cbdCoverGetId.data,
                                        field: 'season',
                                        property: 'name',
                                    })}{' '}
                                    {extractValueUtil({
                                        data: cbdCoverGetId.data,
                                        field: 'seasonYear',
                                    })}
                                </div>
                            </Tooltip>
                        </div>
                    </Col>
                    <Col span={3}>
                        <div className="infoTitle">Order Type</div>
                        <div className="infoDesc">
                            <Tooltip
                                placement="topRight"
                                title={extractValueUtil({
                                    data: cbdCoverGetId.data,
                                    field: 'orderType',
                                    property: 'name',
                                })}
                                arrowPointAtCenter
                            >
                                {extractValueUtil({
                                    data: cbdCoverGetId.data,
                                    field: 'orderType',
                                    property: 'name',
                                })}
                            </Tooltip>
                        </div>
                    </Col>
                    <Col span={3}>
                        <div className="infoTitle">Fabric Type</div>
                        <div className="infoDesc">
                            <Tooltip
                                placement="topRight"
                                title={extractValueUtil({
                                    data: cbdCoverGetId.data,
                                    field: 'materialCategory',
                                    property: 'typeB',
                                })}
                                arrowPointAtCenter
                            >
                                {extractValueUtil({
                                    data: cbdCoverGetId.data,
                                    field: 'materialCategory',
                                    property: 'typeB',
                                })}
                            </Tooltip>
                        </div>
                    </Col>
                    <Col span={3}>
                        <div className="infoTitle">Gender</div>
                        <div className="infoDesc">
                            <Tooltip
                                placement="topRight"
                                title={extractValueUtil({
                                    data: cbdCoverGetId.data,
                                    field: 'gender',
                                    property: 'name1',
                                })}
                                arrowPointAtCenter
                            >
                                {extractValueUtil({
                                    data: cbdCoverGetId.data,
                                    field: 'gender',
                                    property: 'name1',
                                })}
                            </Tooltip>
                        </div>
                    </Col>
                    <Col span={3}>
                        <div className="infoTitle">Garment Type</div>
                        <div className="infoDesc">
                            <Tooltip
                                placement="topRight"
                                title={extractValueUtil({
                                    data: cbdCoverGetId.data,
                                    field: 'garmentCategory',
                                    property: 'name1',
                                })}
                                arrowPointAtCenter
                            >
                                {extractValueUtil({
                                    data: cbdCoverGetId.data,
                                    field: 'garmentCategory',
                                    property: 'name1',
                                })}
                            </Tooltip>
                        </div>
                    </Col>
                </Row>
            </div>
            <div id="splitPaneWrap">
                <SplitPane
                    split="vertical"
                    className="flexGrowZero"
                    collapseOptions={verticalCollapseOptions}
                    collapsedSizes={[600, null]}
                    resizerOptions={{
                        css: {
                            width: '1px',
                            background: 'rgba(0, 0, 0, 0.1)',
                        },
                        hoverCss: {
                            width: '10px',
                            background: 'rgba(6,132,133,0.5)',
                        },
                        grabberSize: '1rem',
                    }}
                    hooks={{
                        onCollapse: (e) =>
                            setVisibleDocument(e[0] === null ? true : false),
                    }}
                >
                    {visibleDocuemnt && (
                        <Document
                            {...props}
                            show={show}
                            cbdCoverGetId={cbdCoverGetId}
                        />
                    )}

                    <div id="infoOutterWrap">
                        <div
                            style={{
                                position: 'relative',
                                height: '100%',
                                flexGrow: 1,
                            }}
                        >
                            <SplitPane
                                split="vertical"
                                className="splitPane"
                                collapseOptions={verticalCollapseOptions2}
                                collapsedSizes={[null, 600]}
                                initialSizes={[4, 1]}
                                resizerOptions={{
                                    css: {
                                        width:
                                            Object.keys(show).filter((v) => {
                                                return show[v].status === true;
                                            }).length > 0
                                                ? '1px'
                                                : '0px',
                                        background: 'rgba(0, 0, 0, 0.1)',
                                    },
                                    hoverCss: {
                                        width:
                                            Object.keys(show).filter((v) => {
                                                return show[v].status === true;
                                            }).length > 0
                                                ? '10px'
                                                : '0px',
                                        background: 'rgba(6,132,133,0.5)',
                                    },
                                    grabberSize:
                                        Object.keys(show).filter((v) => {
                                            return show[v].status === true;
                                        }).length > 0
                                            ? '1rem'
                                            : '0',
                                }}
                            >
                                <CbdOption
                                    {...props}
                                    cbdCoverGetId={cbdCoverGetId}
                                    initialShow={initialShow}
                                    show={show}
                                    onShow={setShow}
                                    onRightSplit={handleRightSplit}
                                    onLeftSplit={handleLeftSplit}
                                    status={status}
                                    onStatus={setStatus}
                                />
                                <Write />
                            </SplitPane>
                        </div>
                    </div>
                </SplitPane>
            </div>
        </CbdContainerWrap>
    );
};

const CbdContainerWrap = styled.div`
    // border: 1px solid blue;
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 0rem 0 0 0;
    // Split pane를 위한 css
    .itwaXz.flexGrowZero:first-child {
        flex-grow: 0 !important;
    }

    #splitPaneWrap {
        position: relative;
        height: 100%;
        #infoOutterWrap {
            display: flex;
            flex-direction: column;
            height: 100%;
            padding: 0 0 0 1.5rem;
        }
    }
    #infoWrap {
        // border-bottom: 1px solid lightgray;
        // border: 1px solid red;
        background: #068485;
        width: 100%;
        min-width: 800px;
        padding: 0 0 0.5rem 1rem;
        .infoTitle {
            padding-left: 2rem;
            ${(props) => props.theme.fonts.h5};
            color: #ffffff;
        }
        .infoDesc {
            padding-left: 2rem;
            ${(props) => props.theme.fonts.display_1};
            color: #ffffff;
        }
    }
`;

export default CbdContainer;
