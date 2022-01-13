import { handleActions } from 'redux-actions';
import { produce } from 'immer';
import { asyncActionCreator, asyncAction } from 'core/utils/reduxUtil';

// 1. 각 모듈별 함수 구분을 위한 prefix 각 모듈 파일명 + '/'의 조합으로 구성
const prefix = 'material/info';

// 2. 액션에 대해서 정의 및 액션 생성자 함수에 대해서 정의

// 자재 Info 리스트 조회
export const ASYNC_MATERIAL_INFO_GET_LISTS = asyncActionCreator(
    `${prefix}MATERIAL_INFO_GET_LISTS`
);
export const materialInfoGetListsAsyncAction = asyncAction(
    ASYNC_MATERIAL_INFO_GET_LISTS
);

// 자재 Info 페이지 조회
export const ASYNC_MATERIAL_INFO_GET_PAGES = asyncActionCreator(
    `${prefix}MATERIAL_INFO_GET_PAGES`
);
export const materialInfoGetPagesAsyncAction = asyncAction(
    ASYNC_MATERIAL_INFO_GET_PAGES
);

// 자재 Info 조회(ID)
export const ASYNC_MATERIAL_INFO_GET_ID = asyncActionCreator(
    `${prefix}MATERIAL_INFO_GET_ID`
);
export const materialInfoGetIdAsyncAction = asyncAction(
    ASYNC_MATERIAL_INFO_GET_ID
);

// 자재 Info 조회(Chief contents)
export const ASYNC_MATERIAL_INFO_GET_CHIEF = asyncActionCreator(
    `${prefix}MATERIAL_INFO_GET_CHIEF`
);
export const materialInfoGetChiefAsyncAction = asyncAction(
    ASYNC_MATERIAL_INFO_GET_CHIEF
);

// 자재 Info 조회(Filter)
export const ASYNC_MATERIAL_INFO_POST_FILTER = asyncActionCreator(
    `${prefix}MATERIAL_INFO_POST_FILTER`
);
export const materialInfoPostFilterAsyncAction = asyncAction(
    ASYNC_MATERIAL_INFO_POST_FILTER
);

// 자재 Info 등록
export const ASYNC_MATERIAL_INFO_POST = asyncActionCreator(
    `${prefix}MATERIAL_INFO_POST`
);
export const materialInfoPostAsyncAction = asyncAction(
    ASYNC_MATERIAL_INFO_POST
);

// 자재 Info 업로드 등록
export const ASYNC_MATERIAL_INFO_POST_EXCEL_UPLOAD = asyncActionCreator(
    `${prefix}MATERIAL_INFO_POST_EXCEL_UPLOAD`
);
export const materialInfoPostExcelUploadAsyncAction = asyncAction(
    ASYNC_MATERIAL_INFO_POST_EXCEL_UPLOAD
);

// 자재 Info 삭제(수정)
export const ASYNC_MATERIAL_INFO_PUT_DELETE = asyncActionCreator(
    `${prefix}MATERIAL_INFO_PUT_DELETE`
);
export const materialInfoPutDeleteAsyncAction = asyncAction(
    ASYNC_MATERIAL_INFO_PUT_DELETE
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
        chief: {
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
    postFilter: {
        isLoading: false,
        data: null,
        error: null,
    },
    postExcelUpload: {
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
export const materialInfoReducer = handleActions(
    {
        [ASYNC_MATERIAL_INFO_GET_LISTS.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.get.lists.isLoading = true;
                draft.get.lists.data = initialState.get.lists.data;
                draft.get.lists.error = initialState.get.lists.error;
            }),
        [ASYNC_MATERIAL_INFO_GET_LISTS.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.get.lists.isLoading = false;
                draft.get.lists.data = action.payload;
            }),
        [ASYNC_MATERIAL_INFO_GET_LISTS.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.get.lists.isLoading = false;
                draft.get.lists.error = action.payload;
            }),

        [ASYNC_MATERIAL_INFO_GET_PAGES.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.get.pages.isLoading = true;
                draft.get.pages.data = initialState.get.pages.data;
                draft.get.pages.error = initialState.get.pages.error;
            }),
        [ASYNC_MATERIAL_INFO_GET_PAGES.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.get.pages.isLoading = false;
                draft.get.pages.data = action.payload;
            }),
        [ASYNC_MATERIAL_INFO_GET_PAGES.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.get.pages.isLoading = false;
                draft.get.pages.error = action.payload;
            }),

        [ASYNC_MATERIAL_INFO_GET_ID.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.get.id.isLoading = true;
                draft.get.id.data = initialState.get.id.data;
                draft.get.id.error = initialState.get.id.error;
            }),
        [ASYNC_MATERIAL_INFO_GET_ID.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.get.id.isLoading = false;
                draft.get.id.data = action.payload;
            }),
        [ASYNC_MATERIAL_INFO_GET_ID.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.get.id.isLoading = false;
                draft.get.id.error = action.payload;
            }),
        [ASYNC_MATERIAL_INFO_GET_ID.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.get.id.isLoading = false;
                draft.get.id.data = initialState.get.id.data;
                draft.get.id.error = initialState.get.id.error;
            }),

        [ASYNC_MATERIAL_INFO_GET_CHIEF.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.get.chief.isLoading = true;
                draft.get.chief.data = initialState.get.chief.data;
                draft.get.chief.error = initialState.get.chief.error;
            }),
        [ASYNC_MATERIAL_INFO_GET_CHIEF.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.get.chief.isLoading = false;
                draft.get.chief.data = action.payload;
            }),
        [ASYNC_MATERIAL_INFO_GET_CHIEF.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.get.chief.isLoading = false;
                draft.get.chief.error = action.payload;
            }),
        [ASYNC_MATERIAL_INFO_GET_CHIEF.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.get.chief.isLoading = false;
                draft.get.chief.data = initialState.get.chief.data;
                draft.get.chief.error = initialState.get.chief.error;
            }),

        [ASYNC_MATERIAL_INFO_POST.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.post.isLoading = true;
                draft.post.data = initialState.post.data;
                draft.post.error = initialState.post.error;
            }),
        [ASYNC_MATERIAL_INFO_POST.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.post.isLoading = false;
                draft.post.data = action.payload;
            }),
        [ASYNC_MATERIAL_INFO_POST.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.post.isLoading = false;
                draft.post.error = action.payload;
            }),
        [ASYNC_MATERIAL_INFO_POST.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.post.isLoading = false;
                draft.post.data = initialState.post.data;
                draft.post.error = initialState.post.error;
            }),

        [ASYNC_MATERIAL_INFO_POST_FILTER.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.postFilter.isLoading = true;
                draft.postFilter.data = initialState.postFilter.data;
                draft.postFilter.error = initialState.postFilter.error;
            }),
        [ASYNC_MATERIAL_INFO_POST_FILTER.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.postFilter.isLoading = false;
                draft.postFilter.data = action.payload;
            }),
        [ASYNC_MATERIAL_INFO_POST_FILTER.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.postFilter.isLoading = false;
                draft.postFilter.error = action.payload;
            }),
        [ASYNC_MATERIAL_INFO_POST_FILTER.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.postFilter.isLoading = false;
                draft.postFilter.data = initialState.postFilter.data;
                draft.postFilter.error = initialState.postFilter.error;
            }),

        [ASYNC_MATERIAL_INFO_POST_EXCEL_UPLOAD.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.postExcelUpload.isLoading = true;
                draft.postExcelUpload.data = initialState.postExcelUpload.data;
                draft.postExcelUpload.error =
                    initialState.postExcelUpload.error;
            }),
        [ASYNC_MATERIAL_INFO_POST_EXCEL_UPLOAD.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.postExcelUpload.isLoading = false;
                draft.postExcelUpload.data = action.payload;
            }),
        [ASYNC_MATERIAL_INFO_POST_EXCEL_UPLOAD.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.postExcelUpload.isLoading = false;
                draft.postExcelUpload.error = action.payload;
            }),
        [ASYNC_MATERIAL_INFO_POST_EXCEL_UPLOAD.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.postExcelUpload.isLoading = false;
                draft.postExcelUpload.data = initialState.postExcelUpload.data;
                draft.postExcelUpload.error =
                    initialState.postExcelUpload.error;
            }),

        [ASYNC_MATERIAL_INFO_PUT_DELETE.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.put.delete.isLoading = true;
                draft.put.delete.data = initialState.put.delete.data;
                draft.put.delete.error = initialState.put.delete.error;
            }),
        [ASYNC_MATERIAL_INFO_PUT_DELETE.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.put.delete.isLoading = false;
                draft.put.delete.data = action.payload;
            }),
        [ASYNC_MATERIAL_INFO_PUT_DELETE.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.put.delete.isLoading = false;
                draft.put.delete.error = action.payload;
            }),
        [ASYNC_MATERIAL_INFO_PUT_DELETE.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.put.delete.isLoading = false;
                draft.put.delete.data = initialState.put.delete.data;
                draft.put.delete.error = initialState.put.delete.error;
            }),
    },
    initialState
);
