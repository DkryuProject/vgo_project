import apiUtil from 'core/utils/apiUtil';

const commonBasicGetListsApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/common/basic/list/${payload}`,
        method: 'GET',
    });
    return res.data;
};

const commonBasicGetUomApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/common/basic/uom/${payload}`,
        method: 'GET',
    });
    return res.data;
};

const commonBasicGetCountriesApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/common/basic/countries`,
        method: 'GET',
    });

    return res.data;
};

export {
    commonBasicGetListsApi,
    commonBasicGetUomApi,
    commonBasicGetCountriesApi,
};
