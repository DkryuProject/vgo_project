import apiUtil from 'core/utils/apiUtil';

const commonYearGetListsApi = async () => {
    const res = await apiUtil({
        url: `/v1/common/years/`,
        method: 'GET',
    });

    return {
        ...res.data,
        list: res.data?.list?.map((v) => ({
            id: v?.toString(),
            name: v?.toString(),
        })),
    };
};

export { commonYearGetListsApi };
