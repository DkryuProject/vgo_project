import React, { useState, useEffect, useRef, useCallback } from 'react';

import styled from 'styled-components';
import { SplitPane } from 'react-collapse-pane';
import { Button } from 'antd';

import Adhoc from './Adhoc';
import AdhocWrite from './AdhocWrite';

const AdhocContainer = (props) => {
    const leftSplit = useRef();
    const rightSplit = useRef();

    const initialShow = {
        adhocWrite: {
            status: false,
            id: null,
        },
        adhocAssign: {
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

    const handleLeftSplit = useCallback(() => {
        if (leftSplit.current) {
            leftSplit.current.click();
        }
    }, [leftSplit]);

    const handleRightSplit = useCallback(() => {
        if (rightSplit.current) {
            rightSplit.current.click();
        }
    }, [rightSplit]);

    const Write = () => {
        if (show.adhocWrite.status) {
            return (
                <AdhocWrite
                    {...props}
                    initialShow={initialShow}
                    show={show}
                    onShow={setShow}
                    onLeftSplit={handleLeftSplit}
                    onRightSplit={handleRightSplit}
                />
            );
        } else {
            return null;
        }
    };

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

    const verticalCollapseOptions2 = {
        beforeToggleButton: <Button ref={leftSplit}>➡</Button>,
        afterToggleButton: <Button ref={rightSplit}>⬅</Button>,
        overlayCss: { backgroundColor: '#ffffff' },
        buttonTransition: 'zoom',
        buttonPositionOffset: -30,
        collapsedSize: 0,
        collapseTransitionTimeout: 350,
        collapseDirection: 'right',
    };
    return (
        <AdhocContainerWrap>
            <div id="splitPaneWrap">
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
                            <Adhoc
                                {...props}
                                initialShow={initialShow}
                                show={show}
                                onShow={setShow}
                                onLeftSplit={handleLeftSplit}
                                onRightSplit={handleRightSplit}
                            />
                            <Write />
                        </SplitPane>
                    </div>
                </div>
            </div>
        </AdhocContainerWrap>
    );
};

const AdhocContainerWrap = styled.div`
    // border: 1px solid blue;
    display: flex;
    flex-direction: column;
    height: 100%;
    // padding: 0rem 0 0 0;
    padding: 1rem 0.5rem 1rem 0;

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
`;

export default AdhocContainer;
