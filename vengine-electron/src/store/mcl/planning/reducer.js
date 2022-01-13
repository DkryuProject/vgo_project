import { handleActions } from 'redux-actions';
import { produce } from 'immer';
import { asyncActionCreator, asyncAction } from 'core/utils/reduxUtil';

// 1. 각 모듈별 함수 구분을 위한 prefix 각 모듈 파일명 + '/'의 조합으로 구성
const prefix = 'mcl/planning';

// 2. 액션에 대해서 정의 및 액션 생성자 함수에 대해서 정의

// mcl planning 리스트 조회
export const ASYNC_MCL_PLANNING_GET_LISTS = asyncActionCreator(
    `${prefix}MCL_PLANNING_GET_LISTS`
);
export const mclPlanningGetListsAsyncAction = asyncAction(
    ASYNC_MCL_PLANNING_GET_LISTS
);

// mcl planning 조회 (id)
export const ASYNC_MCL_PLANNING_GET_ID = asyncActionCreator(
    `${prefix}MCL_PLANNING_GET_ID`
);
export const mclPlanningGetIdAsyncAction = asyncAction(
    ASYNC_MCL_PLANNING_GET_ID
);

// mcl planning 등록 (new)
export const ASYNC_MCL_PLANNING_POST_NEW = asyncActionCreator(
    `${prefix}MCL_PLANNING_POST_NEW`
);
export const mclPlanningPostNewAsyncAction = asyncAction(
    ASYNC_MCL_PLANNING_POST_NEW
);

// mcl planning 등록 (id)
export const ASYNC_MCL_PLANNING_POST_ID = asyncActionCreator(
    `${prefix}MCL_PLANNING_POST_ID`
);
export const mclPlanningPostIdAsyncAction = asyncAction(
    ASYNC_MCL_PLANNING_POST_ID
);

// mcl planning 등록 (copy)
export const ASYNC_MCL_PLANNING_POST_COPY = asyncActionCreator(
    `${prefix}MCL_PLANNING_POST_COPY`
);
export const mclPlanningPostCopyAsyncAction = asyncAction(
    ASYNC_MCL_PLANNING_POST_COPY
);

// mcl planning 등록 (thread)
export const ASYNC_MCL_PLANNING_POST_THREAD = asyncActionCreator(
    `${prefix}MCL_PLANNING_POST_THREAD`
);
export const mclPlanningPostThreadAsyncAction = asyncAction(
    ASYNC_MCL_PLANNING_POST_THREAD
);

// mcl planning 수정 (id)
export const ASYNC_MCL_PLANNING_PUT_ID = asyncActionCreator(
    `${prefix}MCL_PLANNING_PUT_ID`
);
export const mclPlanningPutIdAsyncAction = asyncAction(
    ASYNC_MCL_PLANNING_PUT_ID
);

// mcl planning 수정 (option)
export const ASYNC_MCL_PLANNING_PUT_OPTION = asyncActionCreator(
    `${prefix}MCL_PLANNING_PUT_OPTION`
);
export const mclPlanningPutOptionAsyncAction = asyncAction(
    ASYNC_MCL_PLANNING_PUT_OPTION
);

// mcl planning 수정 (subsidiary)
export const ASYNC_MCL_PLANNING_PUT_SUBSIDIARY = asyncActionCreator(
    `${prefix}MCL_PLANNING_PUT_SUBSIDIARY`
);
export const mclPlanningPutSubsidiaryAsyncAction = asyncAction(
    ASYNC_MCL_PLANNING_PUT_SUBSIDIARY
);

// mcl planning 수정 (status)
export const ASYNC_MCL_PLANNING_PUT_STATUS = asyncActionCreator(
    `${prefix}MCL_PLANNING_PUT_STATUS`
);
export const mclPlanningPutStatusAsyncAction = asyncAction(
    ASYNC_MCL_PLANNING_PUT_STATUS
);

// mcl planning 삭제
export const ASYNC_MCL_PLANNING_DELETE = asyncActionCreator(
    `${prefix}MCL_PLANNING_DELETE`
);
export const mclPlanningDeleteAsyncAction = asyncAction(
    ASYNC_MCL_PLANNING_DELETE
);

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
    },
    post: {
        new: {
            isLoading: false,
            data: null,
            error: null,
        },
        id: {
            isLoading: false,
            data: null,
            error: null,
        },
        copy: {
            isLoading: false,
            data: null,
            error: null,
        },
        thread: {
            isLoading: false,
            data: null,
            error: null,
        },
    },
    put: {
        id: {
            isLoading: false,
            data: null,
            error: null,
        },
        option: {
            isLoading: false,
            data: null,
            error: null,
        },
        status: {
            isLoading: false,
            data: null,
            error: null,
        },
        subsidiary: {
            isLoading: false,
            data: null,
            error: null,
        },
    },
    delete: {
        isLoading: false,
        data: null,
        error: null,
    },
};

// 4. 리듀서를 정의
export const mclPlanningReducer = handleActions(
    {
        [ASYNC_MCL_PLANNING_GET_LISTS.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.get.lists.isLoading = true;
                draft.get.lists.data = initialState.get.lists.data;
                draft.get.lists.error = initialState.get.lists.error;
            }),
        [ASYNC_MCL_PLANNING_GET_LISTS.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.get.lists.isLoading = false;
                draft.get.lists.data = action.payload;
            }),
        [ASYNC_MCL_PLANNING_GET_LISTS.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.get.lists.isLoading = false;
                draft.get.lists.error = action.payload;
            }),

        [ASYNC_MCL_PLANNING_GET_ID.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.get.id.isLoading = true;
                draft.get.id.data = initialState.get.id.data;
                draft.get.id.error = initialState.get.id.error;
            }),
        [ASYNC_MCL_PLANNING_GET_ID.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.get.id.isLoading = false;
                draft.get.id.data = action.payload;
            }),
        [ASYNC_MCL_PLANNING_GET_ID.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.get.id.isLoading = false;
                draft.get.id.error = action.payload;
            }),

        [ASYNC_MCL_PLANNING_POST_NEW.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.post.new.isLoading = true;
                draft.post.new.data = initialState.post.new.data;
                draft.post.new.error = initialState.post.new.error;
            }),
        [ASYNC_MCL_PLANNING_POST_NEW.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.post.new.isLoading = false;
                draft.post.new.data = action.payload;
            }),
        [ASYNC_MCL_PLANNING_POST_NEW.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.post.new.isLoading = false;
                draft.post.new.error = action.payload;
            }),
        [ASYNC_MCL_PLANNING_POST_NEW.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.post.new.isLoading = false;
                draft.post.new.data = initialState.post.new.data;
                draft.post.new.error = initialState.post.new.error;
            }),

        [ASYNC_MCL_PLANNING_POST_ID.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.post.id.isLoading = true;
                draft.post.id.data = initialState.post.id.data;
                draft.post.id.error = initialState.post.id.error;
            }),
        [ASYNC_MCL_PLANNING_POST_ID.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.post.id.isLoading = false;
                draft.post.id.data = action.payload;
            }),
        [ASYNC_MCL_PLANNING_POST_ID.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.post.id.isLoading = false;
                draft.post.id.error = action.payload;
            }),
        [ASYNC_MCL_PLANNING_POST_ID.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.post.id.isLoading = false;
                draft.post.id.data = initialState.post.id.data;
                draft.post.id.error = initialState.post.id.error;
            }),

        [ASYNC_MCL_PLANNING_POST_COPY.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.post.copy.isLoading = true;
                draft.post.copy.data = initialState.post.copy.data;
                draft.post.copy.error = initialState.post.copy.error;
            }),
        [ASYNC_MCL_PLANNING_POST_COPY.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.post.copy.isLoading = false;
                draft.post.copy.data = action.payload;
            }),
        [ASYNC_MCL_PLANNING_POST_COPY.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.post.copy.isLoading = false;
                draft.post.copy.error = action.payload;
            }),
        [ASYNC_MCL_PLANNING_POST_COPY.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.post.copy.isLoading = false;
                draft.post.copy.data = initialState.post.copy.data;
                draft.post.copy.error = initialState.post.copy.error;
            }),

        [ASYNC_MCL_PLANNING_POST_THREAD.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.post.thread.isLoading = true;
                draft.post.thread.data = initialState.post.thread.data;
                draft.post.thread.error = initialState.post.thread.error;
            }),
        [ASYNC_MCL_PLANNING_POST_THREAD.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.post.thread.isLoading = false;
                draft.post.thread.data = action.payload;
            }),
        [ASYNC_MCL_PLANNING_POST_THREAD.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.post.thread.isLoading = false;
                draft.post.thread.error = action.payload;
            }),
        [ASYNC_MCL_PLANNING_POST_THREAD.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.post.thread.isLoading = false;
                draft.post.thread.data = initialState.post.thread.data;
                draft.post.thread.error = initialState.post.thread.error;
            }),

        [ASYNC_MCL_PLANNING_PUT_ID.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.put.id.isLoading = true;
                draft.put.id.data = initialState.put.id.data;
                draft.put.id.error = initialState.put.id.error;
            }),
        [ASYNC_MCL_PLANNING_PUT_ID.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.put.id.isLoading = false;
                draft.put.id.data = action.payload;
            }),
        [ASYNC_MCL_PLANNING_PUT_ID.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.put.id.isLoading = false;
                draft.put.id.error = action.payload;
            }),
        [ASYNC_MCL_PLANNING_PUT_ID.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.put.id.isLoading = false;
                draft.put.id.data = initialState.put.id.data;
                draft.put.id.error = initialState.put.id.error;
            }),

        [ASYNC_MCL_PLANNING_PUT_OPTION.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.put.option.isLoading = true;
                draft.put.option.data = initialState.put.option.data;
                draft.put.option.error = initialState.put.option.error;
            }),
        [ASYNC_MCL_PLANNING_PUT_OPTION.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.put.option.isLoading = false;
                draft.put.option.data = action.payload;
            }),
        [ASYNC_MCL_PLANNING_PUT_OPTION.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.put.option.isLoading = false;
                draft.put.option.error = action.payload;
            }),
        [ASYNC_MCL_PLANNING_PUT_OPTION.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.put.option.isLoading = false;
                draft.put.option.data = initialState.put.option.data;
                draft.put.option.error = initialState.put.option.error;
            }),

        [ASYNC_MCL_PLANNING_PUT_SUBSIDIARY.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.put.subsidiary.isLoading = true;
                draft.put.subsidiary.data = initialState.put.subsidiary.data;
                draft.put.subsidiary.error = initialState.put.subsidiary.error;
            }),
        [ASYNC_MCL_PLANNING_PUT_SUBSIDIARY.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.put.subsidiary.isLoading = false;
                draft.put.subsidiary.data = action.payload;
            }),
        [ASYNC_MCL_PLANNING_PUT_SUBSIDIARY.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.put.subsidiary.isLoading = false;
                draft.put.subsidiary.error = action.payload;
            }),
        [ASYNC_MCL_PLANNING_PUT_SUBSIDIARY.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.put.subsidiary.isLoading = false;
                draft.put.subsidiary.data = initialState.put.subsidiary.data;
                draft.put.subsidiary.error = initialState.put.subsidiary.error;
            }),

        [ASYNC_MCL_PLANNING_PUT_STATUS.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.put.status.isLoading = true;
                draft.put.status.data = initialState.put.status.data;
                draft.put.status.error = initialState.put.status.error;
            }),
        [ASYNC_MCL_PLANNING_PUT_STATUS.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.put.status.isLoading = false;
                draft.put.status.data = action.payload;
            }),
        [ASYNC_MCL_PLANNING_PUT_STATUS.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.put.status.isLoading = false;
                draft.put.status.error = action.payload;
            }),
        [ASYNC_MCL_PLANNING_PUT_STATUS.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.put.status.isLoading = false;
                draft.put.status.data = initialState.put.status.data;
                draft.put.status.error = initialState.put.status.error;
            }),

        [ASYNC_MCL_PLANNING_DELETE.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.delete.isLoading = true;
                draft.delete.data = initialState.delete.data;
                draft.delete.error = initialState.delete.error;
            }),
        [ASYNC_MCL_PLANNING_DELETE.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.delete.isLoading = false;
                draft.delete.data = action.payload;
            }),
        [ASYNC_MCL_PLANNING_DELETE.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.delete.isLoading = false;
                draft.delete.error = action.payload;
            }),
        [ASYNC_MCL_PLANNING_DELETE.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.delete.isLoading = false;
                draft.delete.data = initialState.delete.data;
                draft.delete.error = initialState.delete.error;
            }),
    },
    initialState
);
