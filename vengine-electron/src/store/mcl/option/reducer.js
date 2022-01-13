import { handleActions } from 'redux-actions';
import { produce } from 'immer';
import { asyncActionCreator, asyncAction } from 'core/utils/reduxUtil';

// 1. 각 모듈별 함수 구분을 위한 prefix 각 모듈 파일명 + '/'의 조합으로 구성
const prefix = 'mcl/option';

// 2. 액션에 대해서 정의 및 액션 생성자 함수에 대해서 정의

// mcl option 리스트 조회
export const ASYNC_MCL_OPTION_GET_LISTS = asyncActionCreator(
    `${prefix}MCL_OPTION_GET_LISTS`
);
export const mclOptionGetListsAsyncAction = asyncAction(
    ASYNC_MCL_OPTION_GET_LISTS
);

// mcl option 조회(ID)
export const ASYNC_MCL_OPTION_GET_ID = asyncActionCreator(
    `${prefix}MCL_OPTION_GET_ID`
);
export const mclOptionGetIdAsyncAction = asyncAction(ASYNC_MCL_OPTION_GET_ID);

// mcl option document 조회(ID)
export const ASYNC_MCL_OPTION_DOCUMENT_GET_ID = asyncActionCreator(
    `${prefix}MCL_OPTION_DOCUMENT_GET_ID`
);
export const mclOptionDocumentGetIdAsyncAction = asyncAction(
    ASYNC_MCL_OPTION_DOCUMENT_GET_ID
);

// mcl option 등록
export const ASYNC_MCL_OPTION_POST = asyncActionCreator(
    `${prefix}MCL_OPTION_POST`
);
export const mclOptionPostAsyncAction = asyncAction(ASYNC_MCL_OPTION_POST);

// mcl option 수정
export const ASYNC_MCL_OPTION_PUT = asyncActionCreator(
    `${prefix}MCL_OPTION_PUT`
);
export const mclOptionPutAsyncAction = asyncAction(ASYNC_MCL_OPTION_PUT);

// mcl option 수정 status
export const ASYNC_MCL_OPTION_PUT_STATUS = asyncActionCreator(
    `${prefix}MCL_OPTION_PUT_STATUS`
);
export const mclOptionPutStatusAsyncAction = asyncAction(
    ASYNC_MCL_OPTION_PUT_STATUS
);

// mcl option 삭제
export const ASYNC_MCL_OPTION_DELETE = asyncActionCreator(
    `${prefix}MCL_OPTION_DELETE`
);
export const mclOptionDeleteAsyncAction = asyncAction(ASYNC_MCL_OPTION_DELETE);

// 3. 리듀서의 값을 정의
const initialState = {
    get: {
        lists: {
            isLoading: false,
            data: null,
            error: null,
        },
        id: {
            isLoading: false,
            data: null,
            error: null,
        },
        documentId: {
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
    putStatus: {
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
export const mclOptionReducer = handleActions(
    {
        [ASYNC_MCL_OPTION_GET_LISTS.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.get.lists.isLoading = true;
                draft.get.lists.data = initialState.get.lists.data;
                draft.get.lists.error = initialState.get.lists.error;
            }),
        [ASYNC_MCL_OPTION_GET_LISTS.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.get.lists.isLoading = false;
                draft.get.lists.data = action.payload;
            }),
        [ASYNC_MCL_OPTION_GET_LISTS.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.get.lists.isLoading = false;
                draft.get.lists.error = action.payload;
            }),

        [ASYNC_MCL_OPTION_GET_ID.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.get.id.isLoading = true;
                draft.get.id.data = initialState.get.id.data;
                draft.get.id.error = initialState.get.id.error;
            }),
        [ASYNC_MCL_OPTION_GET_ID.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.get.id.isLoading = false;
                draft.get.id.data = action.payload;
            }),
        [ASYNC_MCL_OPTION_GET_ID.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.get.id.isLoading = false;
                draft.get.id.error = action.payload;
            }),
        [ASYNC_MCL_OPTION_GET_ID.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.get.id.isLoading = false;
                draft.get.id.data = initialState.get.id.data;
                draft.get.id.error = initialState.get.id.error;
            }),

        [ASYNC_MCL_OPTION_DOCUMENT_GET_ID.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.get.documentId.isLoading = true;
                draft.get.documentId.data = initialState.get.documentId.data;
                draft.get.documentId.error = initialState.get.documentId.error;
            }),
        [ASYNC_MCL_OPTION_DOCUMENT_GET_ID.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.get.documentId.isLoading = false;
                draft.get.documentId.data = action.payload;
            }),
        [ASYNC_MCL_OPTION_DOCUMENT_GET_ID.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.get.documentId.isLoading = false;
                draft.get.documentId.error = action.payload;
            }),
        [ASYNC_MCL_OPTION_DOCUMENT_GET_ID.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.get.documentId.isLoading = false;
                draft.get.documentId.data = initialState.get.documentId.data;
                draft.get.documentId.error = initialState.get.documentId.error;
            }),

        [ASYNC_MCL_OPTION_POST.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.post.isLoading = true;
                draft.post.data = initialState.post.data;
                draft.post.error = initialState.post.error;
            }),
        [ASYNC_MCL_OPTION_POST.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.post.isLoading = false;
                draft.post.data = action.payload;
            }),
        [ASYNC_MCL_OPTION_POST.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.post.isLoading = false;
                draft.post.error = action.payload;
            }),
        [ASYNC_MCL_OPTION_POST.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.post.isLoading = false;
                draft.post.data = initialState.post.data;
                draft.post.error = initialState.post.error;
            }),

        [ASYNC_MCL_OPTION_PUT.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.put.isLoading = true;
                draft.put.data = initialState.put.data;
                draft.put.error = initialState.put.error;
            }),
        [ASYNC_MCL_OPTION_PUT.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.put.isLoading = false;
                draft.put.data = action.payload;
            }),
        [ASYNC_MCL_OPTION_PUT.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.put.isLoading = false;
                draft.put.error = action.payload;
            }),
        [ASYNC_MCL_OPTION_PUT.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.put.isLoading = false;
                draft.put.data = initialState.put.data;
                draft.put.error = initialState.put.error;
            }),

        [ASYNC_MCL_OPTION_PUT_STATUS.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.putStatus.isLoading = true;
                draft.putStatus.data = initialState.putStatus.data;
                draft.putStatus.error = initialState.putStatus.error;
            }),
        [ASYNC_MCL_OPTION_PUT_STATUS.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.putStatus.isLoading = false;
                draft.putStatus.data = action.payload;
            }),
        [ASYNC_MCL_OPTION_PUT_STATUS.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.putStatus.isLoading = false;
                draft.putStatus.error = action.payload;
            }),
        [ASYNC_MCL_OPTION_PUT_STATUS.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.putStatus.isLoading = false;
                draft.putStatus.data = initialState.putStatus.data;
                draft.putStatus.error = initialState.putStatus.error;
            }),

        [ASYNC_MCL_OPTION_DELETE.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.delete.isLoading = true;
                draft.delete.data = initialState.delete.data;
                draft.delete.error = initialState.delete.error;
            }),
        [ASYNC_MCL_OPTION_DELETE.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.delete.isLoading = false;
                draft.delete.data = action.payload;
            }),
        [ASYNC_MCL_OPTION_DELETE.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.delete.isLoading = false;
                draft.delete.error = action.payload;
            }),
        [ASYNC_MCL_OPTION_DELETE.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.delete.isLoading = false;
                draft.delete.data = initialState.delete.data;
                draft.delete.error = initialState.delete.error;
            }),
    },
    initialState
);
