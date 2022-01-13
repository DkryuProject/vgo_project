import { handleActions } from 'redux-actions';
import { produce } from 'immer';
import { asyncActionCreator, asyncAction } from 'core/utils/reduxUtil';

// 1. 각 모듈별 함수 구분을 위한 prefix 각 모듈 파일명 + '/'의 조합으로 구성
const prefix = 'common/year/';

// 2. 액션에 대해서 정의 및 액션 생성자 함수에 대해서 정의

// 년 리스트 조회
export const ASYNC_COMMON_YEAR_GET_LISTS = asyncActionCreator(
    `${prefix}COMMON_YEAR_GET_LISTS`
);
export const commonYearGetListsAsyncAction = asyncAction(
    ASYNC_COMMON_YEAR_GET_LISTS
);

// 3. 리듀서의 값을 정의
const initialState = {
    get: {
        lists: {
            isLoading: false,
            data: null,
            error: null,
        },
    },
};

// 4. 리듀서를 정의
export const commonYearReducer = handleActions(
    {
        [ASYNC_COMMON_YEAR_GET_LISTS.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.get.lists.isLoading = true;
                draft.get.lists.data = initialState.get.lists.data;
                draft.get.lists.error = initialState.get.lists.error;
            }),
        [ASYNC_COMMON_YEAR_GET_LISTS.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.get.lists.isLoading = false;
                draft.get.lists.data = action.payload;
            }),
        [ASYNC_COMMON_YEAR_GET_LISTS.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.get.lists.isLoading = false;
                draft.get.lists.data = initialState.get.lists.data;
                draft.get.lists.error = action.payload;
            }),

        [ASYNC_COMMON_YEAR_GET_LISTS.INITIAL]: (state, action) =>
            produce(state, (draft) => {
                draft.get.lists.isLoading = false;
                draft.get.lists.data = initialState.get.lists.data;
                draft.get.lists.error = initialState.get.lists.error;
            }),
    },
    initialState
);
