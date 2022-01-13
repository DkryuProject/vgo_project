import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import extractValueUtil from 'core/utils/extractValueUtil';
import styled from 'styled-components';
import { Button, Row, Col, Tabs, Tooltip } from 'antd';
import { SplitPane } from 'react-collapse-pane';
import {
    MclOption,
    MclCbd,
    MclGarmentColor,
    MclGarmentSize,
    MclGarmentMarket,
    MclPoAssign,
    MclStyleAssign,
    MclOrderQty,
    // MclGarmentOrderQty,
    Document,
    MclPlanning,
    MclMaterialDetail,
} from './';
import MclPoAssignSummary from './MclPoAssignSummary';
import MclPlanningCopy from './MclPlanningCopy';
import MclAssign from './MclAssign';
import MclMaterialWrite from './MclMaterialWrite';
import MclRmPo from './MclRmPo';
import MclRmPoContainer from './MclRmPoContainer';
const { TabPane } = Tabs;

const MclContainer = (props) => {
    const { history, match } = props;
    const leftSplit = useRef();
    const rightSplit = useRef();
    const [tabKey, setTabKey] = useState('summary');
    const cbdCoverGetId = useSelector((state) => state.cbdCoverReducer.get.id);
    const [visibleDocuemnt, setVisibleDocument] = useState(false);
    const { mclOptionId } = match.params || '';
    const initialShow = {
        cbd: {
            status: false,
        },
        garmentColor: {
            status: false,
        },
        garmentSize: {
            status: false,
            groupName: null,
        },
        garmentMarket: {
            status: false,
        },
        styleAssign: {
            status: false,
        },
        poAssignSummary: {
            status: false,
        },
        planningCopy: {
            status: false,
        },
        fabric: {
            status: false,
        },
        trim: {
            status: false,
        },
        accessories: {
            status: false,
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
        rmPo: {
            type: null,
            status: false,
            id: null,
        },
    };

    const [show, setShow] = useState(initialShow);
    const tabCallback = useCallback(
        (key) => {
            return setTabKey(key);
        },
        [setTabKey]
    );

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
        if (show.cbd.status) {
            return (
                <MclCbd
                    {...props}
                    initialShow={initialShow}
                    onShow={setShow}
                    onLeftSplit={handleLeftSplit}
                />
            );
        } else if (show.garmentColor.status) {
            return (
                <MclGarmentColor
                    {...props}
                    initialShow={initialShow}
                    onShow={setShow}
                    onLeftSplit={handleLeftSplit}
                />
            );
        } else if (show.garmentSize.status) {
            return (
                <MclGarmentSize
                    {...props}
                    initialShow={initialShow}
                    show={show}
                    onShow={setShow}
                    onLeftSplit={handleLeftSplit}
                />
            );
        } else if (show.garmentMarket.status) {
            return (
                <MclGarmentMarket
                    {...props}
                    initialShow={initialShow}
                    onShow={setShow}
                    onLeftSplit={handleLeftSplit}
                />
            );
        } else if (show.styleAssign.status) {
            return (
                <MclStyleAssign
                    {...props}
                    initialShow={initialShow}
                    show={show}
                    onShow={setShow}
                    onLeftSplit={handleLeftSplit}
                />
            );
        } else if (show.poAssignSummary.status) {
            return (
                <MclPoAssignSummary
                    {...props}
                    initialShow={initialShow}
                    onShow={setShow}
                    onLeftSplit={handleLeftSplit}
                />
            );
        } else if (show.planningCopy.status) {
            return (
                <MclPlanningCopy
                    {...props}
                    initialShow={initialShow}
                    onShow={setShow}
                    onLeftSplit={handleLeftSplit}
                />
            );
        } else if (show.fabric.status) {
            return (
                <MclAssign
                    {...props}
                    type="fabric"
                    initialShow={initialShow}
                    onShow={setShow}
                    onLeftSplit={handleLeftSplit}
                />
            );
        } else if (show.trim.status) {
            return (
                <MclAssign
                    {...props}
                    type="trim"
                    initialShow={initialShow}
                    onShow={setShow}
                    onLeftSplit={handleLeftSplit}
                />
            );
        } else if (show.accessories.status) {
            return (
                <MclAssign
                    {...props}
                    type="accessories"
                    initialShow={initialShow}
                    onShow={setShow}
                    onLeftSplit={handleLeftSplit}
                />
            );
        } else if (show.materialWrite.status) {
            return (
                <MclMaterialWrite
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
                <MclMaterialDetail
                    {...props}
                    cbdCoverGetId={cbdCoverGetId}
                    type={show.materialDetail.type}
                    initialShow={initialShow}
                    show={show}
                    onShow={setShow}
                    onLeftSplit={handleLeftSplit}
                />
            );
        } else if (show.rmPo.status) {
            return (
                <MclRmPoContainer
                    {...props}
                    initialShow={initialShow}
                    show={show}
                    onShow={setShow}
                    onLeftSplit={handleLeftSplit}
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
        if (el.length > 0) {
            el[1].style.flexGrow = 0;
        }
    });

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
        collapsedSize: 30,
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

    const resizerOptions = {
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
    };

    return (
        <MclContainerWrap>
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
                    collapseOptions={verticalCollapseOptions}
                    collapsedSizes={[600, null]}
                    // minSizes={[150, '40%']}
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
                        <div id="contentsWrap">
                            <Tabs
                                defaultActiveKey="summary"
                                onChange={tabCallback}
                                className="customTabs"
                                size="small"
                            >
                                <TabPane tab="BASIC INFO" key="summary">
                                    {tabKey === 'summary' && (
                                        <SplitPane
                                            split="vertical"
                                            className="splitPane"
                                            collapseOptions={
                                                verticalCollapseOptions2
                                            }
                                            collapsedSizes={[null, 500]}
                                            resizerOptions={resizerOptions}
                                        >
                                            <MclOption
                                                {...props}
                                                initialShow={initialShow}
                                                onShow={setShow}
                                                onRightSplit={handleRightSplit}
                                            />
                                            <Write />
                                        </SplitPane>
                                    )}
                                </TabPane>

                                {/* 새로 등록시 안보이고 디테일 및 수정시 보인다 */}
                                {mclOptionId && (
                                    <>
                                        <TabPane tab="PO ASSIGN" key="poAssign">
                                            {tabKey === 'poAssign' && (
                                                <SplitPane
                                                    split="vertical"
                                                    className="splitPane"
                                                    collapseOptions={
                                                        verticalCollapseOptions2
                                                    }
                                                    collapsedSizes={[null, 500]}
                                                    resizerOptions={
                                                        resizerOptions
                                                    }
                                                >
                                                    <MclPoAssign
                                                        {...props}
                                                        initialShow={
                                                            initialShow
                                                        }
                                                        onShow={setShow}
                                                        onLeftSplit={
                                                            handleLeftSplit
                                                        }
                                                        onRightSplit={
                                                            handleRightSplit
                                                        }
                                                    />
                                                    <Write />
                                                </SplitPane>
                                            )}
                                        </TabPane>
                                        <TabPane tab="ORDER QTY" key="orderQty">
                                            {tabKey === 'orderQty' && (
                                                <MclOrderQty
                                                    {...props}
                                                    initialShow={initialShow}
                                                    onShow={setShow}
                                                    onRightSplit={
                                                        handleRightSplit
                                                    }
                                                />
                                            )}
                                        </TabPane>
                                        <TabPane tab="PLANNING" key="planning">
                                            {tabKey === 'planning' && (
                                                <SplitPane
                                                    split="vertical"
                                                    className="splitPane"
                                                    collapseOptions={
                                                        verticalCollapseOptions2
                                                    }
                                                    collapsedSizes={[null, 500]}
                                                    resizerOptions={
                                                        resizerOptions
                                                    }
                                                >
                                                    <MclPlanning
                                                        {...props}
                                                        initialShow={
                                                            initialShow
                                                        }
                                                        onShow={setShow}
                                                        onLeftSplit={
                                                            handleLeftSplit
                                                        }
                                                        onRightSplit={
                                                            handleRightSplit
                                                        }
                                                    />
                                                    <Write />
                                                </SplitPane>
                                            )}
                                        </TabPane>
                                        <TabPane tab="RM PO" key="rmPo">
                                            {tabKey === 'rmPo' && (
                                                <SplitPane
                                                    split="vertical"
                                                    className="splitPane"
                                                    collapseOptions={
                                                        verticalCollapseOptions2
                                                    }
                                                    collapsedSizes={[null, 500]}
                                                    resizerOptions={
                                                        resizerOptions
                                                    }
                                                >
                                                    <MclRmPo
                                                        {...props}
                                                        initialShow={
                                                            initialShow
                                                        }
                                                        onShow={setShow}
                                                        onLeftSplit={
                                                            handleLeftSplit
                                                        }
                                                        onRightSplit={
                                                            handleRightSplit
                                                        }
                                                    />
                                                    <Write />
                                                </SplitPane>
                                            )}
                                        </TabPane>
                                    </>
                                )}
                            </Tabs>
                        </div>
                    </div>
                </SplitPane>
            </div>
        </MclContainerWrap>
    );
};

const MclContainerWrap = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
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
            padding: 0 0 0 0.5rem;

            #contentsWrap {
                // border: 1px solid blue;
                position: relative;
                height: 100%;
                overflow-y: auto;
                flex-grow: 1;
                // padding: 1rem;

                .customTabs {
                    height: 100%;

                    .ant-tabs-nav {
                        margin: 0 1rem;
                    }

                    .ant-tabs-content {
                        // border: 1px solid orange;
                        height: 100%;
                        padding: 1rem;
                        padding-right: 0;

                        .ant-tabs-tabpane {
                            position: relative;
                            // border: 1px solid orange;
                        }
                    }
                }
            }
        }

    }

    #infoWrap {
        background: #068485;
        width: 100%;
        min-width: 800px;
        padding: 0 0 0.5rem 3rem;
            .infoTitle {
                padding-left; 2rem;
                ${(props) => props.theme.fonts.h5};
                color: #ffffff;
            }
            .infoDesc {
                padding-left; 2rem;
                ${(props) => props.theme.fonts.display_1};
                color: #ffffff;
            }
        }
    }
`;

export default MclContainer;
