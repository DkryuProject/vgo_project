import apiUtil from 'core/utils/apiUtil';

const signupPostUserApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/user/signup`,
        data: payload,
        method: 'POST',
    });
    return res.data;
};

export { signupPostUserApi };
