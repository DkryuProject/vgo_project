import { handleActions } from 'redux-actions';
import { produce } from 'immer';
import { asyncActionCreator, asyncAction } from 'core/utils/reduxUtil';

// 1. 각 모듈별 함수 구분을 위한 prefix 각 모듈 파일명 + '/'의 조합으로 구성
const prefix = 'material/option';

// 2. 액션에 대해서 정의 및 액션 생성자 함수에 대해서 정의

// 자재 OPTION 리스트 조회
export const ASYNC_MATERIAL_OPTION_GET_LISTS = asyncActionCreator(
    `${prefix}MATERIAL_OPTION_GET_LISTS`
);
export const materialOptionGetListsAsyncAction = asyncAction(
    ASYNC_MATERIAL_OPTION_GET_LISTS
);

// 자재 OPTION 페이지 조회
export const ASYNC_MATERIAL_OPTION_GET_PAGES = asyncActionCreator(
    `${prefix}MATERIAL_OPTION_GET_PAGES`
);
export const materialOptionGetPagesAsyncAction = asyncAction(
    ASYNC_MATERIAL_OPTION_GET_PAGES
);

// 자재 OPTION 조회(ID)
export const ASYNC_MATERIAL_OPTION_GET_ID = asyncActionCreator(
    `${prefix}MATERIAL_OPTION_GET_ID`
);
export const materialOptionGetIdAsyncAction = asyncAction(
    ASYNC_MATERIAL_OPTION_GET_ID
);

// 자재 OPTION 조회(INFO ID)
export const ASYNC_MATERIAL_OPTION_GET_INFO_ID = asyncActionCreator(
    `${prefix}MATERIAL_OPTION_GET_INFO_ID`
);
export const materialOptionGetInfoIdAsyncAction = asyncAction(
    ASYNC_MATERIAL_OPTION_GET_INFO_ID
);

// 자재 OPTION 등록
export const ASYNC_MATERIAL_OPTION_POST = asyncActionCreator(
    `${prefix}MATERIAL_OPTION_POST`
);
export const materialOptionPostAsyncAction = asyncAction(
    ASYNC_MATERIAL_OPTION_POST
);

// 자재 OPTION 삭제(수정)
export const ASYNC_MATERIAL_OPTION_PUT_DELETE = asyncActionCreator(
    `${prefix}MATERIAL_OPTION_PUT_DELETE`
);
export const materialOptionPutDeleteAsyncAction = asyncAction(
    ASYNC_MATERIAL_OPTION_PUT_DELETE
);

// 3. 리듀서의 값을 정의
const initialState = {
    get: {
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
        id: {
            isLoading: false,
            data: null,
            error: null,
        },
        infoId: {
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
        delete: {
            isLoading: false,
            data: null,
            error: null,
        },
    },
};

// 4. 리듀서를 정의
export const materialOptionReducer = handleActions(
    {
        [ASYNC_MATERIAL_OPTION_GET_LISTS.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.get.lists.isLoading = true;
                draft.get.lists.data = initialState.get.lists.data;
                draft.get.lists.error = initialState.get.lists.error;
            }),
        [ASYNC_MATERIAL_OPTION_GET_LISTS.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.get.lists.isLoading = false;
                draft.get.lists.data = action.payload;
            }),
        [ASYNC_MATERIAL_OPTION_GET_LISTS.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.get.lists.isLoading = false;
                draft.get.lists.error = action.payload;
            }),

        [ASYNC_MATERIAL_OPTION_GET_PAGES.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.get.pages.isLoading = true;
                draft.get.pages.data = initialState.get.pages.data;
                draft.get.pages.error = initialState.get.pages.error;
            }),
        [ASYNC_MATERIAL_OPTION_GET_PAGES.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.get.pages.isLoading = false;
                draft.get.pages.data = action.payload;
            }),
        [ASYNC_MATERIAL_OPTION_GET_PAGES.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.get.pages.isLoading = false;
                draft.get.pages.error = action.payload;
            }),

        [ASYNC_MATERIAL_OPTION_GET_ID.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.get.id.isLoading = true;
                draft.get.id.data = initialState.get.id.data;
                draft.get.id.error = initialState.get.id.error;
            }),
        [ASYNC_MATERIAL_OPTION_GET_ID.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.get.id.isLoading = false;
                draft.get.id.data = action.payload;
            }),
        [ASYNC_MATERIAL_OPTION_GET_ID.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.get.id.isLoading = false;
                draft.get.id.error = action.payload;
            }),
        [ASYNC_MATERIAL_OPTION_GET_ID.INITIAL]: (state, action) =>
            produce(state, (draft) => {
                draft.get.id.isLoading = false;
                draft.get.id.data = initialState.get.id.data;
                draft.get.id.error = initialState.get.id.error;
            }),

        [ASYNC_MATERIAL_OPTION_GET_INFO_ID.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.get.infoId.isLoading = true;
                draft.get.infoId.data = initialState.get.infoId.data;
                draft.get.infoId.error = initialState.get.infoId.error;
            }),
        [ASYNC_MATERIAL_OPTION_GET_INFO_ID.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.get.infoId.isLoading = false;
                draft.get.infoId.data = action.payload;
            }),
        [ASYNC_MATERIAL_OPTION_GET_INFO_ID.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.get.infoId.isLoading = false;
                draft.get.infoId.error = action.payload;
            }),

        [ASYNC_MATERIAL_OPTION_GET_INFO_ID.INITIAL]: (state, action) =>
            produce(state, (draft) => {
                draft.get.infoId.isLoading = false;
                draft.get.infoId.data = initialState.get.infoId.data;
                draft.get.infoId.error = initialState.get.infoId.error;
            }),

        [ASYNC_MATERIAL_OPTION_POST.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.post.isLoading = true;
                draft.post.data = initialState.post.data;
                draft.post.error = initialState.post.error;
            }),
        [ASYNC_MATERIAL_OPTION_POST.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.post.isLoading = false;
                draft.post.data = action.payload;
            }),
        [ASYNC_MATERIAL_OPTION_POST.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.post.isLoading = false;
                draft.post.error = action.payload;
            }),
        [ASYNC_MATERIAL_OPTION_POST.INITIAL]: (state, action) =>
            produce(state, (draft) => {
                draft.post.isLoading = false;
                draft.post.data = initialState.post.data;
                draft.post.error = initialState.post.error;
            }),

        [ASYNC_MATERIAL_OPTION_PUT_DELETE.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.put.delete.isLoading = true;
                draft.put.delete.data = initialState.put.delete.data;
                draft.put.delete.error = initialState.put.delete.error;
            }),
        [ASYNC_MATERIAL_OPTION_PUT_DELETE.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.put.delete.isLoading = false;
                draft.put.delete.data = action.payload;
            }),
        [ASYNC_MATERIAL_OPTION_PUT_DELETE.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.put.delete.isLoading = false;
                draft.put.delete.error = action.payload;
            }),
        [ASYNC_MATERIAL_OPTION_PUT_DELETE.INITIAL]: (state, action) =>
            produce(state, (draft) => {
                draft.put.delete.isLoading = false;
                draft.put.delete.data = initialState.put.delete.data;
                draft.put.delete.error = initialState.put.delete.error;
            }),
    },
    initialState
);
