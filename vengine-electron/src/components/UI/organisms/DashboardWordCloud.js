import React from 'react';
import styled from 'styled-components';
import 'd3-transition';
import { select } from 'd3-selection';
import ReactWordcloud from 'react-wordcloud';

import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/scale.css';

const DashboardWordCloud = (props) => {
    const { dataWordCloud, onNewsPagination } = props || {};

    function getCallback(callback) {
        return function (word, event) {
            const isActive = callback !== 'onWordMouseOut';
            const element = event.target;
            const text = select(element);
            text.on('click', () => {
                if (isActive) {
                    onNewsPagination((newsPagination) => ({
                        ...newsPagination,
                        current: 1,
                        searchKeyword: word?.text,
                    }));
                }
            })
                .transition()
                // .attr('background', 'white')
                // .attr('font-size', isActive ? '300%' : '150%')
                .attr('text-decoration', isActive ? 'underline' : 'none');
        };
    }

    const callbacks = {
        // getWordColor: (word) => (word.value > 100 ? 'orange' : 'purple'),
        getWordTooltip: (word) => `${word.text}(${word.value})`,
        onWordClick: getCallback('onWordClick'),
        onWordMouseOut: getCallback('onWordMouseOut'),
        onWordMouseOver: getCallback('onWordMouseOver'),
    };

    return (
        <DashboardWordCloudStyle>
            <ReactWordcloud
                options={{
                    colors: [
                        '#1f77b4',
                        '#ff7f0e',
                        '#2ca02c',
                        '#d62728',
                        '#9467bd',
                        '#8c564b',
                    ],
                    enableTooltip: true,
                    deterministic: false,
                    fontFamily: 'impact',
                    fontSizes: [16, 60],
                    fontStyle: 'normal',
                    fontWeight: 'normal',
                    padding: 1,
                    // rotations: 5,
                    rotationAngles: [0, 90],
                    scale: 'sqrt',
                    spiral: 'archimedean',
                    transitionDuration: 1000,
                }}
                callbacks={callbacks}
                words={dataWordCloud}
            />
        </DashboardWordCloudStyle>
    );
};

const DashboardWordCloudStyle = styled.div`
    margin-bottom: 1rem;
    border: 1px solid rgba(0, 0, 0, 0.1);
`;

export default DashboardWordCloud;
