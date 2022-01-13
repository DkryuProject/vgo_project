import { handleActions } from 'redux-actions';
import { produce } from 'immer';
import { asyncActionCreator, asyncAction } from 'core/utils/reduxUtil';

// 1. 각 모듈별 함수 구분을 위한 prefix 각 모듈 파일명 + '/'의 조합으로 구성
const prefix = 'user/menu/';

// 2. 액션에 대해서 정의 및 액션 생성자 함수에 대해서 정의
export const ASYNC_USER_MENU_GET_MY = asyncActionCreator(
    `${prefix}USER_MENU_GET_MY`
);
export const userMenuGetMyAsyncAction = asyncAction(ASYNC_USER_MENU_GET_MY);

export const ASYNC_USER_MENU_GET_MENUTYPE = asyncActionCreator(
    `${prefix}USER_MENU_GET_MENUTYPE`
);
export const userMenuGetMenuTypeAsyncAction = asyncAction(
    ASYNC_USER_MENU_GET_MENUTYPE
);

// 3. 리듀서의 값을 정의
const initialState = {
    get: {
        my: {
            isLoading: false,
            data: null,
            error: null,
        },
        menuType: {
            isLoading: false,
            data: null,
            error: null,
        },
    },
};

// 4. 리듀서를 정의
export const userMenuReducer = handleActions(
    {
        [ASYNC_USER_MENU_GET_MY.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.get.my.isLoading = true;
                draft.get.my.data = initialState.get.my.data;
                draft.get.my.error = initialState.get.my.error;
            }),
        [ASYNC_USER_MENU_GET_MY.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.get.my.isLoading = false;
                draft.get.my.data = action.payload;
            }),
        [ASYNC_USER_MENU_GET_MY.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.get.my.isLoading = false;
                draft.get.my.data = initialState.get.my.data;
                draft.get.my.error = action.payload;
            }),

        [ASYNC_USER_MENU_GET_MENUTYPE.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.get.menuType.isLoading = true;
                draft.get.menuType.data = initialState.get.menuType.data;
                draft.get.menuType.error = initialState.get.menuType.error;
            }),
        [ASYNC_USER_MENU_GET_MENUTYPE.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.get.menuType.isLoading = false;
                draft.get.menuType.data = action.payload;
            }),
        [ASYNC_USER_MENU_GET_MENUTYPE.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.get.menuType.isLoading = false;
                draft.get.menuType.data = initialState.get.menuType.data;
                draft.get.menuType.error = action.payload;
            }),
        [ASYNC_USER_MENU_GET_MENUTYPE.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.get.menuType.isLoading = false;
                draft.get.menuType.data = initialState.get.menuType.data;
                draft.get.menuType.error = initialState.get.menuType.error;
            }),
    },
    initialState
);
