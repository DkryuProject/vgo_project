import React from 'react';
import styled from 'styled-components';
import { Pie } from '@ant-design/charts';
import { Calendar, Badge, Col, Row } from 'antd';
import { Tooltip } from '../atoms';
import { TitleWrap } from '../molecules';
import { PushpinOutlined } from '@ant-design/icons';

const config = {
    appendPadding: 10,
    angleField: 'value',
    colorField: 'type',
    radius: 0.9,
    label: {
        type: 'inner',
        offset: '-30%',
        style: {
            fontSize: 14,
            textAlign: 'center',
        },
    },
    interactions: [{ type: 'element-active' }],
};

const DashboardStatistics = (props) => {
    const { onDate, dataStatistics } = props || {};

    const getListData = (value) => {
        return (
            dataStatistics?.po?.filter((v) => {
                const date = new Date(v.date);

                return date.getDate() === value.date();
            }) || []
        );
    };

    function dateCellRender(value) {
        const listData = getListData(value);
        return (
            <ul className="events">
                {listData.map((item, index) => (
                    <li key={item.content + index}>
                        <Tooltip title={item.content}>
                            <Badge status={item.type} text={item.content} />
                        </Tooltip>
                    </li>
                ))}
            </ul>
        );
    }

    return (
        <div>
            <Row>
                <Col span={8}>
                    <GraphPieStyle>
                        <TitleWrap>
                            <TitleWrap.Title suffix={<PushpinOutlined />}>
                                PLM
                            </TitleWrap.Title>
                        </TitleWrap>
                        <Pie
                            {...{
                                ...config,
                                data: dataStatistics?.restPoCount || [],
                            }}
                        />
                    </GraphPieStyle>
                </Col>
                <Col span={8}>
                    <GraphPieStyle>
                        <TitleWrap>
                            <TitleWrap.Title suffix={<PushpinOutlined />}>
                                RM PO
                            </TitleWrap.Title>
                        </TitleWrap>
                        <Pie
                            {...{
                                ...config,
                                data: dataStatistics?.poCount || [],
                            }}
                        />
                    </GraphPieStyle>
                </Col>

                <Col span={8}>
                    <GraphPieStyle>
                        <TitleWrap>
                            <TitleWrap.Title suffix={<PushpinOutlined />}>
                                AD HOC PO
                            </TitleWrap.Title>
                        </TitleWrap>
                        <Pie
                            {...{
                                ...config,
                                data: dataStatistics?.adhocPoCount || [],
                            }}
                        />
                    </GraphPieStyle>
                </Col>
            </Row>
            <CalendarStyle>
                <TitleWrap>
                    <TitleWrap.Title suffix={<PushpinOutlined />}>
                        PO CALENDAR
                    </TitleWrap.Title>
                </TitleWrap>
                <Calendar
                    onSelect={onDate}
                    dateCellRender={dateCellRender}
                    mode="month"
                    // fullscreen={false}
                />
            </CalendarStyle>
        </div>
    );
};
const GraphPieStyle = styled.div`
    position: relative;
    .title {
        // position: absolute;
        // top: 15%;
        // left: 50%;
        ${(props) => props.theme.fonts.h7};
        // transform: translate(-100%, 0);
    }
    canvas {
        height: 300px !important;
    }
`;
const CalendarStyle = styled.div`
    .events {
        margin: 0;
        padding: 0;
        list-style: none;
    }
    .events .ant-badge-status {
        width: 100%;
        overflow: hidden;
        font-size: 12px;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .notes-month {
        font-size: 28px;
        text-align: center;
    }
    .notes-month section {
        font-size: 28px;
    }
    .ant-radio-button-wrapper {
        font-size: 10px;
        height: 27px;
        line-height: 27px;
    }

    .ant-radio-group,
    .ant-radio-group-outline,
    .ant-radio-group-small,
    .ant-picker-calendar-mode-switch {
        label {
            display: none;
        }
    }
`;

export default DashboardStatistics;
