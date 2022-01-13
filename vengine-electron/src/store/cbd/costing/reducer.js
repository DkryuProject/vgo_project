import { handleActions } from 'redux-actions';
import { produce } from 'immer';
import { asyncActionCreator, asyncAction } from 'core/utils/reduxUtil';

// 1. 각 모듈별 함수 구분을 위한 prefix 각 모듈 파일명 + '/'의 조합으로 구성
const prefix = 'cbd/costing';

// 2. 액션에 대해서 정의 및 액션 생성자 함수에 대해서 정의

// cbd costing 페이지 조회
export const ASYNC_CBD_COSTING_GET_PAGES = asyncActionCreator(
    `${prefix}CBD_COSTING_GET_PAGES`
);
export const cbdCostingGetPagesAsyncAction = asyncAction(
    ASYNC_CBD_COSTING_GET_PAGES
);

// cbd costing 리스트 조회
export const ASYNC_CBD_COSTING_GET_LISTS = asyncActionCreator(
    `${prefix}CBD_COSTING_GET_LISTS`
);
export const cbdCostingGetListsAsyncAction = asyncAction(
    ASYNC_CBD_COSTING_GET_LISTS
);

// cbd costing 조회(ID)
export const ASYNC_CBD_COSTING_GET_ID = asyncActionCreator(
    `${prefix}CBD_COSTING_GET_ID`
);
export const cbdCostingGetIdAsyncAction = asyncAction(ASYNC_CBD_COSTING_GET_ID);

// cbd costing 등록
export const ASYNC_CBD_COSTING_POST = asyncActionCreator(
    `${prefix}CBD_COSTING_POST`
);
export const cbdCostingPostAsyncAction = asyncAction(ASYNC_CBD_COSTING_POST);

// cbd costing 삭제
export const ASYNC_CBD_COSTING_DELETE = asyncActionCreator(
    `${prefix}CBD_COSTING_DELETE`
);
export const cbdCostingDeleteAsyncAction = asyncAction(
    ASYNC_CBD_COSTING_DELETE
);

// 3. 리듀서의 값을 정의
const initialState = {
    get: {
        lists: {
            direct: {
                isLoading: false,
                data: null,
                error: null,
            },
            indirect: {
                isLoading: false,
                data: null,
                error: null,
            },
        },
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
    delete: {
        isLoading: false,
        data: null,
        error: null,
    },
};

// 4. 리듀서를 정의
export const cbdCostingReducer = handleActions(
    {
        [ASYNC_CBD_COSTING_GET_LISTS.REQUEST]: (state, action) =>
            produce(state, (draft) => {
                const { type } = action.payload;
                draft.get.lists[type].isLoading = true;
                draft.get.lists[type].data = initialState.get.lists[type].data;
                draft.get.lists[type].error =
                    initialState.get.lists[type].error;
            }),
        [ASYNC_CBD_COSTING_GET_LISTS.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                const { type, data } = action.payload;
                draft.get.lists[type].isLoading = false;
                draft.get.lists[type].data = data;
            }),
        [ASYNC_CBD_COSTING_GET_LISTS.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                const { type, error } = action.payload;
                draft.get.lists[type].isLoading = false;
                draft.get.lists[type].error = error;
            }),
        [ASYNC_CBD_COSTING_GET_LISTS.INITIAL]: (state, action) =>
            produce(state, (draft) => {
                Object.keys(draft.get.lists).map((v) => {
                    draft.get.lists[v].isLoading = false;
                    draft.get.lists[v].data = initialState.get.lists[v].data;
                    draft.get.lists[v].error = initialState.get.lists[v].error;
                    return true;
                });
            }),

        [ASYNC_CBD_COSTING_GET_ID.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.get.id.isLoading = true;
                draft.get.id.data = initialState.get.id.data;
                draft.get.id.error = initialState.get.id.error;
            }),
        [ASYNC_CBD_COSTING_GET_ID.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.get.id.isLoading = false;
                draft.get.id.data = action.payload;
            }),
        [ASYNC_CBD_COSTING_GET_ID.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.get.id.isLoading = false;
                draft.get.id.error = action.payload;
            }),
        [ASYNC_CBD_COSTING_GET_ID.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.get.id.isLoading = false;
                draft.get.id.data = initialState.get.id.data;
                draft.get.id.error = initialState.get.id.error;
            }),

        [ASYNC_CBD_COSTING_POST.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.post.isLoading = true;
                draft.post.data = initialState.post.data;
                draft.post.error = initialState.post.error;
            }),
        [ASYNC_CBD_COSTING_POST.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.post.isLoading = false;
                draft.post.data = action.payload;
            }),
        [ASYNC_CBD_COSTING_POST.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.post.isLoading = false;
                draft.post.error = action.payload;
            }),
        [ASYNC_CBD_COSTING_POST.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.post.isLoading = false;
                draft.post.data = initialState.post.data;
                draft.post.error = initialState.post.error;
            }),

        [ASYNC_CBD_COSTING_DELETE.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.delete.isLoading = true;
                draft.delete.data = initialState.delete.data;
                draft.delete.error = initialState.delete.error;
            }),
        [ASYNC_CBD_COSTING_DELETE.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.delete.isLoading = false;
                draft.delete.data = action.payload;
            }),
        [ASYNC_CBD_COSTING_DELETE.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.delete.isLoading = false;
                draft.delete.error = action.payload;
            }),
        [ASYNC_CBD_COSTING_DELETE.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.delete.isLoading = false;
                draft.delete.data = initialState.delete.data;
                draft.delete.error = initialState.delete.error;
            }),
    },
    initialState
);
