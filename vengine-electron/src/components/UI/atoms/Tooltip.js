import React from 'react';
import { Tooltip as AntdTooltip } from 'antd';
import styled, { css } from 'styled-components';
import Ellipsis from './Ellipsis';

const Tooltip = (props) => {
    const { title, color, placement, children, status } = props;
    // const _title =
    //     typeof title === 'object'
    //         ? {
    //               ...title,
    //               props: {
    //                   ...title?.props,
    //                   children: Array.isArray(title?.props?.children)
    //                       ? title?.props?.children?.map?.((v) => ({
    //                             ...v,
    //                             type: 'div',
    //                         }))
    //                       : {
    //                             ...title?.props?.children,
    //                             type: 'div',
    //                             props: {
    //                                 ...title?.props?.children?.props,
    //                                 children: Array.isArray(
    //                                     title?.props?.children?.props?.children
    //                                 )
    //                                     ? title?.props?.children?.props?.children?.map?.(
    //                                           (v2) => ({
    //                                               ...v2,
    //                                               type: 'div',
    //                                           })
    //                                       )
    //                                     : {
    //                                           ...title?.props?.children?.props
    //                                               ?.children,
    //                                           type: 'div',
    //                                       },
    //                             },
    //                         },
    //               },
    //           }
    //         : title;

    return (
        <AntdTooltip
            title={<TextStatus status={status}>{title}</TextStatus>}
            color={color}
            placement={placement}
        >
            <TextStatus status={status}>
                <Ellipsis>{children}</Ellipsis>
            </TextStatus>
        </AntdTooltip>
    );
};

Tooltip.defaultProps = {
    color: '#2db7f5',
    placement: 'top',
};

const TextStatus = styled.div`
    ${(props) =>
        props.status &&
        css`
            color: #800000;
            text-decoration: line-through;
        `}
`;

export default React.memo(Tooltip);
