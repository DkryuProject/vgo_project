import styled from "styled-components";

const BasicTable = styled.div`
    // width: 70%;
    margin-top: -0.5rem;
    padding: 0 1rem;
    #basicTable {
        .tableTitleWrap {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .tableTitle {
                ${({ theme }) => theme.fonts.h6};
            }
            .searchWrap {
                .icon {
                    display: block;
                    margin-left: 1rem;
                    ${({ theme }) => theme.fonts.h6};
                    cursor: pointer;
                }
            }
        }
        .ant-table-thead tr th.ant-table-cell {
            text-align: center;
            ${({ theme }) => theme.fonts.h6};
        }
        .ant-table-tbody tr td.ant-table-cell,
        .ant-table-tbody tr td.ant-table-cell div {
            text-align: center;
            ${({ theme }) => theme.fonts.display_1};
        }
    }
    #paginationWrap {
        display: flex;
        justify-content: flex-end;
        margin: 1rem 1rem 0 0;
    }
`;

export default BasicTable;
