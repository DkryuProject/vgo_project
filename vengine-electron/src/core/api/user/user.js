import apiUtil from 'core/utils/apiUtil';

const userGetPersonalListApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/user/personal/list`,
        params: {
            page: payload.current,
            size: payload.pageSize,
        },
        method: 'GET',
    });
    return res.data;
};

const userGetCheckApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/user/check`,
        method: 'GET',
    });
    return res.data;
};

const userPostJoinApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/user/${payload?.userID}/join/${payload?.companyID}`,
        method: 'POST',
    });
    return res.data;
};

const userPostVerifyApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/verify`,
        params: { code: payload?.code, email: payload?.email },
        method: 'POST',
    });
    return res.data;
};

const userPutJoinApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/user/join/${payload?.status}`,
        data: payload?.data,
        method: 'PUT',
    });
    return res.data;
};

export {
    userGetPersonalListApi,
    userGetCheckApi,
    userPostJoinApi,
    userPostVerifyApi,
    userPutJoinApi,
};
