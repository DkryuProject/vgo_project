import apiUtil from 'core/utils/apiUtil';

const materialOfferGetListApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/material/offer/info/${payload}`,
        method: 'GET',
    });

    return res.data;
};

const materialOfferGetDetailApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/material/offer/${payload}`,
        method: 'GET',
    });

    return res.data;
};

const materialOfferGetOwnApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/material/offer/own/${payload}`,
        method: 'GET',
    });

    return res.data;
};

const materialOfferPostApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/material/offer/${payload.id}`,
        data: payload.data,
        method: 'POST',
    });

    return res.data;
};

const materialOfferPostAssignApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/material/offer/assigned`,
        data: payload,
        method: 'POST',
    });

    return res.data;
};

const materialOfferPutApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/material/offer/${payload.id}`,
        data: payload.data,
        method: 'PUT',
    });

    return res.data;
};

const materialOfferDeleteApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/material/offer`,
        data: payload,
        method: 'DELETE',
    });

    return res.data;
};

export {
    materialOfferGetListApi,
    materialOfferGetDetailApi,
    materialOfferGetOwnApi,
    materialOfferPostApi,
    materialOfferPostAssignApi,
    materialOfferPutApi,
    materialOfferDeleteApi,
};
