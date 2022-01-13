import { handleActions } from 'redux-actions';
import { produce } from 'immer';
import { asyncActionCreator, asyncAction } from 'core/utils/reduxUtil';

// 1. 각 모듈별 함수 구분을 위한 prefix 각 모듈 파일명 + '/'의 조합으로 구성
const prefix = 'sign/';

// 2. 액션에 대해서 정의 및 액션 생성자 함수에 대해서 정의
// 로그인
export const ASYNC_SIGNIN_POST = asyncActionCreator(`${prefix}SIGNIN_POST`);
export const signinPostAsyncAction = asyncAction(ASYNC_SIGNIN_POST);

// 회원가입
export const ASYNC_SIGNUP_POST = asyncActionCreator(`${prefix}SIGNUP_POST`);
export const signupPostAsyncAction = asyncAction(ASYNC_SIGNUP_POST);

// 초대하기
export const ASYNC_INVITE_POST = asyncActionCreator(`${prefix}INVITE_POST`);
export const invitePostAsyncAction = asyncAction(ASYNC_INVITE_POST);

// 3. 리듀서의 값을 정의
const initialState = {
    post: {
        signin: {
            isLoading: false,
            data: null,
            error: null,
        },
        signup: {
            isLoading: false,
            data: null,
            error: null,
        },
        invite: {
            isLoading: false,
            data: null,
            error: null,
        },
    },
};

// 4. 리듀서를 정의
export const signReducer = handleActions(
    {
        [ASYNC_SIGNIN_POST.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.post.signin.isLoading = true;
                draft.post.signin.data = initialState.post.signin.data;
                draft.post.signin.error = initialState.post.signin.error;
            }),
        [ASYNC_SIGNIN_POST.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.post.signin.isLoading = false;
                draft.post.signin.data = action.payload;
                draft.post.signin.error = initialState.post.signin.error;
            }),
        [ASYNC_SIGNIN_POST.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.post.signin.isLoading = false;
                draft.post.signin.data = initialState.post.signin.data;
                draft.post.signin.error = action.payload;
            }),

        [ASYNC_SIGNIN_POST.INITIAL]: (state, action) =>
            produce(state, (draft) => {
                draft.post.signin.isLoading = false;
                draft.post.signin.data = initialState.post.signin.data;
                draft.post.signin.error = initialState.post.signin.error;
            }),

        [ASYNC_SIGNUP_POST.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.post.signup.isLoading = true;
                draft.post.signup.data = initialState.post.signup.data;
                draft.post.signup.error = initialState.post.signup.error;
            }),
        [ASYNC_SIGNUP_POST.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.post.signup.isLoading = false;
                draft.post.signup.data = action.payload;
                draft.post.signup.error = initialState.post.signup.error;
            }),
        [ASYNC_SIGNUP_POST.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.post.signup.isLoading = false;
                draft.post.signup.data = initialState.post.signup.data;
                draft.post.signup.error = action.payload;
            }),

        [ASYNC_SIGNUP_POST.INITIAL]: (state, action) =>
            produce(state, (draft) => {
                draft.post.signup.isLoading = false;
                draft.post.signup.data = initialState.post.signup.data;
                draft.post.signup.error = initialState.post.signup.error;
            }),

        [ASYNC_INVITE_POST.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.post.invite.isLoading = true;
                draft.post.invite.data = initialState.post.invite.data;
                draft.post.invite.error = initialState.post.invite.error;
            }),
        [ASYNC_INVITE_POST.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.post.invite.isLoading = false;
                draft.post.invite.data = action.payload;
                draft.post.invite.error = initialState.post.invite.error;
            }),
        [ASYNC_INVITE_POST.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.post.invite.isLoading = false;
                draft.post.invite.data = initialState.post.invite.data;
                draft.post.invite.error = action.payload;
            }),

        [ASYNC_INVITE_POST.INITIAL]: (state, action) =>
            produce(state, (draft) => {
                draft.post.invite.isLoading = false;
                draft.post.invite.data = initialState.post.invite.data;
                draft.post.invite.error = initialState.post.invite.error;
            }),
    },
    initialState
);
