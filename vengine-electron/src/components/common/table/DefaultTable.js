import React from 'react';
import styled from 'styled-components';
import { DefaultPagination } from 'components/common/pagination';
import { Table } from 'antd';

const DefaultTable = (props) => {
    const {
        title,
        tableKey,
        columns,
        dataSource,
        pagination,
        onPagination,
        onRow,
        rowSelection,
        expandable,
        onExpand,
    } = props;

    return (
        <TableWrap>
            <Table
                title={title}
                rowKey={(record) => record[tableKey]}
                columns={columns}
                dataSource={
                    dataSource
                        ? (dataSource.data && dataSource.data.list) ||
                          (dataSource.data && dataSource.data.page.content) ||
                          []
                        : []
                }
                loading={dataSource ? dataSource.isLoading : false}
                onRow={onRow}
                rowSelection={rowSelection}
                expandable={expandable}
                onExpand={onExpand}
                pagination={false}
                size="small"
                // bordered
            />
            {pagination &&
                dataSource &&
                dataSource.data &&
                dataSource.data.page && (
                    <DefaultPagination
                        total={dataSource && dataSource.data.page.totalElements}
                        defaultPageSize={pagination.size}
                        onChange={(page, pageSize) =>
                            onPagination({
                                ...pagination,
                                page: page,
                                size: pageSize,
                            })
                        }
                    />
                )}
        </TableWrap>
    );
};

const TableWrap = styled.div`
    // border: 1px solid orange;
    .titleWrap {
        // border: 1px solid red;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .title {
            // border: 1px solid blue;
            ${({ theme }) => theme.fonts.h6};
        }
    }

    .ant-table-thead tr th.ant-table-cell {
        text-align: center;
        ${({ theme }) => theme.fonts.h6};
        border: 1px solid white;
    }

    .ant-table-tbody tr td.ant-table-cell {
        border: 1px solid white;
    }

    .ant-table-tbody tr td.ant-table-cell,
    .ant-table-tbody tr td.ant-table-cell div,
    .ant-table-tbody tr td.ant-table-cell div span {
        text-align: center;
        ${({ theme }) => theme.fonts.display_1};
    }
`;

export default DefaultTable;

// const [selectedRows, setSelectedRows] = useState([]);

// const title = () => (
//     <div className="titleWrap">
//         <div className="title">제목</div>
//         <div className="functionWrap">기능 함수</div>
//     </div>
// );

// const onRow = (record, rowIndex) => {
//     return {
//         onClick: () =>
//             console.log('record: ', record, 'rowIndex: ', rowIndex),
//     };
// };

// const rowSelection = {
//     selectedRows,
//     onChange: (selectedRowKeys, selectedRows) => {
//         setSelectedRows(selectedRows);
//     },
// };

// const expandable = {
//     expandedRowRender: (record) => {
//         return <div>컴포넌트</div>;
//     },
// };
