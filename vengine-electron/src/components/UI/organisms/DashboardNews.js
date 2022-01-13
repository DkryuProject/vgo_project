import React from 'react';
import styled from 'styled-components';
import { DatePicker, Pagination, Space, Tag } from 'antd';
import ko from 'asserts/images/ko.png';
import en from 'asserts/images/en.png';
import id from 'asserts/images/in.png';
import vi from 'asserts/images/vi.png';
import noImage from 'asserts/images/no_news.png';

const { RangePicker } = DatePicker;

const DashboardNews = (props) => {
    const {
        rangeDate,
        onRangeDate,
        dataNews,
        isNewsAll,
        onIsNewsAll,
        onChangeLang,
        newsPagination,
        onNewsPagination,
    } = props || {};
    return (
        <DashboardNewsStyle>
            <div className="titleWrap">
                <div
                    className="toggleButton"
                    onClick={() => {
                        onIsNewsAll((isNewsAll) => !isNewsAll);
                        onNewsPagination((newsPagination) => ({
                            ...newsPagination,
                            current: 1,
                        }));
                    }}
                >
                    {isNewsAll ? (
                        <Tag color="blue">간략히 보기</Tag>
                    ) : (
                        <Tag color="blue">전체보기</Tag>
                    )}
                </div>
                <Space>
                    <Space className="searchWrap">
                        <img
                            src={ko}
                            onClick={() => onChangeLang('ko')}
                            alt="ko"
                        />
                        <img
                            src={en}
                            onClick={() => onChangeLang('en')}
                            alt="en"
                        />
                        <img
                            src={id}
                            onClick={() => onChangeLang('id')}
                            alt="id"
                        />
                        <img
                            src={vi}
                            onClick={() => onChangeLang('vi')}
                            alt="vi"
                        />
                    </Space>
                    <RangePicker
                        defaultValue={rangeDate}
                        onChange={(v) => onRangeDate(v)}
                    />
                </Space>
            </div>
            {dataNews?.length === 0 && '해당 날짜에 뉴스가 없습니다.'}
            {dataNews?.map((v, i) => {
                return (
                    <a
                        href={v?.href || false}
                        target="_blank"
                        rel="noopener noreferrer"
                        key={i}
                        className="box"
                    >
                        <div className="contentsWrap">
                            <div className="contentTitle">{v?.title}</div>
                            <div className="contentDesc">{v?.content}</div>
                            <div className="contentInfo">
                                {v?.outlets} / {v?.reporter} / {v?.createDate}
                            </div>
                        </div>
                        {v?.imageUrl && (
                            <div className="imageWrap">
                                <div className="ratioBox">
                                    <div
                                        className="ratioContent"
                                        style={{
                                            backgroundImage: `url(${
                                                v?.imageUrl || noImage
                                            })`,
                                            backgroundSize: 'cover',
                                            resize: 'both',
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                    </a>
                );
            })}

            {isNewsAll && (
                <div className="paginationWrap">
                    <Pagination
                        defaultCurrent={1}
                        total={newsPagination?.total}
                        onChange={(v) =>
                            onNewsPagination((newsPagination) => ({
                                ...newsPagination,
                                current: v,
                            }))
                        }
                        showSizeChanger={false}
                    />
                </div>
            )}
        </DashboardNewsStyle>
    );
};

const DashboardNewsStyle = styled.div`
    .titleWrap {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        .toggleButton {
            cursor: pointer;
        }
        .ant-picker-input > input {
            font-size: 10px;
        }
        .searchWrap {
            img {
                width: 25px;
                cursor: pointer;
            }
        }
    }

    .box {
        display: flex;
        justify-content: space-between;
        margin: 0.5rem 0;
        // padding: 0.5rem;
        border: 1px solid rgba(0, 0, 0, 0.1);
        .imageWrap {
            min-width: 195px;
            .ratioBox {
                ${(props) => props.theme.controls.ratioBox};
                padding-top: 50%;
            }
            .ratioContent {
                ${(props) => props.theme.controls.ratioContent};
            }
        }
        .contentsWrap {
            margin-right: 0.7rem;

            padding: 0.5rem;
            .contentTitle {
                ${(props) => props.theme.fonts.h7};
                color: #000;
            }
            .contentDesc {
                margin-top: 0.7rem;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                color: #000;
            }
            .contentInfo {
                margin-top: 0.5rem;
            }
        }
    }

    .paginationWrap {
        display: flex;
        justify-content: flex-end;
        margin-top: 1rem;
    }
`;

export default DashboardNews;
