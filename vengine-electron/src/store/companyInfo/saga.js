import { takeLatest } from 'redux-saga/effects';
import createAsyncSaga from 'core/utils/reduxUtil';
import apiUtil from 'core/utils/apiUtil';
import {
    ASYNC_SEARCH_PAGE,
    companySearchPageAsyncAction,
    ASYNC_SEARCH_LISTS,
    companySearchListsAsyncAction,
    ASYNC_COMPANY_GARMENT_GET_SIZES,
    companyGarmentGetSizesAsyncAction,
    ASYNC_COMPANY_GARMENT_GET_SIZE,
    companyGarmentGetSizeAsyncAction,
    ASYNC_COMPANY_GET_TERMS,
    companyGetTermsAsyncAction,
    ASYNC_COMPANY_POST_TERMS,
    companyPostTermsAsyncAction,
    ASYNC_COMPANY_DELETE_TERMS,
    companyDeleteTermsAsyncAction,
    ASYNC_COMPANY_BIZ_GET_RELATION,
    companyBizGetRelationAsyncAction,
    ASYNC_COMPANY_BIZ_GET_REQUEST,
    companyBizGetRequestAsyncAction,
    ASYNC_COMPANY_BIZ_PUT_REQUEST_STATUS,
    companyBizPutRequestStatusAsyncAction,
    ASYNC_COMPANY_BIZ_PUT_RELATION_STATUS,
    companyBizPutRelationStatusAsyncAction,
    ASYNC_COMPANY_BIZ_POST_RELATION,
    companyBizPostRelationAsyncAction,
    ASYNC_COMPANY_BIZ_POST_NEW_PARTNER,
    companyBizPostNewPartnerAsyncAction,
    ASYNC_SAVE,
    companyInfoSaveAsyncAction,
    ASYNC_RELATION_SAVE,
    companyRelationSaveAsyncAction,
    ASYNC_BUYER_SAVE,
    companyBuyerSaveAsyncAction,
    ASYNC_COMPANY_BIZ_PUT_STATUS,
    companyBizPutStatusAsyncAction,
    ASYNC_DELETE,
    companyInfoDeleteAsyncAction,
} from './reducer';

const companySearchPageApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/company-info/page?type=${payload.type}&page=${payload.pagination.current}&size=${payload.pagination.pageSize}`,
        method: 'GET',
    });

    return res.data;
};

const companySearchListsApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/company-info/list?type=${payload}`,
        method: 'GET',
    });

    // 같은 컴포넌트에서 동적 조회 할때 id 값이 겹치는걸 방지하기 위해 type을 삽입
    return {
        type: payload,
        data: res.data,
    };
};

// 공통으로 이동
const companyGarmentGetSizesApi = async () => {
    const res = await apiUtil({
        url: `/v1/common/garment/sizes`,
        method: 'GET',
    });

    return res.data;
};

const companyGarmentGetSizeApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/common/garment/size/${payload}`,
        method: 'GET',
    });

    return res.data;
};

const companyGetTermsApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/company/terms?page=${payload.current}&size=${payload.pageSize}`,
        method: 'GET',
    });

    return res.data;
};

const companyPostTermsApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/company/terms`,
        data: payload,
        method: 'POST',
    });

    return res.data;
};

const companyDeleteTermsApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/company/terms`,
        data: payload,
        method: 'DELETE',
    });

    return res.data;
};

const companyBizGetRelationApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/company/biz/relation/page`,
        params: {
            page: payload.current,
            size: payload.pageSize,
            searchKeyword: payload.searchKeyword,
        },
        method: 'GET',
    });
    return res.data;
};

const companyBizGetRequestApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/company/biz/request`,
        params: {
            page: payload.current,
            size: payload.pageSize,
        },
        method: 'GET',
    });
    return res.data;
};

const companyBizPutRequestStatusApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/company/biz/${payload.status}`,
        data: payload.data,
        method: 'PUT',
    });
    return res.data;
};

const companyBizPutRelationStatusApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/company/biz/request/${payload.status}`,
        data: payload.data,
        method: 'PUT',
    });
    return res.data;
};

const companyBizPostRelationApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/company/biz`,
        data: payload,
        method: 'POST',
    });

    return res.data;
};

const companyBizPostNewPartnerApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/company/new/partner`,
        data: payload,
        method: 'POST',
    });

    return res.data;
};

const companyInfoSaveApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/company-info/${payload.type}`,
        data: payload.data,
        method: 'POST',
    });

    return res.data;
};

const companyRelationSaveApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/company-relation`,
        data: payload.data,
        method: 'POST',
    });

    return res.data;
};

const companyBuyerSaveApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/company-buyer`,
        data: payload.data,
        method: 'POST',
    });

    return res.data;
};

const companyBizPutStatusApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/company/biz`,
        data: payload,
        method: 'PUT',
    });

    return res.data;
};

const companyInfoDeleteApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/company-info/${payload.type}`,
        data: payload.ids,
        method: 'DELETE',
    });

    return res.data;
};

const companySerachPageSaga = createAsyncSaga(
    companySearchPageAsyncAction,
    companySearchPageApi
);

const companySerachListsSaga = createAsyncSaga(
    companySearchListsAsyncAction,
    companySearchListsApi
);

const companyGarmentGetSizesSaga = createAsyncSaga(
    companyGarmentGetSizesAsyncAction,
    companyGarmentGetSizesApi
);

const companyGarmentGetSizeSaga = createAsyncSaga(
    companyGarmentGetSizeAsyncAction,
    companyGarmentGetSizeApi
);

const companyGetTermsSaga = createAsyncSaga(
    companyGetTermsAsyncAction,
    companyGetTermsApi
);

const companyPostTermsSaga = createAsyncSaga(
    companyPostTermsAsyncAction,
    companyPostTermsApi
);

const companyDeleteTermsSaga = createAsyncSaga(
    companyDeleteTermsAsyncAction,
    companyDeleteTermsApi
);

const companyBizGetRelationSaga = createAsyncSaga(
    companyBizGetRelationAsyncAction,
    companyBizGetRelationApi
);

const companyBizGetRequestSaga = createAsyncSaga(
    companyBizGetRequestAsyncAction,
    companyBizGetRequestApi
);

const companyBizPostRelationSaga = createAsyncSaga(
    companyBizPostRelationAsyncAction,
    companyBizPostRelationApi
);

const companyBizPostNewPartnerSaga = createAsyncSaga(
    companyBizPostNewPartnerAsyncAction,
    companyBizPostNewPartnerApi
);

const companyInfoSaveSaga = createAsyncSaga(
    companyInfoSaveAsyncAction,
    companyInfoSaveApi
);

const companyRelationSaveSaga = createAsyncSaga(
    companyRelationSaveAsyncAction,
    companyRelationSaveApi
);

const companyBuyerSaveSaga = createAsyncSaga(
    companyBuyerSaveAsyncAction,
    companyBuyerSaveApi
);

const companyBizPutStatusSaga = createAsyncSaga(
    companyBizPutStatusAsyncAction,
    companyBizPutStatusApi
);

const companyBizPutRequestStatusSaga = createAsyncSaga(
    companyBizPutRequestStatusAsyncAction,
    companyBizPutRequestStatusApi
);

const companyBizPutRelationStatusSaga = createAsyncSaga(
    companyBizPutRelationStatusAsyncAction,
    companyBizPutRelationStatusApi
);

const companyInfoDeleteSaga = createAsyncSaga(
    companyInfoDeleteAsyncAction,
    companyInfoDeleteApi
);

export function* watchCompanyInfoSaga() {
    yield takeLatest(ASYNC_SEARCH_PAGE.REQUEST, companySerachPageSaga);
    yield takeLatest(ASYNC_SEARCH_LISTS.REQUEST, companySerachListsSaga);
    yield takeLatest(
        ASYNC_COMPANY_GARMENT_GET_SIZES.REQUEST,
        companyGarmentGetSizesSaga
    );
    yield takeLatest(
        ASYNC_COMPANY_GARMENT_GET_SIZE.REQUEST,
        companyGarmentGetSizeSaga
    );

    yield takeLatest(ASYNC_COMPANY_GET_TERMS.REQUEST, companyGetTermsSaga);
    yield takeLatest(ASYNC_COMPANY_POST_TERMS.REQUEST, companyPostTermsSaga);
    yield takeLatest(
        ASYNC_COMPANY_DELETE_TERMS.REQUEST,
        companyDeleteTermsSaga
    );

    yield takeLatest(
        ASYNC_COMPANY_BIZ_GET_RELATION.REQUEST,
        companyBizGetRelationSaga
    );
    yield takeLatest(
        ASYNC_COMPANY_BIZ_POST_RELATION.REQUEST,
        companyBizPostRelationSaga
    );
    yield takeLatest(
        ASYNC_COMPANY_BIZ_POST_NEW_PARTNER.REQUEST,
        companyBizPostNewPartnerSaga
    );

    yield takeLatest(ASYNC_SAVE.REQUEST, companyInfoSaveSaga);
    yield takeLatest(ASYNC_RELATION_SAVE.REQUEST, companyRelationSaveSaga);
    yield takeLatest(ASYNC_BUYER_SAVE.REQUEST, companyBuyerSaveSaga);
    yield takeLatest(
        ASYNC_COMPANY_BIZ_PUT_STATUS.REQUEST,
        companyBizPutStatusSaga
    );
    yield takeLatest(
        ASYNC_COMPANY_BIZ_GET_REQUEST.REQUEST,
        companyBizGetRequestSaga
    );
    yield takeLatest(
        ASYNC_COMPANY_BIZ_PUT_REQUEST_STATUS.REQUEST,
        companyBizPutRequestStatusSaga
    );
    yield takeLatest(
        ASYNC_COMPANY_BIZ_PUT_RELATION_STATUS.REQUEST,
        companyBizPutRelationStatusSaga
    );
    yield takeLatest(ASYNC_DELETE.REQUEST, companyInfoDeleteSaga);
}
