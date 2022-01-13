import { handleActions } from 'redux-actions';
import { produce } from 'immer';
import { asyncActionCreator, asyncAction } from 'core/utils/reduxUtil';

// 1. 각 모듈별 함수 구분을 위한 prefix 각 모듈 파일명 + '/'의 조합으로 구성
const prefix = 'cbd/option';

// 2. 액션에 대해서 정의 및 액션 생성자 함수에 대해서 정의

// cbd option 페이지 조회
export const ASYNC_CBD_OPTION_GET_PAGES = asyncActionCreator(
    `${prefix}CBD_OPTION_GET_PAGES`
);
export const cbdOptionGetPagesAsyncAction = asyncAction(
    ASYNC_CBD_OPTION_GET_PAGES
);

// cbd option 리스트 조회
export const ASYNC_CBD_OPTION_GET_LISTS = asyncActionCreator(
    `${prefix}CBD_OPTION_GET_LISTS`
);
export const cbdOptionGetListsAsyncAction = asyncAction(
    ASYNC_CBD_OPTION_GET_LISTS
);

// cbd option 조회(ID)
export const ASYNC_CBD_OPTION_GET_ID = asyncActionCreator(
    `${prefix}CBD_OPTION_GET_ID`
);
export const cbdOptionGetIdAsyncAction = asyncAction(ASYNC_CBD_OPTION_GET_ID);

// cbd option document 조회(ID)
export const ASYNC_CBD_OPTION_DOCUMENT_GET_ID = asyncActionCreator(
    `${prefix}CBD_OPTION_DOCUMENT_GET_ID`
);
export const cbdOptionDocumentGetIdAsyncAction = asyncAction(
    ASYNC_CBD_OPTION_DOCUMENT_GET_ID
);

// cbd option simulation 조회(ID)
export const ASYNC_CBD_OPTION_SIMULATION_GET_ID = asyncActionCreator(
    `${prefix}CBD_OPTION_SIMULATION_GET_ID`
);
export const cbdOptionSimulationGetIdAsyncAction = asyncAction(
    ASYNC_CBD_OPTION_SIMULATION_GET_ID
);

// cbd option 등록
export const ASYNC_CBD_OPTION_POST = asyncActionCreator(
    `${prefix}CBD_OPTION_POST`
);
export const cbdOptionPostAsyncAction = asyncAction(ASYNC_CBD_OPTION_POST);

// cbd option 복사
export const ASYNC_CBD_OPTION_POST_COPY = asyncActionCreator(
    `${prefix}CBD_OPTION_POST_COPY`
);
export const cbdOptionPostCopyAsyncAction = asyncAction(
    ASYNC_CBD_OPTION_POST_COPY
);

// cbd option 수정
export const ASYNC_CBD_OPTION_PUT = asyncActionCreator(
    `${prefix}CBD_OPTION_PUT`
);
export const cbdOptionPutAsyncAction = asyncAction(ASYNC_CBD_OPTION_PUT);

// cbd option 삭제
export const ASYNC_CBD_OPTION_DELETE = asyncActionCreator(
    `${prefix}CBD_OPTION_DELETE`
);
export const cbdOptionDeleteAsyncAction = asyncAction(ASYNC_CBD_OPTION_DELETE);

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
        simulationId: {
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
    postCopy: {
        isLoading: false,
        data: null,
        error: null,
    },
    put: {
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
export const cbdOptionReducer = handleActions(
    {
        [ASYNC_CBD_OPTION_GET_LISTS.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.get.lists.isLoading = true;
                draft.get.lists.data = initialState.get.lists.data;
                draft.get.lists.error = initialState.get.lists.error;
            }),
        [ASYNC_CBD_OPTION_GET_LISTS.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.get.lists.isLoading = false;
                draft.get.lists.data = action.payload;
            }),
        [ASYNC_CBD_OPTION_GET_LISTS.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.get.lists.isLoading = false;
                draft.get.lists.error = action.payload;
            }),

        [ASYNC_CBD_OPTION_GET_ID.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.get.id.isLoading = true;
                draft.get.id.data = initialState.get.id.data;
                draft.get.id.error = initialState.get.id.error;
            }),
        [ASYNC_CBD_OPTION_GET_ID.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.get.id.isLoading = false;
                draft.get.id.data = action.payload;
            }),
        [ASYNC_CBD_OPTION_GET_ID.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.get.id.isLoading = false;
                draft.get.id.error = action.payload;
            }),
        [ASYNC_CBD_OPTION_GET_ID.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.get.id.isLoading = false;
                draft.get.id.data = initialState.get.id.data;
                draft.get.id.error = initialState.get.id.error;
            }),

        [ASYNC_CBD_OPTION_DOCUMENT_GET_ID.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.get.documentId.isLoading = true;
                draft.get.documentId.data = initialState.get.documentId.data;
                draft.get.documentId.error = initialState.get.documentId.error;
            }),
        [ASYNC_CBD_OPTION_DOCUMENT_GET_ID.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.get.documentId.isLoading = false;
                draft.get.documentId.data = action.payload;
            }),
        [ASYNC_CBD_OPTION_DOCUMENT_GET_ID.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.get.documentId.isLoading = false;
                draft.get.documentId.error = action.payload;
            }),
        [ASYNC_CBD_OPTION_DOCUMENT_GET_ID.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.get.documentId.isLoading = false;
                draft.get.documentId.data = initialState.get.documentId.data;
                draft.get.documentId.error = initialState.get.documentId.error;
            }),

        [ASYNC_CBD_OPTION_SIMULATION_GET_ID.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.get.simulationId.isLoading = true;
                draft.get.simulationId.data =
                    initialState.get.simulationId.data;
                draft.get.simulationId.error =
                    initialState.get.simulationId.error;
            }),
        [ASYNC_CBD_OPTION_SIMULATION_GET_ID.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.get.simulationId.isLoading = false;
                draft.get.simulationId.data = action.payload;
            }),
        [ASYNC_CBD_OPTION_SIMULATION_GET_ID.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.get.simulationId.isLoading = false;
                draft.get.simulationId.error = action.payload;
            }),
        [ASYNC_CBD_OPTION_SIMULATION_GET_ID.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.get.simulationId.isLoading = false;
                draft.get.simulationId.data =
                    initialState.get.simulationId.data;
                draft.get.simulationId.error =
                    initialState.get.simulationId.error;
            }),

        [ASYNC_CBD_OPTION_POST.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.post.isLoading = true;
                draft.post.data = initialState.post.data;
                draft.post.error = initialState.post.error;
            }),
        [ASYNC_CBD_OPTION_POST.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.post.isLoading = false;
                draft.post.data = action.payload;
            }),
        [ASYNC_CBD_OPTION_POST.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.post.isLoading = false;
                draft.post.error = action.payload;
            }),
        [ASYNC_CBD_OPTION_POST.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.post.isLoading = false;
                draft.post.data = initialState.post.data;
                draft.post.error = initialState.post.error;
            }),

        [ASYNC_CBD_OPTION_POST_COPY.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.postCopy.isLoading = true;
                draft.postCopy.data = initialState.postCopy.data;
                draft.postCopy.error = initialState.postCopy.error;
            }),
        [ASYNC_CBD_OPTION_POST_COPY.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.postCopy.isLoading = false;
                draft.postCopy.data = action.payload;
            }),
        [ASYNC_CBD_OPTION_POST_COPY.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.postCopy.isLoading = false;
                draft.postCopy.error = action.payload;
            }),
        [ASYNC_CBD_OPTION_POST_COPY.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.postCopy.isLoading = false;
                draft.postCopy.data = initialState.postCopy.data;
                draft.postCopy.error = initialState.postCopy.error;
            }),

        [ASYNC_CBD_OPTION_PUT.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.put.isLoading = true;
                draft.put.data = initialState.put.data;
                draft.put.error = initialState.put.error;
            }),
        [ASYNC_CBD_OPTION_PUT.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.put.isLoading = false;
                draft.put.data = action.payload;
            }),
        [ASYNC_CBD_OPTION_PUT.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.put.isLoading = false;
                draft.put.error = action.payload;
            }),
        [ASYNC_CBD_OPTION_PUT.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.put.isLoading = false;
                draft.put.data = initialState.put.data;
                draft.put.error = initialState.put.error;
            }),

        [ASYNC_CBD_OPTION_DELETE.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.delete.isLoading = true;
                draft.delete.data = initialState.delete.data;
                draft.delete.error = initialState.delete.error;
            }),
        [ASYNC_CBD_OPTION_DELETE.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.delete.isLoading = false;
                draft.delete.data = action.payload;
            }),
        [ASYNC_CBD_OPTION_DELETE.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.delete.isLoading = false;
                draft.delete.error = action.payload;
            }),
        [ASYNC_CBD_OPTION_DELETE.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.delete.isLoading = false;
                draft.delete.data = initialState.delete.data;
                draft.delete.error = initialState.delete.error;
            }),
    },
    initialState
);
