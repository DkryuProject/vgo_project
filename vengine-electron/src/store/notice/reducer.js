import { handleActions } from 'redux-actions';
import { produce } from 'immer';
import { asyncActionCreator, asyncAction } from 'core/utils/reduxUtil';

// 1. 각 모듈별 함수 구분을 위한 prefix 각 모듈 파일명 + '/'의 조합으로 구성
const prefix = 'notice/';

// 2. 액션에 대해서 정의 및 액션 생성자 함수에 대해서 정의
// 조회
export const ASYNC_NOTICE_GET_PAGES = asyncActionCreator(
    `${prefix}NOTICE_GET_PAGES`
);
export const noticeGetPagesAsyncAction = asyncAction(ASYNC_NOTICE_GET_PAGES);

// 생성
export const ASYNC_NOTICE_POST = asyncActionCreator(`${prefix}NOTICE_POST`);
export const noticePostAsyncAction = asyncAction(ASYNC_NOTICE_POST);

// 수정
export const ASYNC_NOTICE_PUT = asyncActionCreator(`${prefix}NOTICE_PUT`);
export const noticePutAsyncAction = asyncAction(ASYNC_NOTICE_PUT);

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
    put: {
        isLoading: false,
        data: null,
        error: null,
    },
};

// 4. 리듀서를 정의
export const noticeReducer = handleActions(
    {
        [ASYNC_NOTICE_GET_PAGES.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.get.pages.isLoading = true;
                draft.get.pages.data = initialState.get.pages.data;
                draft.get.pages.error = initialState.get.pages.error;
            }),
        [ASYNC_NOTICE_GET_PAGES.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.get.pages.isLoading = false;
                draft.get.pages.data = action.payload;
                draft.get.pages.error = initialState.get.pages.error;
            }),
        [ASYNC_NOTICE_GET_PAGES.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.get.pages.isLoading = false;
                draft.get.pages.data = initialState.get.pages.data;
                draft.get.pages.error = action.payload;
            }),

        [ASYNC_NOTICE_GET_PAGES.INITIAL]: (state, action) =>
            produce(state, (draft) => {
                draft.get.pages.isLoading = false;
                draft.get.pages.data = initialState.get.pages.data;
                draft.get.pages.error = initialState.get.pages.error;
            }),

        [ASYNC_NOTICE_POST.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.post.isLoading = true;
                draft.post.data = initialState.post.data;
                draft.post.error = initialState.post.error;
            }),
        [ASYNC_NOTICE_POST.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.post.isLoading = false;
                draft.post.data = action.payload;
                draft.post.error = initialState.post.error;
            }),
        [ASYNC_NOTICE_POST.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.post.isLoading = false;
                draft.post.data = initialState.post.data;
                draft.post.error = action.payload;
            }),

        [ASYNC_NOTICE_POST.INITIAL]: (state, action) =>
            produce(state, (draft) => {
                draft.post.isLoading = false;
                draft.post.data = initialState.post.data;
                draft.post.error = initialState.post.error;
            }),

        [ASYNC_NOTICE_PUT.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.put.isLoading = true;
                draft.put.data = initialState.put.data;
                draft.put.error = initialState.put.error;
            }),
        [ASYNC_NOTICE_PUT.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.put.isLoading = false;
                draft.put.data = action.payload;
                draft.put.error = initialState.put.error;
            }),
        [ASYNC_NOTICE_PUT.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.put.isLoading = false;
                draft.put.data = initialState.put.data;
                draft.put.error = action.payload;
            }),

        [ASYNC_NOTICE_PUT.INITIAL]: (state, action) =>
            produce(state, (draft) => {
                draft.put.isLoading = false;
                draft.put.data = initialState.put.data;
                draft.put.error = initialState.put.error;
            }),
    },
    initialState
);
