import apiUtil from 'core/utils/apiUtil';

const companyGetRelationTypeApi = async (payload, type) => {
    const res = await apiUtil({
        url: `/v1/company/${payload}`,
        method: 'GET',
    });

    if (type === 'ALL') {
        return {
            ...res.data,
            list: [{ companyID: -1, companyName: 'ALL' }, ...res.data.list],
        };
    }

    return res.data;
};

const companyGetBrandApi = async (payload) => {
    if (!payload) return;
    const res = await apiUtil({
        url: `/v1/brand/${payload}`,
        method: 'GET',
    });
    return res.data;
};

const companyGetSearchApi = async (payload) => {
    if (!payload) return;
    const res = await apiUtil({
        url: `/v1/company/search/${payload.type}`,
        params: {
            page: payload.current,
            size: payload.pageSize,
            searchKeyword: payload.searchKeyword,
        },
        method: 'GET',
    });
    return res.data;
};

const companyGetAddressApi = async (payload) => {
    if (!payload) return;
    const res = await apiUtil({
        url: `/v1/company/address/list/${payload}`,
        method: 'GET',
    });

    return res.data;
};

const companyPostApi = async (payload) => {
    if (!payload) return;
    const res = await apiUtil({
        url: `/v1/company`,
        data: payload,
        method: 'POST',
    });
    return res.data;
};

export {
    companyGetRelationTypeApi,
    companyGetBrandApi,
    companyGetSearchApi,
    companyGetAddressApi,
    companyPostApi,
};
