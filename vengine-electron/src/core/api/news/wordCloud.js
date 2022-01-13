import apiUtil from 'core/utils/apiUtil';

const newsGetWordCloudApi = async (payload) => {
    const { country, start, end } = payload || {};
    const res = await apiUtil({
        url: `/v1/news/word/${country}`,
        params: { start: start, end: end },
        method: 'GET',
    });
    return res.data;
};

export { newsGetWordCloudApi };
