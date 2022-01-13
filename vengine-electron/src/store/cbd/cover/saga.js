import { takeEvery } from 'redux-saga/effects';
import createAsyncSaga from 'core/utils/reduxUtil';
import apiUtil from 'core/utils/apiUtil';
import {
    ASYNC_CBD_COVER_GET_PAGES,
    cbdCoverGetPagesAsyncAction,
    ASYNC_CBD_COVER_GET_ID,
    cbdCoverGetIdAsyncAction,
    ASYNC_CBD_COVER_GET_DESIGN_NUMBER,
    cbdCoverGetDesignNumberAsyncAction,
    ASYNC_CBD_COVER_POST,
    cbdCoverPostAsyncAction,
    ASYNC_CBD_COVER_POST_IMAGE,
    cbdCoverPostImageAsyncAction,
    ASYNC_CBD_COVER_POST_FILTER,
    cbdCoverPostFilterAsyncAction,
    ASYNC_CBD_COVER_PUT_STATUS,
    cbdCoverPutStatusAsyncAction,
    ASYNC_CBD_COVER_DELETE,
    cbdCoverDeleteAsyncAction,
} from './reducer';

const cbdCoverGetPagesApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/cbd/covers`,
        params: {
            page: payload.current,
            size: payload.pageSize,
            searchKeyWord: payload.searchKeyword,
        },
        method: 'GET',
    });

    return res.data;
};

const cbdCoverGetIdApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/cbd/cover/${payload}`,
        method: 'GET',
    });

    return res.data;
};

const cbdCoverGetDesignNumberApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/cbd/cover`,
        params: { designNumber: payload },
        method: 'GET',
    });

    return res.data;
};

const cbdCoverPostApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/cbd/cover`,
        data: payload,
        method: 'POST',
    });

    return res.data;
};

const cbdCoverPostImageApi = async (payload) => {
    const formData = new FormData();
    formData.append('file', payload.file);

    const res = await apiUtil({
        url: `/v1/cbd/cover/${payload.id}`,
        data: formData,
        method: 'POST',
    });

    return res.data;
};

const cbdCoverPostFilterApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/cbd/covers`,
        data: payload,
        method: 'POST',
    });

    return res.data;
};

const cbdCoverPutStatusApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/cbd/cover/${payload.id}/${payload.data}`,
        method: 'PUT',
    });

    return res.data;
};

const cbdCoverDeleteApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/cbd/cover`,
        data: payload,
        method: 'DELETE',
    });

    return res.data;
};

const cbdCoverGetPagesSaga = createAsyncSaga(
    cbdCoverGetPagesAsyncAction,
    cbdCoverGetPagesApi
);

const cbdCoverGetIdSaga = createAsyncSaga(
    cbdCoverGetIdAsyncAction,
    cbdCoverGetIdApi
);

const cbdCoverGetDesignNumberSaga = createAsyncSaga(
    cbdCoverGetDesignNumberAsyncAction,
    cbdCoverGetDesignNumberApi
);

const cbdCoverPostSaga = createAsyncSaga(
    cbdCoverPostAsyncAction,
    cbdCoverPostApi
);

const cbdCoverPostImageSaga = createAsyncSaga(
    cbdCoverPostImageAsyncAction,
    cbdCoverPostImageApi
);

const cbdCoverPostFilterSaga = createAsyncSaga(
    cbdCoverPostFilterAsyncAction,
    cbdCoverPostFilterApi
);

const cbdCoverPutStatusSaga = createAsyncSaga(
    cbdCoverPutStatusAsyncAction,
    cbdCoverPutStatusApi
);

const cbdCoverDeleteSaga = createAsyncSaga(
    cbdCoverDeleteAsyncAction,
    cbdCoverDeleteApi
);

export function* watchCbdCoverSaga() {
    yield takeEvery(ASYNC_CBD_COVER_GET_PAGES.REQUEST, cbdCoverGetPagesSaga);
    yield takeEvery(ASYNC_CBD_COVER_GET_ID.REQUEST, cbdCoverGetIdSaga);
    yield takeEvery(
        ASYNC_CBD_COVER_GET_DESIGN_NUMBER.REQUEST,
        cbdCoverGetDesignNumberSaga
    );
    yield takeEvery(ASYNC_CBD_COVER_POST.REQUEST, cbdCoverPostSaga);
    yield takeEvery(ASYNC_CBD_COVER_POST_IMAGE.REQUEST, cbdCoverPostImageSaga);
    yield takeEvery(
        ASYNC_CBD_COVER_POST_FILTER.REQUEST,
        cbdCoverPostFilterSaga
    );
    yield takeEvery(ASYNC_CBD_COVER_PUT_STATUS.REQUEST, cbdCoverPutStatusSaga);
    yield takeEvery(ASYNC_CBD_COVER_DELETE.REQUEST, cbdCoverDeleteSaga);
}
