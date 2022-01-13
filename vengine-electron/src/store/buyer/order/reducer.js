import { handleActions } from 'redux-actions';
import { produce } from 'immer';
import { asyncActionCreator, asyncAction } from 'core/utils/reduxUtil';

// 1. 각 모듈별 함수 구분을 위한 prefix 각 모듈 파일명 + '/'의 조합으로 구성
const prefix = 'buyer/order';

// 2. 액션에 대해서 정의 및 액션 생성자 함수에 대해서 정의

// buyer order 페이지 조회
export const ASYNC_BUYER_ORDER_GET_PAGES = asyncActionCreator(
    `${prefix}BUYER_ORDER_GET_PAGES`
);
export const buyerOrderGetPagesAsyncAction = asyncAction(
    ASYNC_BUYER_ORDER_GET_PAGES
);

// buyer order ID 조회
export const ASYNC_BUYER_ORDER_GET_ID = asyncActionCreator(
    `${prefix}BUYER_ORDER_GET_ID`
);
export const buyerOrderGetIdAsyncAction = asyncAction(ASYNC_BUYER_ORDER_GET_ID);

// buyer order SEARCH 조회
export const ASYNC_BUYER_ORDER_GET_SEARCH = asyncActionCreator(
    `${prefix}BUYER_ORDER_GET_SEARCH`
);
export const buyerOrderGetSearchAsyncAction = asyncAction(
    ASYNC_BUYER_ORDER_GET_SEARCH
);

// buyer order po 저장
export const ASYNC_BUYER_ORDER_POST_EXCEL_UPLOAD = asyncActionCreator(
    `${prefix}BUYER_ORDER_POST_EXCEL_UPLOAD`
);
export const buyerOrderPostExcelUploadAsyncAction = asyncAction(
    ASYNC_BUYER_ORDER_POST_EXCEL_UPLOAD
);

// 3. 리듀서의 값을 정의
const initialState = {
    get: {
        pages: {
            isLoading: false,
            data: null,
            error: null,
        },
        id: {
            isLoading: false,
            data: null,
            error: null,
        },
        search: {
            isLoading: false,
            data: null,
            error: null,
        },
    },
    post: {
        excelUpload: {
            isLoading: false,
            data: null,
            error: null,
        },
    },
};

// 4. 리듀서를 정의
export const buyerOrderReducer = handleActions(
    {
        [ASYNC_BUYER_ORDER_GET_PAGES.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.get.pages.isLoading = true;
                draft.get.pages.data = initialState.get.pages.data;
                draft.get.pages.error = initialState.get.pages.error;
            }),
        [ASYNC_BUYER_ORDER_GET_PAGES.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.get.pages.isLoading = false;
                draft.get.pages.data = action.payload;
            }),
        [ASYNC_BUYER_ORDER_GET_PAGES.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.get.pages.isLoading = false;
                draft.get.pages.error = action.payload;
            }),

        [ASYNC_BUYER_ORDER_GET_ID.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.get.id.isLoading = true;
                draft.get.id.data = initialState.get.id.data;
                draft.get.id.error = initialState.get.id.error;
            }),
        [ASYNC_BUYER_ORDER_GET_ID.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.get.id.isLoading = false;
                draft.get.id.data = action.payload;
            }),
        [ASYNC_BUYER_ORDER_GET_ID.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.get.id.isLoading = false;
                draft.get.id.error = action.payload;
            }),

        [ASYNC_BUYER_ORDER_GET_SEARCH.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.get.search.isLoading = true;
                draft.get.search.data = initialState.get.search.data;
                draft.get.search.error = initialState.get.search.error;
            }),
        [ASYNC_BUYER_ORDER_GET_SEARCH.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.get.search.isLoading = false;
                draft.get.search.data = action.payload;
            }),
        [ASYNC_BUYER_ORDER_GET_SEARCH.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.get.search.isLoading = false;
                draft.get.search.error = action.payload;
            }),

        [ASYNC_BUYER_ORDER_GET_SEARCH.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.get.search.isLoading = false;
                draft.get.search.data = initialState.get.search.data;
                draft.get.search.error = initialState.get.search.error;
            }),

        [ASYNC_BUYER_ORDER_POST_EXCEL_UPLOAD.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.post.excelUpload.isLoading = true;
                draft.post.excelUpload.data =
                    initialState.post.excelUpload.data;
                draft.post.excelUpload.error =
                    initialState.post.excelUpload.error;
            }),
        [ASYNC_BUYER_ORDER_POST_EXCEL_UPLOAD.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.post.excelUpload.isLoading = false;
                draft.post.excelUpload.data = action.payload;
            }),
        [ASYNC_BUYER_ORDER_POST_EXCEL_UPLOAD.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.post.excelUpload.isLoading = false;
                draft.post.excelUpload.error = action.payload;
            }),

        [ASYNC_BUYER_ORDER_POST_EXCEL_UPLOAD.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.post.excelUpload.isLoading = false;
                draft.post.excelUpload.data =
                    initialState.post.excelUpload.data;
                draft.post.excelUpload.error =
                    initialState.post.excelUpload.error;
            }),
    },
    initialState
);
