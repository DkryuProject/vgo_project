import React from "react";
import styled from "styled-components";
import { Pagination } from "antd";

const DefaultPagination = (props) => {
    const { total, defaultPageSize, onPagination } = props;
    return (
        <DefaultPaginationWrap>
            <Pagination
                total={total}
                showTotal={(total) => `Total ${total - 1} items`}
                defaultPageSize={defaultPageSize}
                defaultCurrent={1}
                onChange={onPagination}
            />
        </DefaultPaginationWrap>
    );
};

const DefaultPaginationWrap = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-top: 1rem;
    background: #ffffff;
`;

export default DefaultPagination;
