import React from 'react';
import styled from 'styled-components';
import {
    MaterialInformation,
    MaterialMyOwnedTable,
    MaterialOfferedPriceTable,
} from 'components/UI/organisms';
import { BoxShadow } from 'components/UI/molecules';

const MaterialDetail = (props) => {
    const {
        isDisabled,
        isUsedInfo,
        type,
        materialId,
        materialInfoForm,
        onMaterialInfoSubmit,
        onMaterialYarnOpenDrawer,
        materialOfferForm,
        materialOfferTable,
        materialOfferRowKey,
        materialOfferDataSource,
        onMaterialOfferDataSource,
        onMaterialOfferOpenDrawer,
        onMaterialOfferClickRow,
        onMaterialOfferMakeMyOwn,

        materialOwnTable,
        materialOwnRowKey,
        materialOwnDataSource,
        onMaterialOwnClickRow,
    } = props;

    return (
        <MaterialDetailStyle>
            <BoxShadow>
                <MaterialInformation
                    isDisabled={isDisabled}
                    isUsedInfo={isUsedInfo}
                    type={type}
                    materialId={materialId}
                    materialInfoForm={materialInfoForm}
                    onMaterialInfoSubmit={onMaterialInfoSubmit}
                    onMaterialYarnOpenDrawer={onMaterialYarnOpenDrawer}
                />
            </BoxShadow>
            <BoxShadow style={{ marginTop: '1rem' }}>
                <MaterialOfferedPriceTable
                    type={type}
                    isDisabled={isDisabled}
                    materialId={materialId}
                    materialOfferForm={materialOfferForm}
                    materialOfferTable={materialOfferTable}
                    materialOfferRowKey={materialOfferRowKey}
                    materialOfferDataSource={materialOfferDataSource}
                    onMaterialOfferDataSource={onMaterialOfferDataSource}
                    onMaterialOfferOpenDrawer={onMaterialOfferOpenDrawer}
                    onMaterialOfferClickRow={onMaterialOfferClickRow}
                    onMaterialOfferMakeMyOwn={onMaterialOfferMakeMyOwn}
                />
            </BoxShadow>
            {isDisabled && (
                <BoxShadow style={{ marginTop: '1rem' }}>
                    <MaterialMyOwnedTable
                        type={type}
                        materialOwnTable={materialOwnTable}
                        materialOwnRowKey={materialOwnRowKey}
                        materialOwnDataSource={materialOwnDataSource}
                        onMaterialOwnClickRow={onMaterialOwnClickRow}
                    />
                </BoxShadow>
            )}
        </MaterialDetailStyle>
    );
};

const MaterialDetailStyle = styled.div`
    padding: 1rem;
`;

export default MaterialDetail;
