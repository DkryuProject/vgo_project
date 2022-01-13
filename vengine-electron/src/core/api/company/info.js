import apiUtil from 'core/utils/apiUtil';

const companyInfoGetListsApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/company-info/list?type=${payload}`,
        method: 'GET',
    });

    return res.data;
};

export { companyInfoGetListsApi };
