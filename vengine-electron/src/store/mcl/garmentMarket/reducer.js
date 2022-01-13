import { handleActions } from 'redux-actions';
import { produce } from 'immer';
import { asyncActionCreator, asyncAction } from 'core/utils/reduxUtil';

// 1. 각 모듈별 함수 구분을 위한 prefix 각 모듈 파일명 + '/'의 조합으로 구성
const prefix = 'mcl/garmentMarket';

// 2. 액션에 대해서 정의 및 액션 생성자 함수에 대해서 정의

// mcl garment market 리스트 조회
export const ASYNC_MCL_GARMENT_MARKET_GET_LISTS = asyncActionCreator(
    `${prefix}MCL_GARMENT_MARKET_GET_LISTS`
);
export const mclGarmentMarketGetListsAsyncAction = asyncAction(
    ASYNC_MCL_GARMENT_MARKET_GET_LISTS
);

// mcl garment market 등록
export const ASYNC_MCL_GARMENT_MARKET_POST = asyncActionCreator(
    `${prefix}MCL_GARMENT_MARKET_POST`
);
export const mclGarmentMarketPostAsyncAction = asyncAction(
    ASYNC_MCL_GARMENT_MARKET_POST
);

// mcl garment market 수정
export const ASYNC_MCL_GARMENT_MARKET_PUT = asyncActionCreator(
    `${prefix}MCL_GARMENT_MARKET_PUT`
);
export const mclGarmentMarketPutAsyncAction = asyncAction(
    ASYNC_MCL_GARMENT_MARKET_PUT
);

// mcl garment market 삭제
export const ASYNC_MCL_GARMENT_MARKET_DELETE = asyncActionCreator(
    `${prefix}MCL_GARMENT_MARKET_DELETE`
);
export const mclGarmentMarketDeleteAsyncAction = asyncAction(
    ASYNC_MCL_GARMENT_MARKET_DELETE
);

// 3. 리듀서의 값을 정의
const initialState = {
    get: {
        lists: {
            isLoading: false,
            data: null,
            error: null,
        },
    },
    post: {
        isLoading: false,
        data: null,
        error: null,
    },
    put: {
        isLoading: false,
        data: null,
        error: null,
    },
    delete: {
        isLoading: false,
        data: null,
        error: null,
    },
};

// 4. 리듀서를 정의
export const mclGarmentMarketReducer = handleActions(
    {
        [ASYNC_MCL_GARMENT_MARKET_GET_LISTS.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.get.lists.isLoading = true;
                draft.get.lists.data = initialState.get.lists.data;
                draft.get.lists.error = initialState.get.lists.error;
            }),
        [ASYNC_MCL_GARMENT_MARKET_GET_LISTS.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.get.lists.isLoading = false;
                draft.get.lists.data = action.payload;
            }),
        [ASYNC_MCL_GARMENT_MARKET_GET_LISTS.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.get.lists.isLoading = false;
                draft.get.lists.error = action.payload;
            }),

        [ASYNC_MCL_GARMENT_MARKET_POST.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.post.isLoading = true;
                draft.post.data = initialState.post.data;
                draft.post.error = initialState.post.error;
            }),
        [ASYNC_MCL_GARMENT_MARKET_POST.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.post.isLoading = false;
                draft.post.data = action.payload;
            }),
        [ASYNC_MCL_GARMENT_MARKET_POST.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.post.isLoading = false;
                draft.post.error = action.payload;
            }),
        [ASYNC_MCL_GARMENT_MARKET_POST.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.post.isLoading = false;
                draft.post.data = initialState.post.data;
                draft.post.error = initialState.post.error;
            }),

        [ASYNC_MCL_GARMENT_MARKET_PUT.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.put.isLoading = true;
                draft.put.data = initialState.put.data;
                draft.put.error = initialState.put.error;
            }),
        [ASYNC_MCL_GARMENT_MARKET_PUT.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.put.isLoading = false;
                draft.put.data = action.payload;
            }),
        [ASYNC_MCL_GARMENT_MARKET_PUT.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.put.isLoading = false;
                draft.put.error = action.payload;
            }),
        [ASYNC_MCL_GARMENT_MARKET_PUT.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.put.isLoading = false;
                draft.put.data = initialState.put.data;
                draft.put.error = initialState.put.error;
            }),

        [ASYNC_MCL_GARMENT_MARKET_DELETE.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.delete.isLoading = true;
                draft.delete.data = initialState.delete.data;
                draft.delete.error = initialState.delete.error;
            }),
        [ASYNC_MCL_GARMENT_MARKET_DELETE.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.delete.isLoading = false;
                draft.delete.data = action.payload;
            }),
        [ASYNC_MCL_GARMENT_MARKET_DELETE.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.delete.isLoading = false;
                draft.delete.error = action.payload;
            }),
        [ASYNC_MCL_GARMENT_MARKET_DELETE.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.delete.isLoading = false;
                draft.delete.data = initialState.delete.data;
                draft.delete.error = initialState.delete.error;
            }),
    },
    initialState
);
