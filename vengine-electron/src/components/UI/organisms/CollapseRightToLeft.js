import React from 'react';
import styled from 'styled-components';
import { Button } from 'components/UI/atoms';
import { SplitPane } from 'react-collapse-pane';

const CollapseRightToLeft = (props) => {
    const { children, splitLeft, splitRight } = props || {};

    const verticalCollapseOptions = {
        beforeToggleButton: <Button ref={splitLeft}>➡</Button>,
        afterToggleButton: <Button ref={splitRight}>⬅</Button>,
        overlayCss: { backgroundColor: '#ffffff' },
        buttonTransition: 'zoom',
        buttonPositionOffset: -30,
        collapsedSize: 0,
        collapseTransitionTimeout: 350,
        collapseDirection: 'right',
    };

    return (
        <div id="splitPaneWrap">
            <SplitPane
                split="vertical"
                className="splitPane"
                collapseOptions={verticalCollapseOptions}
                collapsedSizes={[null, 600]}
                initialSizes={[4, 0]}
                resizerOptions={{
                    css: {
                        width: '1px',
                        // Object.keys(show).filter((v) => {
                        //     return show[v].status === true;
                        // }).length > 0
                        //     ? '1px'
                        //     : '0px',
                        background: 'rgba(0, 0, 0, 0.1)',
                    },
                    hoverCss: {
                        width: '10px',
                        // Object.keys(show).filter((v) => {
                        //     return show[v].status === true;
                        // }).length > 0
                        //     ? '10px'
                        //     : '0px',
                        background: 'rgba(6,132,133,0.5)',
                    },
                    grabberSize: '1rem',
                    // Object.keys(show).filter((v) => {
                    //     return show[v].status === true;
                    // }).length > 0
                    //     ? '1rem'
                    //     : '0',
                }}
            >
                {children}
            </SplitPane>
        </div>
    );
};

const Left = ({ children }) => {
    return <LeftStyle>{children}</LeftStyle>;
};

const Right = ({ children }) => {
    return <div>{children}</div>;
};

CollapseRightToLeft.Left = Left;
CollapseRightToLeft.Right = Right;

const LeftStyle = styled.div`
    padding: 1rem;
`;

export default CollapseRightToLeft;
