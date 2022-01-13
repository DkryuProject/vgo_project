import apiUtil from 'core/utils/apiUtil';

const commonMaterialGetListsApi = async () => {
    const res = await apiUtil({
        url: `/v1/common/material/types/list`,
        method: 'GET',
    });
    return res.data;
};

export { commonMaterialGetListsApi };
