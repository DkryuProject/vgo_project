import React from 'react';
import { Button, Tooltip } from 'components/UI/atoms';
import { EditTable, TitleWrap } from 'components/UI/molecules';
import { commonBasicGetListsApi } from 'core/api/common/basic';

const MaterialYarn = (props) => {
    const {
        materialYarnTable,
        materialYarnRowKey,
        materialYarnDataSource,
        onMaterialYarnAssign,
        onExcute,
        onMaterialYarnCloseDrawer,
    } = props;

    const columns = [
        {
            title: 'Name',
            dataIndex: 'contents',
            selectBox: {
                _key: 'id',
                _value: 'id',
                _text: 'name1',
                onRequestApi: () => commonBasicGetListsApi('yarn'),
            },
            editable: true,
            ellipsis: true,
            align: 'left',
            render: (data) => {
                return <Tooltip title={data?.name}>{data?.name}</Tooltip>;
            },
        },
        {
            title: 'Rate',
            dataIndex: 'rate',
            editable: true,
            ellipsis: true,
            inputType: 'number',
            inputValidate: { max: 100 },
            align: 'left',
            width: '20%',
            render: (data) => {
                const value = <div>{data} %</div>;
                return <Tooltip title={value}>{value}</Tooltip>;
            },
        },
    ];

    const title = () => (
        <TitleWrap>
            <TitleWrap.Title suffix>FABRIC CONTENTS</TitleWrap.Title>
            <TitleWrap.Function>
                <Button
                    tooltip={{ title: 'Assign item' }}
                    onClick={onMaterialYarnAssign}
                >
                    Assign
                </Button>
                <Button
                    mode="add"
                    tooltip={{ title: 'Add row' }}
                    onClick={() => {
                        return materialYarnTable?.current?.handleAddRow();
                    }}
                />
                <Button
                    mode="remove"
                    tooltip={{ title: 'Delete selected item ' }}
                    onClick={() => onExcute('yarnDelete')}
                />

                <Button
                    mode="cancel"
                    tooltip={{ title: 'Close', placement: 'bottomLeft' }}
                    onClick={onMaterialYarnCloseDrawer}
                />
            </TitleWrap.Function>
        </TitleWrap>
    );
    return (
        <EditTable
            ref={materialYarnTable}
            rowKey={materialYarnRowKey}
            title={title}
            initialColumns={columns}
            dataSource={materialYarnDataSource}
            pagination={false}
            rowSelection={true}
        />
    );
};

export default MaterialYarn;
