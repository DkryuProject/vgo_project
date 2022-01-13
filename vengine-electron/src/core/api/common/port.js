import apiUtil from 'core/utils/apiUtil';

const commonPortGetSearchApi = async (payload) => {
    if (!payload) return;

    const res = await apiUtil({
        url: `/v1/common/port/search`,
        params: { searchKeyWord: payload },
        method: 'GET',
    });
    return res.data;
};

export { commonPortGetSearchApi };
