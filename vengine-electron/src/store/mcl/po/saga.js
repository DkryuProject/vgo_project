import { takeEvery } from 'redux-saga/effects';
import createAsyncSaga from 'core/utils/reduxUtil';
import apiUtil from 'core/utils/apiUtil';
import {
    ASYNC_MCL_PO_GET_PAGES,
    mclPoGetPagesAsyncAction,
    ASYNC_MCL_PO_GET_ID,
    mclPoGetIdAsyncAction,
    ASYNC_MCL_PO_GET_ITEM_LISTS,
    mclPoGetItemListsAsyncAction,
    ASYNC_MCL_PO_GET_ITEM_ID,
    mclPoGetItemIdAsyncAction,
    ASYNC_MCL_PO_GET_STYLE_NUMBER,
    mclPoGetStyleNumberAsyncAction,
    ASYNC_MCL_PO_GET_PUBLISH_ID,
    mclPoGetPublishIdAsyncAction,
    ASYNC_MCL_PO_POST_ID,
    mclPoPostIdAsyncAction,
    ASYNC_MCL_PO_POST_ITEM_ID,
    mclPoPostItemIdAsyncAction,
    ASYNC_MCL_PO_POST_REORDER_ID,
    mclPoPostReorderIdAsyncAction,
    ASYNC_MCL_PO_POST_REORDER_ITEM_ID,
    mclPoPostReorderItemIdAsyncAction,
    ASYNC_MCL_PO_POST_EMAIL,
    mclPoPostEmailAsyncAction,
    ASYNC_MCL_PO_PUT_ID,
    mclPoPutIdAsyncAction,
    ASYNC_MCL_PO_PUT_ITEM_ID,
    mclPoPutItemIdAsyncAction,
    ASYNC_MCL_PO_PUT_PUBLISH_ID,
    mclPoPutPublishIdAsyncAction,
    ASYNC_MCL_PO_PUT_CANCELED,
    mclPoPutCanceledAsyncAction,
    ASYNC_MCL_PO_DELETE_ID,
    mclPoDeleteIdAsyncAction,
    ASYNC_MCL_PO_DELETE_ITEM_ID,
    mclPoDeleteItemIdAsyncAction,
} from './reducer';

const mclPoGetPagesApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/mcl/order/${payload.id}`,
        params: {
            page: payload.data.current,
            size: payload.data.pageSize,
            searchKeyWord: payload.data.searchKeyword,
            status: payload.data.status,
        },
        method: 'GET',
    });

    return res.data;
};

const mclPoGetIdApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/mcl/order/detail/${payload}`,
        method: 'GET',
    });

    return res.data;
};

const mclPoGetItemListsApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/mcl/order/item/${payload}`,
        method: 'GET',
    });

    return res.data;
};

const mclPoGetItemIdApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/mcl/order/item/detail/${payload}`,
        method: 'GET',
    });

    return res.data;
};

const mclPoGetStyleNumberApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/mcl/styleNumber/${payload}`,
        method: 'GET',
    });

    return res.data;
};

const mclPoGetPublishIdApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/mcl/order/publish/${payload}`,
        method: 'GET',
    });

    return res.data;
};

const mclPoPostIdApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/mcl/order/${payload.id}`,
        data: payload.data,
        method: 'POST',
    });

    return res.data;
};

const mclPoPostItemIdApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/mcl/order/item/${payload.id}`,
        data: payload.data,
        method: 'POST',
    });

    return res.data;
};

const mclPoPostReorderIdApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/mcl/reorder/${payload.id}`,
        data: payload.data,
        method: 'POST',
    });

    return res.data;
};

const mclPoPostReorderItemIdApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/mcl/reorder/item/${payload.id}`,
        data: payload.data,
        method: 'POST',
    });

    return res.data;
};

const mclPoPostEmailApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/mcl/order/email/${payload.id}`,
        data: payload.data,
        method: 'POST',
    });

    return res.data;
};

const mclPoPutIdApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/mcl/order/${payload.id}`,
        data: payload.data,
        method: 'PUT',
    });

    return res.data;
};

const mclPoPutItemIdApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/mcl/order/item/${payload.id}`,
        data: payload.data,
        method: 'PUT',
    });

    return res.data;
};

const mclPoPutPublishIdApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/mcl/order/publish/${payload}`,
        method: 'PUT',
    });

    return res.data;
};

const mclPoPutCanceledApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/mcl/order/canceled`,
        data: payload,
        method: 'PUT',
    });

    return res.data;
};

const mclPoDeleteIdApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/mcl/order/${payload}`,
        method: 'DELETE',
    });

    return res.data;
};

const mclPoDeleteItemIdApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/mcl/order/item`,
        data: payload,
        method: 'DELETE',
    });

    return res.data;
};

const mclPoGetPagesSaga = createAsyncSaga(
    mclPoGetPagesAsyncAction,
    mclPoGetPagesApi
);

const mclPoGetIdSaga = createAsyncSaga(mclPoGetIdAsyncAction, mclPoGetIdApi);

const mclPoGetItemListsSaga = createAsyncSaga(
    mclPoGetItemListsAsyncAction,
    mclPoGetItemListsApi
);

const mclPoGetItemIdSaga = createAsyncSaga(
    mclPoGetItemIdAsyncAction,
    mclPoGetItemIdApi
);

const mclPoGetStyleNumberSaga = createAsyncSaga(
    mclPoGetStyleNumberAsyncAction,
    mclPoGetStyleNumberApi
);

const mclPoGetPublishIdSaga = createAsyncSaga(
    mclPoGetPublishIdAsyncAction,
    mclPoGetPublishIdApi
);

const mclPoPostIdSaga = createAsyncSaga(mclPoPostIdAsyncAction, mclPoPostIdApi);

const mclPoPostItemIdSaga = createAsyncSaga(
    mclPoPostItemIdAsyncAction,
    mclPoPostItemIdApi
);

const mclPoPostReorderIdSaga = createAsyncSaga(
    mclPoPostReorderIdAsyncAction,
    mclPoPostReorderIdApi
);
const mclPoPostReorderItemIdSaga = createAsyncSaga(
    mclPoPostReorderItemIdAsyncAction,
    mclPoPostReorderItemIdApi
);

const mclPoPostEmailSaga = createAsyncSaga(
    mclPoPostEmailAsyncAction,
    mclPoPostEmailApi
);

const mclPoPutIdSaga = createAsyncSaga(mclPoPutIdAsyncAction, mclPoPutIdApi);

const mclPoPutItemIdSaga = createAsyncSaga(
    mclPoPutItemIdAsyncAction,
    mclPoPutItemIdApi
);

const mclPoPutPublishIdSaga = createAsyncSaga(
    mclPoPutPublishIdAsyncAction,
    mclPoPutPublishIdApi
);

const mclPoPutCanceledSaga = createAsyncSaga(
    mclPoPutCanceledAsyncAction,
    mclPoPutCanceledApi
);

const mclPoDeleteIdSaga = createAsyncSaga(
    mclPoDeleteIdAsyncAction,
    mclPoDeleteIdApi
);

const mclPoDeleteItemIdSaga = createAsyncSaga(
    mclPoDeleteItemIdAsyncAction,
    mclPoDeleteItemIdApi
);

export function* watchMclPoSaga() {
    yield takeEvery(ASYNC_MCL_PO_GET_PAGES.REQUEST, mclPoGetPagesSaga);
    yield takeEvery(ASYNC_MCL_PO_GET_ID.REQUEST, mclPoGetIdSaga);
    yield takeEvery(ASYNC_MCL_PO_GET_ITEM_LISTS.REQUEST, mclPoGetItemListsSaga);
    yield takeEvery(ASYNC_MCL_PO_GET_ITEM_ID.REQUEST, mclPoGetItemIdSaga);
    yield takeEvery(
        ASYNC_MCL_PO_GET_STYLE_NUMBER.REQUEST,
        mclPoGetStyleNumberSaga
    );
    yield takeEvery(ASYNC_MCL_PO_GET_PUBLISH_ID.REQUEST, mclPoGetPublishIdSaga);
    yield takeEvery(ASYNC_MCL_PO_POST_ID.REQUEST, mclPoPostIdSaga);
    yield takeEvery(ASYNC_MCL_PO_POST_ITEM_ID.REQUEST, mclPoPostItemIdSaga);
    yield takeEvery(
        ASYNC_MCL_PO_POST_REORDER_ID.REQUEST,
        mclPoPostReorderIdSaga
    );
    yield takeEvery(
        ASYNC_MCL_PO_POST_REORDER_ITEM_ID.REQUEST,
        mclPoPostReorderItemIdSaga
    );
    yield takeEvery(ASYNC_MCL_PO_POST_EMAIL.REQUEST, mclPoPostEmailSaga);
    yield takeEvery(ASYNC_MCL_PO_PUT_ID.REQUEST, mclPoPutIdSaga);
    yield takeEvery(ASYNC_MCL_PO_PUT_ITEM_ID.REQUEST, mclPoPutItemIdSaga);
    yield takeEvery(ASYNC_MCL_PO_PUT_PUBLISH_ID.REQUEST, mclPoPutPublishIdSaga);
    yield takeEvery(ASYNC_MCL_PO_PUT_CANCELED.REQUEST, mclPoPutCanceledSaga);
    yield takeEvery(ASYNC_MCL_PO_DELETE_ID.REQUEST, mclPoDeleteIdSaga);
    yield takeEvery(ASYNC_MCL_PO_DELETE_ITEM_ID.REQUEST, mclPoDeleteItemIdSaga);
}
