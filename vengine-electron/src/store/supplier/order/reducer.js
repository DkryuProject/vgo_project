import { handleActions } from 'redux-actions';
import { produce } from 'immer';
import { asyncActionCreator, asyncAction } from 'core/utils/reduxUtil';

// 1. 각 모듈별 함수 구분을 위한 prefix 각 모듈 파일명 + '/'의 조합으로 구성
const prefix = 'supplier/order';

// 2. 액션에 대해서 정의 및 액션 생성자 함수에 대해서 정의

// supplier order 페이지 조회
export const ASYNC_SUPPLIER_ORDER_GET_PAGES = asyncActionCreator(
    `${prefix}SUPPLIER_ORDER_GET_PAGES`
);
export const supplierOrderGetPagesAsyncAction = asyncAction(
    ASYNC_SUPPLIER_ORDER_GET_PAGES
);

// supplier order confirm of revert
export const ASYNC_SUPPLIER_ORDER_POST = asyncActionCreator(
    `${prefix}SUPPLIER_ORDER_POST`
);
export const supplierOrderPostAsyncAction = asyncAction(
    ASYNC_SUPPLIER_ORDER_POST
);

// 3. 리듀서의 값을 정의
const initialState = {
    get: {
        pages: {
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
};

// 4. 리듀서를 정의
export const supplierOrderReducer = handleActions(
    {
        [ASYNC_SUPPLIER_ORDER_GET_PAGES.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.get.pages.isLoading = true;
                draft.get.pages.data = initialState.get.pages.data;
                draft.get.pages.error = initialState.get.pages.error;
            }),
        [ASYNC_SUPPLIER_ORDER_GET_PAGES.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.get.pages.isLoading = false;
                draft.get.pages.data = action.payload;
            }),
        [ASYNC_SUPPLIER_ORDER_GET_PAGES.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.get.pages.isLoading = false;
                draft.get.pages.error = action.payload;
            }),

        [ASYNC_SUPPLIER_ORDER_POST.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.post.isLoading = true;
                draft.post.data = initialState.post.data;
                draft.post.error = initialState.post.error;
            }),
        [ASYNC_SUPPLIER_ORDER_POST.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.post.isLoading = false;
                draft.post.data = action.payload;
            }),
        [ASYNC_SUPPLIER_ORDER_POST.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.post.isLoading = false;
                draft.post.error = action.payload;
            }),

        [ASYNC_SUPPLIER_ORDER_POST.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.post.isLoading = false;
                draft.post.data = initialState.post.data;
                draft.post.error = initialState.post.error;
            }),
    },
    initialState
);
