import { handleActions } from 'redux-actions';
import { produce } from 'immer';
import { asyncActionCreator, asyncAction } from 'core/utils/reduxUtil';

// 1. 각 모듈별 함수 구분을 위한 prefix 각 모듈 파일명 + '/'의 조합으로 구성
const prefix = 'cbd/cover';

// 2. 액션에 대해서 정의 및 액션 생성자 함수에 대해서 정의

// cbd cover 페이지 조회
export const ASYNC_CBD_COVER_GET_PAGES = asyncActionCreator(
    `${prefix}CBD_COVER_GET_PAGES`
);
export const cbdCoverGetPagesAsyncAction = asyncAction(
    ASYNC_CBD_COVER_GET_PAGES
);

// cbd cover 조회(ID)
export const ASYNC_CBD_COVER_GET_ID = asyncActionCreator(
    `${prefix}CBD_COVER_GET_ID`
);
export const cbdCoverGetIdAsyncAction = asyncAction(ASYNC_CBD_COVER_GET_ID);

// cbd cover 조회(DESIGN NUMBER)
export const ASYNC_CBD_COVER_GET_DESIGN_NUMBER = asyncActionCreator(
    `${prefix}CBD_COVER_GET_DESIGN_NUMBER`
);
export const cbdCoverGetDesignNumberAsyncAction = asyncAction(
    ASYNC_CBD_COVER_GET_DESIGN_NUMBER
);

// cbd cover 등록
export const ASYNC_CBD_COVER_POST = asyncActionCreator(
    `${prefix}CBD_COVER_POST`
);
export const cbdCoverPostAsyncAction = asyncAction(ASYNC_CBD_COVER_POST);

// cbd cover 이미지 등록
export const ASYNC_CBD_COVER_POST_IMAGE = asyncActionCreator(
    `${prefix}CBD_COVER_POST_IMAGE`
);
export const cbdCoverPostImageAsyncAction = asyncAction(
    ASYNC_CBD_COVER_POST_IMAGE
);

// cbd cover 필터
export const ASYNC_CBD_COVER_POST_FILTER = asyncActionCreator(
    `${prefix}CBD_COVER_POST_FILTER`
);
export const cbdCoverPostFilterAsyncAction = asyncAction(
    ASYNC_CBD_COVER_POST_FILTER
);

// cbd cover status 수정
export const ASYNC_CBD_COVER_PUT_STATUS = asyncActionCreator(
    `${prefix}CBD_COVER_PUT_STATUS`
);
export const cbdCoverPutStatusAsyncAction = asyncAction(
    ASYNC_CBD_COVER_PUT_STATUS
);

// cbd cover 삭제
export const ASYNC_CBD_COVER_DELETE = asyncActionCreator(
    `${prefix}CBD_COVER_DELETE`
);
export const cbdCoverDeleteAsyncAction = asyncAction(ASYNC_CBD_COVER_DELETE);

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
        designNumber: {
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
    postImage: {
        isLoading: false,
        data: null,
        error: null,
    },
    postFilter: {
        isLoading: false,
        data: null,
        error: null,
    },
    put: {
        status: {
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
export const cbdCoverReducer = handleActions(
    {
        [ASYNC_CBD_COVER_GET_PAGES.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.get.pages.isLoading = true;
                draft.get.pages.data = initialState.get.pages.data;
                draft.get.pages.error = initialState.get.pages.error;
            }),
        [ASYNC_CBD_COVER_GET_PAGES.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.get.pages.isLoading = false;
                draft.get.pages.data = action.payload;
            }),
        [ASYNC_CBD_COVER_GET_PAGES.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.get.pages.isLoading = false;
                draft.get.pages.error = action.payload;
            }),

        [ASYNC_CBD_COVER_GET_ID.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.get.id.isLoading = true;
                draft.get.id.data = initialState.get.id.data;
                draft.get.id.error = initialState.get.id.error;
            }),
        [ASYNC_CBD_COVER_GET_ID.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.get.id.isLoading = false;
                draft.get.id.data = action.payload;
            }),
        [ASYNC_CBD_COVER_GET_ID.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.get.id.isLoading = false;
                draft.get.id.error = action.payload;
            }),
        [ASYNC_CBD_COVER_GET_ID.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.get.id.isLoading = false;
                draft.get.id.data = initialState.get.id.data;
                draft.get.id.error = initialState.get.id.error;
            }),

        [ASYNC_CBD_COVER_GET_DESIGN_NUMBER.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.get.designNumber.isLoading = true;
                draft.get.designNumber.data =
                    initialState.get.designNumber.data;
                draft.get.designNumber.error =
                    initialState.get.designNumber.error;
            }),
        [ASYNC_CBD_COVER_GET_DESIGN_NUMBER.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.get.designNumber.isLoading = false;
                draft.get.designNumber.data = action.payload;
            }),
        [ASYNC_CBD_COVER_GET_DESIGN_NUMBER.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.get.designNumber.isLoading = false;
                draft.get.designNumber.error = action.payload;
            }),
        [ASYNC_CBD_COVER_GET_DESIGN_NUMBER.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.get.designNumber.isLoading = false;
                draft.get.designNumber.data =
                    initialState.get.designNumber.data;
                draft.get.designNumber.error =
                    initialState.get.designNumber.error;
            }),

        [ASYNC_CBD_COVER_POST.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.post.isLoading = true;
                draft.post.data = initialState.post.data;
                draft.post.error = initialState.post.error;
            }),
        [ASYNC_CBD_COVER_POST.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.post.isLoading = false;
                draft.post.data = action.payload;
            }),
        [ASYNC_CBD_COVER_POST.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.post.isLoading = false;
                draft.post.error = action.payload;
            }),
        [ASYNC_CBD_COVER_POST.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.post.isLoading = false;
                draft.post.data = initialState.post.data;
                draft.post.error = initialState.post.error;
            }),

        [ASYNC_CBD_COVER_POST_IMAGE.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.postImage.isLoading = true;
                draft.postImage.data = initialState.postImage.data;
                draft.postImage.error = initialState.postImage.error;
            }),
        [ASYNC_CBD_COVER_POST_IMAGE.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.postImage.isLoading = false;
                draft.postImage.data = action.payload;
            }),
        [ASYNC_CBD_COVER_POST_IMAGE.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.postImage.isLoading = false;
                draft.postImage.error = action.payload;
            }),
        [ASYNC_CBD_COVER_POST_IMAGE.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.postImage.isLoading = false;
                draft.postImage.data = initialState.postImage.data;
                draft.postImage.error = initialState.postImage.error;
            }),

        [ASYNC_CBD_COVER_POST_FILTER.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.postFilter.isLoading = true;
                draft.postFilter.data = initialState.postFilter.data;
                draft.postFilter.error = initialState.postFilter.error;
            }),
        [ASYNC_CBD_COVER_POST_FILTER.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.postFilter.isLoading = false;
                draft.postFilter.data = action.payload;
            }),
        [ASYNC_CBD_COVER_POST_FILTER.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.postFilter.isLoading = false;
                draft.postFilter.error = action.payload;
            }),
        [ASYNC_CBD_COVER_POST_FILTER.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.postFilter.isLoading = false;
                draft.postFilter.data = initialState.postFilter.data;
                draft.postFilter.error = initialState.postFilter.error;
            }),

        [ASYNC_CBD_COVER_PUT_STATUS.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.put.status.isLoading = true;
                draft.put.status.data = initialState.put.status.data;
                draft.put.status.error = initialState.put.status.error;
            }),
        [ASYNC_CBD_COVER_PUT_STATUS.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.put.status.isLoading = false;
                draft.put.status.data = action.payload;
            }),
        [ASYNC_CBD_COVER_PUT_STATUS.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.put.status.isLoading = false;
                draft.put.status.error = action.payload;
            }),
        [ASYNC_CBD_COVER_PUT_STATUS.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.put.status.isLoading = false;
                draft.put.status.data = initialState.post.data;
                draft.put.status.error = initialState.post.error;
            }),

        [ASYNC_CBD_COVER_DELETE.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.delete.isLoading = true;
                draft.delete.data = initialState.delete.data;
                draft.delete.error = initialState.delete.error;
            }),
        [ASYNC_CBD_COVER_DELETE.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.delete.isLoading = false;
                draft.delete.data = action.payload;
            }),
        [ASYNC_CBD_COVER_DELETE.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.delete.isLoading = false;
                draft.delete.error = action.payload;
            }),
        [ASYNC_CBD_COVER_DELETE.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.delete.isLoading = false;
                draft.delete.data = initialState.delete.data;
                draft.delete.error = initialState.delete.error;
            }),
    },
    initialState
);
