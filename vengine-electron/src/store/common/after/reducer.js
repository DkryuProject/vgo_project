import { handleActions } from 'redux-actions';
import { produce } from 'immer';
import { asyncActionCreator, asyncAction } from 'core/utils/reduxUtil';

// 1. 각 모듈별 함수 구분을 위한 prefix 각 모듈 파일명 + '/'의 조합으로 구성
const prefix = 'common/after/';

// 2. 액션에 대해서 정의 및 액션 생성자 함수에 대해서 정의

// 공통정보 ID로 조회
export const ASYNC_COMMON_AFTER_GET_ID = asyncActionCreator(
    `${prefix}COMMON_AFTER_GET_ID`
);
export const commonAfterGetIdAsyncAction = asyncAction(
    ASYNC_COMMON_AFTER_GET_ID
);

// 공통 기준 정보 타입별 리스트 조회
export const ASYNC_COMMON_AFTER_GET_LISTS = asyncActionCreator(
    `${prefix}COMMON_AFTER_GET_LISTS`
);
export const commonAfterGetListsAsyncAction = asyncAction(
    ASYNC_COMMON_AFTER_GET_LISTS
);

// 공통 기준 정보 타입별 페이지 조회
export const ASYNC_COMMON_AFTER_GET_PAGES = asyncActionCreator(
    `${prefix}COMMON_AFTER_GET_PAGES`
);
export const commonAfterGetPagesAsyncAction = asyncAction(
    ASYNC_COMMON_AFTER_GET_PAGES
);

// 공통 정보 저장
export const ASYNC_COMMON_AFTER_POST = asyncActionCreator(
    `${prefix}COMMON_AFTER_POST`
);
export const commonAfterPostAsyncAction = asyncAction(ASYNC_COMMON_AFTER_POST);

// 4. 리듀서의 값을 정의
const initialState = {
    get: {
        id: {
            isLoading: false,
            data: null,
            error: null,
        },
        lists: {
            isLoading: false,
            data: null,
            error: null,
        },
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
export const commonAfterReducer = handleActions(
    {
        [ASYNC_COMMON_AFTER_GET_ID.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.get.id.isLoading = true;
                draft.get.id.data = initialState.get.id.data;
                draft.get.id.error = initialState.get.id.error;
            }),
        [ASYNC_COMMON_AFTER_GET_ID.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.get.id.isLoading = false;
                draft.get.id.data = action.payload;
            }),
        [ASYNC_COMMON_AFTER_GET_ID.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.get.id.isLoading = false;
                draft.get.id.data = initialState.get.id.data;
                draft.get.id.error = action.payload;
            }),

        [ASYNC_COMMON_AFTER_GET_LISTS.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.get.lists.isLoading = true;
                draft.get.lists.data = initialState.get.lists.data;
                draft.get.lists.error = initialState.get.lists.error;
            }),
        [ASYNC_COMMON_AFTER_GET_LISTS.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.get.lists.isLoading = false;
                draft.get.lists.data = action.payload;
            }),
        [ASYNC_COMMON_AFTER_GET_LISTS.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.get.lists.isLoading = false;
                draft.get.lists.data = initialState.get.lists.data;
                draft.get.lists.error = action.payload;
            }),

        [ASYNC_COMMON_AFTER_GET_LISTS.INITIAL]: (state, action) =>
            produce(state, (draft) => {
                draft.get.lists.isLoading = false;
                draft.get.lists.data = initialState.get.lists.data;
                draft.get.lists.error = initialState.get.lists.error;
            }),

        [ASYNC_COMMON_AFTER_GET_PAGES.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.get.pages.isLoading = true;
                draft.get.pages.data = initialState.get.pages.data;
                draft.get.pages.error = initialState.get.pages.error;
            }),
        [ASYNC_COMMON_AFTER_GET_PAGES.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.get.pages.isLoading = false;
                draft.get.pages.data = action.payload;
            }),
        [ASYNC_COMMON_AFTER_GET_PAGES.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.get.pages.isLoading = false;
                draft.get.pages.data = initialState.get.pages.data;
                draft.get.pages.error = action.payload;
            }),
        [ASYNC_COMMON_AFTER_GET_PAGES.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.get.pages.isLoading = false;
                draft.get.pages.data = initialState.get.pages.data;
                draft.get.pages.error = initialState.get.pages.error;
            }),
        [ASYNC_COMMON_AFTER_POST.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.post.isLoading = true;
                draft.post.data = initialState.post.data;
                draft.post.error = initialState.post.error;
            }),
        [ASYNC_COMMON_AFTER_POST.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.post.isLoading = false;
                draft.post.data = action.payload;
            }),
        [ASYNC_COMMON_AFTER_POST.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.post.isLoading = false;
                draft.post.data = initialState.post.data;
                draft.post.error = action.payload;
            }),
        [ASYNC_COMMON_AFTER_POST.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.post.isLoading = false;
                draft.post.data = initialState.post.data;
                draft.post.error = initialState.post.error;
            }),            
    },
    initialState
);
