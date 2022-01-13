import React from 'react';
import styled from 'styled-components';
import { MaterialInformation } from 'components/UI/organisms';
import { BoxShadow } from 'components/UI/molecules';

const MaterialCreate = (props) => {
    const {
        type,
        onType,
        materialInfoForm,
        onMaterialInfoSubmit,
        onMaterialYarnOpenDrawer,
    } = props;
    return (
        <MaterialCreateStyle>
            <BoxShadow>
                <MaterialInformation
                    type={type}
                    onType={onType}
                    materialInfoForm={materialInfoForm}
                    onMaterialInfoSubmit={onMaterialInfoSubmit}
                    onMaterialYarnOpenDrawer={onMaterialYarnOpenDrawer}
                />
            </BoxShadow>
        </MaterialCreateStyle>
    );
};

const MaterialCreateStyle = styled.div`
    padding: 1rem;
`;

export default MaterialCreate;
