import { handleActions } from 'redux-actions';
import { produce } from 'immer';
import { asyncActionCreator, asyncAction } from 'core/utils/reduxUtil';

// 1. 각 모듈별 함수 구분을 위한 prefix 각 모듈 파일명 + '/'의 조합으로 구성
const prefix = 'sign/verify';

// 2. 액션에 대해서 정의 및 액션 생성자 함수에 대해서 정의

// 이메일 인증
export const ASYNC_SIGN_VERIFY_POST_MAIL = asyncActionCreator(
    `${prefix}SIGN_VERIFY_POST_MAIL`
);
export const signVerifyPostMailAsyncAction = asyncAction(
    ASYNC_SIGN_VERIFY_POST_MAIL
);

// 인증코드 확인
export const ASYNC_SIGN_VERIFY_POST_CODE = asyncActionCreator(
    `${prefix}SIGN_VERIFY_POST_CODE`
);
export const signVerifyPostCodeAsyncAction = asyncAction(
    ASYNC_SIGN_VERIFY_POST_CODE
);

// 4. 리듀서의 값을 정의
const initialState = {
    post: {
        mail: {
            isLoading: false,
            data: null,
            error: null,
        },
        code: {
            isLoading: false,
            data: null,
            error: null,
        },
    },
};

// 4. 리듀서를 정의
export const signVerifyReducer = handleActions(
    {
        [ASYNC_SIGN_VERIFY_POST_MAIL.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.post.mail.isLoading = true;
                draft.post.mail.data = initialState.post.mail.data;
                draft.post.mail.error = initialState.post.mail.error;
            }),
        [ASYNC_SIGN_VERIFY_POST_MAIL.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.post.mail.isLoading = false;
                draft.post.mail.data = action.payload;
            }),
        [ASYNC_SIGN_VERIFY_POST_MAIL.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.post.mail.isLoading = false;
                draft.post.mail.data = initialState.post.mail.data;
                draft.post.mail.error = action.payload;
            }),

        [ASYNC_SIGN_VERIFY_POST_CODE.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.post.code.isLoading = true;
                draft.post.code.data = initialState.post.code.data;
                draft.post.code.error = initialState.post.code.error;
            }),
        [ASYNC_SIGN_VERIFY_POST_CODE.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.post.code.isLoading = false;
                draft.post.code.data = action.payload;
            }),
        [ASYNC_SIGN_VERIFY_POST_CODE.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.post.code.isLoading = false;
                draft.post.code.data = initialState.post.code.data;
                draft.post.code.error = action.payload;
            }),
    },
    initialState
);
