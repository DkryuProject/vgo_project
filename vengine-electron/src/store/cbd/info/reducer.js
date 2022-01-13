import { handleActions } from 'redux-actions';
import { produce } from 'immer';
import { asyncActionCreator, asyncAction } from 'core/utils/reduxUtil';

// 1. 각 모듈별 함수 구분을 위한 prefix 각 모듈 파일명 + '/'의 조합으로 구성
const prefix = 'cbd/info';

// 2. 액션에 대해서 정의 및 액션 생성자 함수에 대해서 정의

// cbd info 페이지 조회
export const ASYNC_CBD_INFO_GET_PAGES = asyncActionCreator(
    `${prefix}CBD_INFO_GET_PAGES`
);
export const cbdInfoGetPagesAsyncAction = asyncAction(ASYNC_CBD_INFO_GET_PAGES);

// cbd info 리스트 조회
export const ASYNC_CBD_INFO_GET_LISTS = asyncActionCreator(
    `${prefix}CBD_INFO_GET_LISTS`
);
export const cbdInfoGetListsAsyncAction = asyncAction(ASYNC_CBD_INFO_GET_LISTS);

// cbd info 조회(ID)
export const ASYNC_CBD_INFO_GET_ID = asyncActionCreator(
    `${prefix}CBD_INFO_GET_ID`
);
export const cbdInfoGetIdAsyncAction = asyncAction(ASYNC_CBD_INFO_GET_ID);

// cbd info 등록
export const ASYNC_CBD_INFO_POST = asyncActionCreator(`${prefix}CBD_INFO_POST`);
export const cbdInfoPostAsyncAction = asyncAction(ASYNC_CBD_INFO_POST);

// cbd info assign 등록
export const ASYNC_CBD_INFO_POST_ASSIGN = asyncActionCreator(
    `${prefix}CBD_INFO_POST_ASSIGN`
);
export const cbdInfoPostAssignAsyncAction = asyncAction(
    ASYNC_CBD_INFO_POST_ASSIGN
);

// cbd info 수정
export const ASYNC_CBD_INFO_PUT = asyncActionCreator(`${prefix}CBD_INFO_PUT`);
export const cbdInfoPutAsyncAction = asyncAction(ASYNC_CBD_INFO_PUT);

// cbd info 수정 옵션
export const ASYNC_CBD_INFO_PUT_OPTION = asyncActionCreator(
    `${prefix}CBD_INFO_PUT_OPTION`
);
export const cbdInfoPutOptionAsyncAction = asyncAction(
    ASYNC_CBD_INFO_PUT_OPTION
);

// cbd info 수정 사이즈
export const ASYNC_CBD_INFO_PUT_SUBSIDIARY = asyncActionCreator(
    `${prefix}CBD_INFO_PUT_SUBSIDIARY`
);
export const cbdInfoPutSubsidiaryAsyncAction = asyncAction(
    ASYNC_CBD_INFO_PUT_SUBSIDIARY
);

// cbd info 삭제
export const ASYNC_CBD_INFO_DELETE = asyncActionCreator(
    `${prefix}CBD_INFO_DELETE`
);
export const cbdInfoDeleteAsyncAction = asyncAction(ASYNC_CBD_INFO_DELETE);

// 3. 리듀서의 값을 정의
const initialState = {
    get: {
        lists: {
            fabric: {
                isLoading: false,
                data: null,
                error: null,
            },
            trim: {
                isLoading: false,
                data: null,
                error: null,
            },
            accessories: {
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
    postAssign: {
        isLoading: false,
        data: null,
        error: null,
    },
    put: {
        isLoading: false,
        data: null,
        error: null,
    },
    putOption: {
        isLoading: false,
        data: null,
        error: null,
    },
    putSubsidiary: {
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
export const cbdInfoReducer = handleActions(
    {
        [ASYNC_CBD_INFO_GET_LISTS.REQUEST]: (state, action) =>
            produce(state, (draft) => {
                const { type } = action.payload;
                draft.get.lists[type].isLoading = true;
                draft.get.lists[type].data = initialState.get.lists[type].data;
                draft.get.lists[type].error =
                    initialState.get.lists[type].error;
            }),
        [ASYNC_CBD_INFO_GET_LISTS.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                const { type, data } = action.payload;
                draft.get.lists[type].isLoading = false;
                draft.get.lists[type].data = data;
            }),
        [ASYNC_CBD_INFO_GET_LISTS.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                const { type, error } = action.payload;
                draft.get.lists[type].isLoading = false;
                draft.get.lists[type].error = error;
            }),
        [ASYNC_CBD_INFO_GET_LISTS.INITIAL]: (state) =>
            produce(state, (draft) => {
                Object.keys(draft.get.lists).map((v) => {
                    draft.get.lists[v].isLoading = false;
                    draft.get.lists[v].data = initialState.get.lists[v].data;
                    draft.get.lists[v].error = initialState.get.lists[v].error;
                    return true;
                });
            }),

        [ASYNC_CBD_INFO_GET_ID.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.get.id.isLoading = true;
                draft.get.id.data = initialState.get.id.data;
                draft.get.id.error = initialState.get.id.error;
            }),
        [ASYNC_CBD_INFO_GET_ID.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.get.id.isLoading = false;
                draft.get.id.data = action.payload;
            }),
        [ASYNC_CBD_INFO_GET_ID.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.get.id.isLoading = false;
                draft.get.id.error = action.payload;
            }),
        [ASYNC_CBD_INFO_GET_ID.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.get.id.isLoading = false;
                draft.get.id.data = initialState.get.id.data;
                draft.get.id.error = initialState.get.id.error;
            }),

        [ASYNC_CBD_INFO_POST.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.post.isLoading = true;
                draft.post.data = initialState.post.data;
                draft.post.error = initialState.post.error;
            }),
        [ASYNC_CBD_INFO_POST.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.post.isLoading = false;
                draft.post.data = action.payload;
            }),
        [ASYNC_CBD_INFO_POST.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.post.isLoading = false;
                draft.post.error = action.payload;
            }),
        [ASYNC_CBD_INFO_POST.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.post.isLoading = false;
                draft.post.data = initialState.post.data;
                draft.post.error = initialState.post.error;
            }),

        [ASYNC_CBD_INFO_POST_ASSIGN.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.postAssign.isLoading = true;
                draft.postAssign.data = initialState.postAssign.data;
                draft.postAssign.error = initialState.postAssign.error;
            }),
        [ASYNC_CBD_INFO_POST_ASSIGN.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.postAssign.isLoading = false;
                draft.postAssign.data = action.payload;
            }),
        [ASYNC_CBD_INFO_POST_ASSIGN.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.postAssign.isLoading = false;
                draft.postAssign.error = action.payload;
            }),
        [ASYNC_CBD_INFO_POST_ASSIGN.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.postAssign.isLoading = false;
                draft.postAssign.data = initialState.postAssign.data;
                draft.postAssign.error = initialState.postAssign.error;
            }),

        [ASYNC_CBD_INFO_PUT.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.put.isLoading = true;
                draft.put.data = initialState.put.data;
                draft.put.error = initialState.put.error;
            }),
        [ASYNC_CBD_INFO_PUT.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.put.isLoading = false;
                draft.put.data = action.payload;
            }),
        [ASYNC_CBD_INFO_PUT.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.put.isLoading = false;
                draft.put.error = action.payload;
            }),
        [ASYNC_CBD_INFO_PUT.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.put.isLoading = false;
                draft.put.data = initialState.put.data;
                draft.put.error = initialState.put.error;
            }),

        [ASYNC_CBD_INFO_PUT_OPTION.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.putOption.isLoading = true;
                draft.putOption.data = initialState.putOption.data;
                draft.putOption.error = initialState.putOption.error;
            }),
        [ASYNC_CBD_INFO_PUT_OPTION.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.putOption.isLoading = false;
                draft.putOption.data = action.payload;
            }),
        [ASYNC_CBD_INFO_PUT_OPTION.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.putOption.isLoading = false;
                draft.putOption.error = action.payload;
            }),
        [ASYNC_CBD_INFO_PUT_OPTION.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.putOption.isLoading = false;
                draft.putOption.data = initialState.putOption.data;
                draft.putOption.error = initialState.putOption.error;
            }),

        [ASYNC_CBD_INFO_PUT_SUBSIDIARY.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.putSubsidiary.isLoading = true;
                draft.putSubsidiary.data = initialState.putSubsidiary.data;
                draft.putSubsidiary.error = initialState.putSubsidiary.error;
            }),
        [ASYNC_CBD_INFO_PUT_SUBSIDIARY.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.putSubsidiary.isLoading = false;
                draft.putSubsidiary.data = action.payload;
            }),
        [ASYNC_CBD_INFO_PUT_SUBSIDIARY.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.putSubsidiary.isLoading = false;
                draft.putSubsidiary.error = action.payload;
            }),
        [ASYNC_CBD_INFO_PUT_SUBSIDIARY.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.putSubsidiary.isLoading = false;
                draft.putSubsidiary.data = initialState.putSubsidiary.data;
                draft.putSubsidiary.error = initialState.putSubsidiary.error;
            }),

        [ASYNC_CBD_INFO_DELETE.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.delete.isLoading = true;
                draft.delete.data = initialState.delete.data;
                draft.delete.error = initialState.delete.error;
            }),
        [ASYNC_CBD_INFO_DELETE.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.delete.isLoading = false;
                draft.delete.data = action.payload;
            }),
        [ASYNC_CBD_INFO_DELETE.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.delete.isLoading = false;
                draft.delete.error = action.payload;
            }),
        [ASYNC_CBD_INFO_DELETE.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.delete.isLoading = false;
                draft.delete.data = initialState.delete.data;
                draft.delete.error = initialState.delete.error;
            }),
    },
    initialState
);
