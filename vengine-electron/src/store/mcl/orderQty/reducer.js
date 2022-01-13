import { handleActions } from 'redux-actions';
import { produce } from 'immer';
import { asyncActionCreator, asyncAction } from 'core/utils/reduxUtil';

// 1. 각 모듈별 함수 구분을 위한 prefix 각 모듈 파일명 + '/'의 조합으로 구성
const prefix = 'mcl/orderQty';

// 2. 액션에 대해서 정의 및 액션 생성자 함수에 대해서 정의

// mcl po qty 페이지 조회
export const ASYNC_MCL_ORDER_QTY_GET_ID = asyncActionCreator(
    `${prefix}MCL_ORDER_QTY_GET_ID`
);
export const mclOrderQtyGetIdAsyncAction = asyncAction(
    ASYNC_MCL_ORDER_QTY_GET_ID
);

// mcl po qty 페이지 등록
export const ASYNC_MCL_ORDER_QTY_POST = asyncActionCreator(
    `${prefix}MCL_ORDER_QTY_POST`
);
export const mclOrderQtyPostAsyncAction = asyncAction(ASYNC_MCL_ORDER_QTY_POST);

// 3. 리듀서의 값을 정의
const initialState = {
    get: {
        id: {
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
export const mclOrderQtyReducer = handleActions(
    {
        [ASYNC_MCL_ORDER_QTY_GET_ID.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.get.id.isLoading = true;
                draft.get.id.data = initialState.get.id.data;
                draft.get.id.error = initialState.get.id.error;
            }),
        [ASYNC_MCL_ORDER_QTY_GET_ID.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.get.id.isLoading = false;
                draft.get.id.data = action.payload;
            }),
        [ASYNC_MCL_ORDER_QTY_GET_ID.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.get.id.isLoading = false;
                draft.get.id.error = action.payload;
            }),
        [ASYNC_MCL_ORDER_QTY_GET_ID.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.get.id.isLoading = initialState.get.id.isLoading;
                draft.get.id.data = initialState.get.id.data;
                draft.get.id.error = initialState.get.id.error;
            }),

        [ASYNC_MCL_ORDER_QTY_POST.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.post.isLoading = true;
                draft.post.data = initialState.post.data;
                draft.post.error = initialState.post.error;
            }),
        [ASYNC_MCL_ORDER_QTY_POST.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.post.isLoading = false;
                draft.post.data = action.payload;
            }),
        [ASYNC_MCL_ORDER_QTY_POST.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.post.isLoading = false;
                draft.post.error = action.payload;
            }),
        [ASYNC_MCL_ORDER_QTY_POST.INITIAL]: (state, action) =>
            produce(state, (draft) => {
                draft.post.isLoading = false;
                draft.post.data = initialState.post.data;
                draft.post.error = initialState.post.error;
            }),
    },
    initialState
);
