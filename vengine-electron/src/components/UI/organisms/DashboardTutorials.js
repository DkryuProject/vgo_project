import React from 'react';
import ReactPlayer from 'react-player/lazy';
import styled from 'styled-components';
import { Col, Row } from 'antd';
import { TitleWrap } from '../molecules';
import { PushpinOutlined } from '@ant-design/icons';

const DashboardTutorials = (props) => {
    const { dataTutorialsData } = props || {};
    return (
        <DashboardTutorialsStyle>
            <TitleWrap style={{ marginBottom: ' 1rem' }}>
                <TitleWrap.Title suffix={<PushpinOutlined />}>
                    TUTORIALS
                </TitleWrap.Title>
            </TitleWrap>

            <Row gutter={[20, 20]}>
                <Col span={12}>
                    <a
                        rel="noopener noreferrer"
                        href={dataTutorialsData?.url || ''}
                        target="_blank"
                        className="imageWrap"
                    >
                        {dataTutorialsData?.imageDesc}
                        <div className="ratioBox">
                            <div
                                className="ratioContent"
                                style={{
                                    backgroundImage: `url(${dataTutorialsData?.image})`,
                                    backgroundSize: 'cover',
                                    resize: 'both',
                                }}
                            ></div>
                        </div>
                    </a>
                </Col>
                <Col
                    span={12}
                    style={{ borderLeft: '1px solid rgba(0, 0, 0, 0.1)' }}
                >
                    <ReactPlayerStyle>
                        <ReactPlayer
                            url={`https://www.youtube.com/watch?v=${dataTutorialsData?.video}`}
                            controls={true}
                        />
                    </ReactPlayerStyle>
                </Col>
            </Row>
        </DashboardTutorialsStyle>
    );
};

const DashboardTutorialsStyle = styled.div`
    margin: 3rem 0;
    .imageWrap {
        display: block;
        padding-top: 1rem;
        border-top: 1px solid rgba(0, 0, 0, 0.1);
        .imageDesc {
            margin: 0 0 1rem 1rem;
            line-height: 1.5;

            span {
                font-weight: 600;
                text-decoration: underline;
            }
        }
        .ratioBox {
            ${(props) => props.theme.controls.ratioBox};
            padding-top: 59%;
        }
        .ratioContent {
            ${(props) => props.theme.controls.ratioContent};
        }
    }

    .link {
        display: block;
        text-align: center;
    }
`;

const ReactPlayerStyle = styled.div`
    height: 100%;
    padding-top: 1rem;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    > div {
        width: 100% !important;
        height: 100% !important;
    }
`;

export default DashboardTutorials;
