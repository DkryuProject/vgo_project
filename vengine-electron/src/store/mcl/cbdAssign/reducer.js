import { handleActions } from 'redux-actions';
import { produce } from 'immer';
import { asyncActionCreator, asyncAction } from 'core/utils/reduxUtil';

// 1. 각 모듈별 함수 구분을 위한 prefix 각 모듈 파일명 + '/'의 조합으로 구성
const prefix = 'mcl/cbdAssign';

// 2. 액션에 대해서 정의 및 액션 생성자 함수에 대해서 정의

// mcl cbdAssign 리스트 조회
export const ASYNC_MCL_CBD_ASSIGN_GET_LISTS = asyncActionCreator(
    `${prefix}MCL_CBD_ASSIGN_GET_LISTS`
);
export const mclCbdAssignGetListsAsyncAction = asyncAction(
    ASYNC_MCL_CBD_ASSIGN_GET_LISTS
);

// mcl cbdAssign 조회(OPTION)
export const ASYNC_MCL_CBD_ASSIGN_GET_OPTION = asyncActionCreator(
    `${prefix}MCL_CBD_ASSIGN_GET_OPTION`
);
export const mclCbdAssignGetOptionAsyncAction = asyncAction(
    ASYNC_MCL_CBD_ASSIGN_GET_OPTION
);

// mcl cbdAssign 등록
export const ASYNC_MCL_CBD_ASSIGN_POST = asyncActionCreator(
    `${prefix}MCL_CBD_ASSIGN_POST`
);
export const mclCbdAssignPostAsyncAction = asyncAction(
    ASYNC_MCL_CBD_ASSIGN_POST
);

// mcl cbdAssign 삭제
export const ASYNC_MCL_CBD_ASSIGN_DELETE = asyncActionCreator(
    `${prefix}MCL_CBD_ASSIGN_DELETE`
);
export const mclCbdAssignDeleteAsyncAction = asyncAction(
    ASYNC_MCL_CBD_ASSIGN_DELETE
);

// 3. 리듀서의 값을 정의
const initialState = {
    get: {
        lists: {
            isLoading: false,
            data: null,
            error: null,
        },
        option: {
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
    delete: {
        isLoading: false,
        data: null,
        error: null,
    },
};

// 4. 리듀서를 정의
export const mclCbdAssignReducer = handleActions(
    {
        [ASYNC_MCL_CBD_ASSIGN_GET_LISTS.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.get.lists.isLoading = true;
                draft.get.lists.data = initialState.get.lists.data;
                draft.get.lists.error = initialState.get.lists.error;
            }),
        [ASYNC_MCL_CBD_ASSIGN_GET_LISTS.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.get.lists.isLoading = false;
                draft.get.lists.data = action.payload;
            }),
        [ASYNC_MCL_CBD_ASSIGN_GET_LISTS.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.get.lists.isLoading = false;
                draft.get.lists.error = action.payload;
            }),

        [ASYNC_MCL_CBD_ASSIGN_GET_OPTION.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.get.option.isLoading = true;
                draft.get.option.data = initialState.get.option.data;
                draft.get.option.error = initialState.get.option.error;
            }),
        [ASYNC_MCL_CBD_ASSIGN_GET_OPTION.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.get.option.isLoading = false;
                draft.get.option.data = action.payload;
            }),
        [ASYNC_MCL_CBD_ASSIGN_GET_OPTION.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.get.option.isLoading = false;
                draft.get.option.error = action.payload;
            }),
        [ASYNC_MCL_CBD_ASSIGN_GET_OPTION.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.get.option.isLoading = false;
                draft.get.option.data = initialState.get.option.data;
                draft.get.option.error = initialState.get.option.error;
            }),

        [ASYNC_MCL_CBD_ASSIGN_POST.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.post.isLoading = true;
                draft.post.data = initialState.post.data;
                draft.post.error = initialState.post.error;
            }),
        [ASYNC_MCL_CBD_ASSIGN_POST.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.post.isLoading = false;
                draft.post.data = action.payload;
            }),
        [ASYNC_MCL_CBD_ASSIGN_POST.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.post.isLoading = false;
                draft.post.error = action.payload;
            }),
        [ASYNC_MCL_CBD_ASSIGN_POST.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.post.isLoading = false;
                draft.post.data = initialState.post.data;
                draft.post.error = initialState.post.error;
            }),

        [ASYNC_MCL_CBD_ASSIGN_DELETE.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.delete.isLoading = true;
                draft.delete.data = initialState.delete.data;
                draft.delete.error = initialState.delete.error;
            }),
        [ASYNC_MCL_CBD_ASSIGN_DELETE.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.delete.isLoading = false;
                draft.delete.data = action.payload;
            }),
        [ASYNC_MCL_CBD_ASSIGN_DELETE.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.delete.isLoading = false;
                draft.delete.error = action.payload;
            }),
        [ASYNC_MCL_CBD_ASSIGN_DELETE.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.delete.isLoading = false;
                draft.delete.data = initialState.delete.data;
                draft.delete.error = initialState.delete.error;
            }),
    },
    initialState
);
