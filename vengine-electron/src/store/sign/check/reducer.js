import { handleActions } from 'redux-actions';
import { produce } from 'immer';
import { asyncActionCreator, asyncAction } from 'core/utils/reduxUtil';

// 1. 각 모듈별 함수 구분을 위한 prefix 각 모듈 파일명 + '/'의 조합으로 구성
const prefix = 'sign/check';

// 2. 액션에 대해서 정의 및 액션 생성자 함수에 대해서 정의

// 이메일 체크
export const ASYNC_SIGN_CHECK_GET_EMAIL = asyncActionCreator(
    `${prefix}SIGN_CHECK_GET_EMAIL`
);
export const signCheckGetEmailAsyncAction = asyncAction(
    ASYNC_SIGN_CHECK_GET_EMAIL
);

// 도메인 체크
export const ASYNC_SIGN_CHECK_GET_DOMAIN = asyncActionCreator(
    `${prefix}SIGN_CHECK_GET_DOMAIN`
);
export const signCheckGetDomainAsyncAction = asyncAction(
    ASYNC_SIGN_CHECK_GET_DOMAIN
);

// 4. 리듀서의 값을 정의
const initialState = {
    get: {
        email: {
            isLoading: false,
            data: null,
            error: null,
        },
        domain: {
            isLoading: false,
            data: null,
            error: null,
        },
    },
};

// 4. 리듀서를 정의
export const signCheckReducer = handleActions(
    {
        [ASYNC_SIGN_CHECK_GET_EMAIL.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.get.email.isLoading = true;
                draft.get.email.data = initialState.get.email.data;
                draft.get.email.error = initialState.get.email.error;
            }),
        [ASYNC_SIGN_CHECK_GET_EMAIL.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.get.email.isLoading = false;
                draft.get.email.data = action.payload;
            }),
        [ASYNC_SIGN_CHECK_GET_EMAIL.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.get.email.isLoading = false;
                draft.get.email.data = initialState.get.email.data;
                draft.get.email.error = action.payload;
            }),

        [ASYNC_SIGN_CHECK_GET_DOMAIN.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.get.domain.isLoading = true;
                draft.get.domain.data = initialState.get.domain.data;
                draft.get.domain.error = initialState.get.domain.error;
            }),
        [ASYNC_SIGN_CHECK_GET_DOMAIN.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.get.domain.isLoading = false;
                draft.get.domain.data = action.payload;
            }),
        [ASYNC_SIGN_CHECK_GET_DOMAIN.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.get.domain.isLoading = false;
                draft.get.domain.data = initialState.get.domain.data;
                draft.get.domain.error = action.payload;
            }),
    },
    initialState
);
