import apiUtil from 'core/utils/apiUtil';

const materialInfoGetPagesApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/material/info/page`,
        params: {
            page: payload.current,
            size: payload.pageSize,
            searchKeyWord: payload.searchKeyword,
            type: payload.type,
        },
        method: 'GET',
    });

    const result = {
        ...res.data,
        page: {
            ...res.data.page,
            content: res.data.page.content?.map((v) => ({
                ...v,
                id: v?.materialInfo?.id,
            })),
        },
    };

    return result;
};

const materialInfoPostApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/material/info`,
        data: payload,
        method: 'POST',
    });

    return res.data;
};

const materialInfoPostExcelUploadApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/material/excel/save/${payload.type}`,
        params: payload.data,
        method: 'POST',
    });

    return res.data;
};

const materialInfoGetExcelTemplateApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/material/excel/download/${payload}`,
        method: 'GET',
        responseType: 'arraybuffer',
    });

    return res.data;
};

const materialInfoPutApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/material/info/${payload.id}`,
        data: payload.data,
        method: 'PUT',
    });

    return res.data;
};

const materialInfoGetDetailApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/material/info/${payload}`,
        method: 'GET',
    });

    return res.data;
};

const materialInfoDeleteApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/material/info`,
        data: payload,
        method: 'DELETE',
    });

    return res.data;
};

export {
    materialInfoGetPagesApi,
    materialInfoPostApi,
    materialInfoPostExcelUploadApi,
    materialInfoGetExcelTemplateApi,
    materialInfoPutApi,
    materialInfoGetDetailApi,
    materialInfoDeleteApi,
};
