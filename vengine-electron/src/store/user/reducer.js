import { handleActions } from 'redux-actions';
import { produce } from 'immer';
import { asyncActionCreator, asyncAction } from 'core/utils/reduxUtil';

// 1. 각 모듈별 함수 구분을 위한 prefix 각 모듈 파일명 + '/'의 조합으로 구성
const prefix = 'user/';

// 2. 액션에 대해서 정의 및 액션 생성자 함수에 대해서 정의

// 멤버 조회(이메일)
export const ASYNC_USER_GET_EMAIL = asyncActionCreator(
    `${prefix}USER_GET_EMAIL`
);
export const userGetEmailAsyncAction = asyncAction(ASYNC_USER_GET_EMAIL);

// 멤버 조회(ID)
export const ASYNC_USER_GET_ID = asyncActionCreator(`${prefix}USER_GET_ID`);
export const userGetIdAsyncAction = asyncAction(ASYNC_USER_GET_ID);

// 멤버 조회
export const ASYNC_USER_GET_PAGES = asyncActionCreator(
    `${prefix}USER_GET_PAGES`
);
export const userGetPagesAsyncAction = asyncAction(ASYNC_USER_GET_PAGES);

// 멤버 레벨 조회
export const ASYNC_USER_GET_LEVEL = asyncActionCreator(
    `${prefix}USER_GET_LEVEL`
);
export const userGetLevelAsyncAction = asyncAction(ASYNC_USER_GET_LEVEL);

// 멤버 비밀번호 초기화
export const ASYNC_USER_GET_RESET_EMAIL = asyncActionCreator(
    `${prefix}USER_GET_RESET_EMAIL`
);
export const userGetResetEmailAsyncAction = asyncAction(
    ASYNC_USER_GET_RESET_EMAIL
);

// 멤버 수정
export const ASYNC_USER_PUT = asyncActionCreator(`${prefix}USER_PUT`);
export const userPutAsyncAction = asyncAction(ASYNC_USER_PUT);

// 멤버 상태 수정
export const ASYNC_USER_PUT_STATUS = asyncActionCreator(
    `${prefix}USER_PUT_STATUS`
);
export const userPutStatusAsyncAction = asyncAction(ASYNC_USER_PUT_STATUS);

// 4. 리듀서의 값을 정의
const initialState = {
    get: {
        email: {
            isLoading: false,
            data: null,
            error: null,
        },
        id: {
            isLoading: false,
            data: null,
            error: null,
        },
        pages: {
            isLoading: false,
            data: null,
            error: null,
        },
        level: {
            isLoading: false,
            data: null,
            error: null,
        },
        resetEmail: {
            isLoading: false,
            data: null,
            error: null,
        },
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
};

// 5. 리듀서를 정의
export const userReducer = handleActions(
    {
        [ASYNC_USER_GET_EMAIL.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.get.email.isLoading = true;
                draft.get.email.data = initialState.get.email.data;
                draft.get.email.error = initialState.get.email.error;
            }),
        [ASYNC_USER_GET_EMAIL.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.get.email.isLoading = false;
                draft.get.email.data = action.payload;
            }),
        [ASYNC_USER_GET_EMAIL.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.get.email.isLoading = false;
                draft.get.email.data = initialState.get.email.data;
                draft.get.email.error = action.payload;
            }),
        [ASYNC_USER_GET_EMAIL.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.get.email.isLoading = false;
                draft.get.email.data = initialState.get.email.data;
                draft.get.email.error = initialState.get.email.error;
            }),

        [ASYNC_USER_GET_ID.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.get.id.isLoading = true;
                draft.get.id.data = initialState.get.id.data;
                draft.get.id.error = initialState.get.id.error;
            }),
        [ASYNC_USER_GET_ID.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.get.id.isLoading = false;
                draft.get.id.data = action.payload;
                draft.get.id.error = initialState.get.id.error;
            }),
        [ASYNC_USER_GET_ID.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.get.id.isLoading = false;
                draft.get.id.data = initialState.get.id.data;
                draft.get.id.error = action.payload;
            }),

        [ASYNC_USER_GET_PAGES.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.get.pages.isLoading = true;
                draft.get.pages.data = initialState.get.pages.data;
                draft.get.pages.error = initialState.get.pages.error;
            }),
        [ASYNC_USER_GET_PAGES.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.get.pages.isLoading = false;
                draft.get.pages.data = action.payload;
                draft.get.pages.error = initialState.get.pages.error;
            }),
        [ASYNC_USER_GET_PAGES.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.get.pages.isLoading = false;
                draft.get.pages.data = initialState.get.pages.data;
                draft.get.pages.error = action.payload;
            }),

        [ASYNC_USER_GET_LEVEL.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.get.level.isLoading = true;
                draft.get.level.data = initialState.get.level.data;
                draft.get.level.error = initialState.get.level.error;
            }),
        [ASYNC_USER_GET_LEVEL.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.get.level.isLoading = false;
                draft.get.level.data = action.payload;
                draft.get.level.error = initialState.get.level.error;
            }),
        [ASYNC_USER_GET_LEVEL.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.get.level.isLoading = false;
                draft.get.level.data = initialState.get.level.data;
                draft.get.level.error = action.payload;
            }),

        [ASYNC_USER_GET_RESET_EMAIL.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.get.resetEmail.isLoading = true;
                draft.get.resetEmail.data = initialState.get.resetEmail.data;
                draft.get.resetEmail.error = initialState.get.resetEmail.error;
            }),
        [ASYNC_USER_GET_RESET_EMAIL.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.get.resetEmail.isLoading = false;
                draft.get.resetEmail.data = action.payload;
                draft.get.resetEmail.error = initialState.get.resetEmail.error;
            }),
        [ASYNC_USER_GET_RESET_EMAIL.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.get.resetEmail.isLoading = false;
                draft.get.resetEmail.data = initialState.get.resetEmail.data;
                draft.get.resetEmail.error = action.payload;
            }),
        [ASYNC_USER_GET_RESET_EMAIL.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.get.resetEmail.isLoading = false;
                draft.get.resetEmail.data = initialState.get.resetEmail.data;
                draft.get.resetEmail.error = initialState.get.resetEmail.error;
            }),

        [ASYNC_USER_PUT.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.put.isLoading = true;
                draft.put.data = initialState.put.data;
                draft.put.error = initialState.put.error;
            }),
        [ASYNC_USER_PUT.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.put.isLoading = false;
                draft.put.data = action.payload;
            }),
        [ASYNC_USER_PUT.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.put.isLoading = false;
                draft.put.data = initialState.put.data;
                draft.put.error = action.payload;
            }),
        [ASYNC_USER_PUT.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.put.isLoading = false;
                draft.put.data = initialState.put.data;
                draft.put.error = initialState.put.error;
            }),

        [ASYNC_USER_PUT_STATUS.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.putStatus.isLoading = true;
                draft.putStatus.data = initialState.putStatus.data;
                draft.putStatus.error = initialState.putStatus.error;
            }),
        [ASYNC_USER_PUT_STATUS.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.putStatus.isLoading = false;
                draft.putStatus.data = action.payload;
                draft.putStatus.error = initialState.putStatus.error;
            }),
        [ASYNC_USER_PUT_STATUS.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.putStatus.isLoading = false;
                draft.putStatus.data = initialState.putStatus.data;
                draft.putStatus.error = action.payload;
            }),
        [ASYNC_USER_PUT_STATUS.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.putStatus.isLoading = false;
                draft.putStatus.data = initialState.putStatus.data;
                draft.putStatus.error = initialState.putStatus.error;
            }),
    },
    initialState
);
