import apiUtil from 'core/utils/apiUtil';

const newsGetListsApi = async (payload) => {
    const { country, current, pageSize, start, end, searchKeyword } =
        payload || {};
    const res = await apiUtil({
        url: `/v1/news/${country}`,
        params:
            start && end
                ? {
                      page: current,
                      size: pageSize,
                      start: start,
                      end: end,
                      searchKeyWord: searchKeyword,
                  }
                : {
                      page: current,
                      size: pageSize,
                      searchKeyWord: searchKeyword,
                  },
        method: 'GET',
    });
    return res.data;
};

export { newsGetListsApi };
