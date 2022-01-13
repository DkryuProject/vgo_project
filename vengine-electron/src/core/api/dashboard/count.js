import apiUtil from 'core/utils/apiUtil';

const dashboardGetStatisticsApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/monthly/${payload?.year}/${payload?.month}`,
        method: 'GET',
    });
    return res.data;
};

export { dashboardGetStatisticsApi };
