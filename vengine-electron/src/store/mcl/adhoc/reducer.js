import { handleActions } from 'redux-actions';
import { produce } from 'immer';
import { asyncActionCreator, asyncAction } from 'core/utils/reduxUtil';

// 1. 각 모듈별 함수 구분을 위한 prefix 각 모듈 파일명 + '/'의 조합으로 구성
const prefix = 'mcl/adhoc';

// 2. 액션에 대해서 정의 및 액션 생성자 함수에 대해서 정의

// mcl adhoc 페이지 조회
export const ASYNC_MCL_ADHOC_GET_PAGES = asyncActionCreator(
    `${prefix}MCL_ADHOC_GET_PAGES`
);
export const mclAdhocGetPagesAsyncAction = asyncAction(
    ASYNC_MCL_ADHOC_GET_PAGES
);

// mcl adhoc id 조회
export const ASYNC_MCL_ADHOC_GET_ID = asyncActionCreator(
    `${prefix}MCL_ADHOC_GET_ID`
);
export const mclAdhocGetIdAsyncAction = asyncAction(ASYNC_MCL_ADHOC_GET_ID);

// mcl adhoc 등록
export const ASYNC_MCL_ADHOC_POST_ID = asyncActionCreator(
    `${prefix}MCL_ADHOC_POST_ID`
);
export const mclAdhocPostIdAsyncAction = asyncAction(ASYNC_MCL_ADHOC_POST_ID);

// mcl adhoc 리오더
export const ASYNC_MCL_ADHOC_POST_REORDER_ID = asyncActionCreator(
    `${prefix}MCL_ADHOC_POST_REORDER_ID`
);
export const mclAdhocPostReorderIdAsyncAction = asyncAction(
    ASYNC_MCL_ADHOC_POST_REORDER_ID
);

// mcl adhoc 자재생성
export const ASYNC_MCL_ADHOC_POST_MATERIAL = asyncActionCreator(
    `${prefix}MCL_ADHOC_POST_MATERIAL`
);
export const mclAdhocPostMaterialAsyncAction = asyncAction(
    ASYNC_MCL_ADHOC_POST_MATERIAL
);

// mcl adhoc email
export const ASYNC_MCL_ADHOC_POST_EMAIL = asyncActionCreator(
    `${prefix}MCL_ADHOC_POST_EMAIL`
);
export const mclAdhocPostEmailAsyncAction = asyncAction(
    ASYNC_MCL_ADHOC_POST_EMAIL
);

// mcl adhoc cancel
export const ASYNC_MCL_ADHOC_PUT_CANCELED = asyncActionCreator(
    `${prefix}MCL_ADHOC_PUT_CANCELED`
);
export const mclAdhocPutCanceledAsyncAction = asyncAction(
    ASYNC_MCL_ADHOC_PUT_CANCELED
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
    },
    post: {
        id: {
            isLoading: false,
            data: null,
            error: null,
        },
        reorderId: {
            isLoading: false,
            data: null,
            error: null,
        },
        material: {
            isLoading: false,
            data: null,
            error: null,
        },
        email: {
            isLoading: false,
            data: null,
            error: null,
        },
    },
    put: {
        canceled: {
            isLoading: false,
            data: null,
            error: null,
        },
    },
};

// 4. 리듀서를 정의
export const mclAdhocReducer = handleActions(
    {
        [ASYNC_MCL_ADHOC_GET_PAGES.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.get.pages.isLoading = true;
                draft.get.pages.data = initialState.get.pages.data;
                draft.get.pages.error = initialState.get.pages.error;
            }),
        [ASYNC_MCL_ADHOC_GET_PAGES.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.get.pages.isLoading = false;
                draft.get.pages.data = action.payload;
            }),
        [ASYNC_MCL_ADHOC_GET_PAGES.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.get.pages.isLoading = false;
                draft.get.pages.error = action.payload;
            }),

        [ASYNC_MCL_ADHOC_GET_ID.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.get.id.isLoading = true;
                draft.get.id.data = initialState.get.id.data;
                draft.get.id.error = initialState.get.id.error;
            }),
        [ASYNC_MCL_ADHOC_GET_ID.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.get.id.isLoading = false;
                draft.get.id.data = action.payload;
            }),
        [ASYNC_MCL_ADHOC_GET_ID.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.get.id.isLoading = false;
                draft.get.id.error = action.payload;
            }),
        [ASYNC_MCL_ADHOC_GET_ID.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.get.id.isLoading = false;
                draft.get.id.data = initialState.get.id.data;
                draft.get.id.error = initialState.get.id.error;
            }),

        [ASYNC_MCL_ADHOC_POST_ID.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.post.id.isLoading = true;
                draft.post.id.data = initialState.post.id.data;
                draft.post.id.error = initialState.post.id.error;
            }),
        [ASYNC_MCL_ADHOC_POST_ID.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.post.id.isLoading = false;
                draft.post.id.data = action.payload;
            }),
        [ASYNC_MCL_ADHOC_POST_ID.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.post.id.isLoading = false;
                draft.post.id.error = action.payload;
            }),
        [ASYNC_MCL_ADHOC_POST_ID.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.post.id.isLoading = false;
                draft.post.id.data = initialState.post.id.data;
                draft.post.id.error = initialState.post.id.error;
            }),

        [ASYNC_MCL_ADHOC_POST_REORDER_ID.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.post.reorderId.isLoading = true;
                draft.post.reorderId.data = initialState.post.reorderId.data;
                draft.post.reorderId.error = initialState.post.reorderId.error;
            }),
        [ASYNC_MCL_ADHOC_POST_REORDER_ID.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.post.reorderId.isLoading = false;
                draft.post.reorderId.data = action.payload;
            }),
        [ASYNC_MCL_ADHOC_POST_REORDER_ID.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.post.reorderId.isLoading = false;
                draft.post.reorderId.error = action.payload;
            }),
        [ASYNC_MCL_ADHOC_POST_REORDER_ID.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.post.reorderId.isLoading = false;
                draft.post.reorderId.data = initialState.post.reorderId.data;
                draft.post.reorderId.error = initialState.post.reorderId.error;
            }),

        [ASYNC_MCL_ADHOC_POST_MATERIAL.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.post.material.isLoading = true;
                draft.post.material.data = initialState.post.material.data;
                draft.post.material.error = initialState.post.material.error;
            }),
        [ASYNC_MCL_ADHOC_POST_MATERIAL.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.post.material.isLoading = false;
                draft.post.material.data = action.payload;
            }),
        [ASYNC_MCL_ADHOC_POST_MATERIAL.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.post.material.isLoading = false;
                draft.post.material.error = action.payload;
            }),
        [ASYNC_MCL_ADHOC_POST_MATERIAL.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.post.material.isLoading = false;
                draft.post.material.data = initialState.post.material.data;
                draft.post.material.error = initialState.post.material.error;
            }),

        [ASYNC_MCL_ADHOC_POST_EMAIL.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.post.email.isLoading = true;
                draft.post.email.data = initialState.post.email.data;
                draft.post.email.error = initialState.post.email.error;
            }),
        [ASYNC_MCL_ADHOC_POST_EMAIL.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.post.email.isLoading = false;
                draft.post.email.data = action.payload;
            }),
        [ASYNC_MCL_ADHOC_POST_EMAIL.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.post.email.isLoading = false;
                draft.post.email.error = action.payload;
            }),
        [ASYNC_MCL_ADHOC_POST_EMAIL.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.post.email.isLoading = false;
                draft.post.email.data = initialState.post.email.data;
                draft.post.email.error = initialState.post.email.error;
            }),

        [ASYNC_MCL_ADHOC_PUT_CANCELED.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.put.canceled.isLoading = true;
                draft.put.canceled.data = initialState.put.canceled.data;
                draft.put.canceled.error = initialState.put.canceled.error;
            }),
        [ASYNC_MCL_ADHOC_PUT_CANCELED.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.put.canceled.isLoading = false;
                draft.put.canceled.data = action.payload;
            }),
        [ASYNC_MCL_ADHOC_PUT_CANCELED.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.put.canceled.isLoading = false;
                draft.put.canceled.error = action.payload;
            }),
        [ASYNC_MCL_ADHOC_PUT_CANCELED.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.put.canceled.isLoading = false;
                draft.put.canceled.data = initialState.put.canceled.data;
                draft.put.canceled.error = initialState.put.canceled.error;
            }),
    },
    initialState
);
