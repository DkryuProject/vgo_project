import { handleActions } from 'redux-actions';
import { produce } from 'immer';
import { asyncActionCreator, asyncAction } from 'core/utils/reduxUtil';

// 1. 각 모듈별 함수 구분을 위한 prefix 각 모듈 파일명 + '/'의 조합으로 구성
const prefix = 'common/basic/';

// 2. 액션에 대해서 정의 및 액션 생성자 함수에 대해서 정의

// 공통정보 ID로 조회
export const ASYNC_COMMON_BASIC_GET_ID = asyncActionCreator(
    `${prefix}COMMON_BASIC_GET_ID`
);
export const commonBasicGetIdAsyncAction = asyncAction(
    ASYNC_COMMON_BASIC_GET_ID
);

// 공통 기준 정보 타입별 리스트 조회
export const ASYNC_COMMON_BASIC_GET_LISTS = asyncActionCreator(
    `${prefix}COMMON_BASIC_GET_LISTS`
);
export const commonBasicGetListsAsyncAction = asyncAction(
    ASYNC_COMMON_BASIC_GET_LISTS
);

// 공통 기준 정보 타입별 페이지 조회
export const ASYNC_COMMON_BASIC_GET_PAGES = asyncActionCreator(
    `${prefix}COMMON_BASIC_GET_PAGES`
);
export const commonBasicGetPagesAsyncAction = asyncAction(
    ASYNC_COMMON_BASIC_GET_PAGES
);

// 공통 기준 정보 국가 조회
export const ASYNC_COMMON_BASIC_GET_COUNTRIES = asyncActionCreator(
    `${prefix}COMMON_BASIC_GET_COUNTRIES`
);
export const commonBasicGetCountriesAsyncAction = asyncAction(
    ASYNC_COMMON_BASIC_GET_COUNTRIES
);

// 공통 기준 정보 도시 조회
export const ASYNC_COMMON_BASIC_GET_CITIES = asyncActionCreator(
    `${prefix}COMMON_BASIC_GET_CITIES`
);
export const commonBasicGetCitiesAsyncAction = asyncAction(
    ASYNC_COMMON_BASIC_GET_CITIES
);

// 공통 기준 정보 단위 조회
export const ASYNC_COMMON_BASIC_GET_UOM = asyncActionCreator(
    `${prefix}COMMON_BASIC_GET_UOM`
);
export const commonBasicGetUomAsyncAction = asyncAction(
    ASYNC_COMMON_BASIC_GET_UOM
);

// 공통 기준 정보 port 조회
export const ASYNC_COMMON_BASIC_GET_PORT = asyncActionCreator(
    `${prefix}COMMON_BASIC_GET_PORT`
);
export const commonBasicGetPortAsyncAction = asyncAction(
    ASYNC_COMMON_BASIC_GET_PORT
);

// 공통 정보 저장
export const ASYNC_COMMON_BASIC_POST = asyncActionCreator(
    `${prefix}COMMON_BASIC_POST`
);
export const commonBasicPostAsyncAction = asyncAction(ASYNC_COMMON_BASIC_POST);

// 4. 리듀서의 값을 정의
const initialState = {
    get: {
        id: {
            isLoading: false,
            data: null,
            error: null,
        },
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
        countries: {
            isLoading: false,
            data: null,
            error: null,
        },
        cities: {
            isLoading: false,
            data: null,
            error: null,
        },
        uom: {
            isLoading: false,
            data: null,
            error: null,
        },
        port: {
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
};

// 4. 리듀서를 정의
export const commonBasicReducer = handleActions(
    {
        [ASYNC_COMMON_BASIC_GET_ID.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.get.id.isLoading = true;
                draft.get.id.data = initialState.get.id.data;
                draft.get.id.error = initialState.get.id.error;
            }),
        [ASYNC_COMMON_BASIC_GET_ID.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.get.id.isLoading = false;
                draft.get.id.data = action.payload;
            }),
        [ASYNC_COMMON_BASIC_GET_ID.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.get.id.isLoading = false;
                draft.get.id.data = initialState.get.id.data;
                draft.get.id.error = action.payload;
            }),
        [ASYNC_COMMON_BASIC_GET_LISTS.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.get.lists.isLoading = true;
                draft.get.lists.data = initialState.get.lists.data;
                draft.get.lists.error = initialState.get.lists.error;
            }),
        [ASYNC_COMMON_BASIC_GET_LISTS.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.get.lists.isLoading = false;
                draft.get.lists.data = action.payload;
            }),
        [ASYNC_COMMON_BASIC_GET_LISTS.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.get.lists.isLoading = false;
                draft.get.lists.data = initialState.get.lists.data;
                draft.get.lists.error = action.payload;
            }),
        [ASYNC_COMMON_BASIC_GET_LISTS.INITIAL]: (state, action) =>
            produce(state, (draft) => {
                draft.get.lists.isLoading = false;
                draft.get.lists.data = initialState.get.lists.data;
                draft.get.lists.error = initialState.get.lists.error;
            }),
        [ASYNC_COMMON_BASIC_GET_PAGES.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.get.pages.isLoading = true;
                draft.get.pages.data = initialState.get.pages.data;
                draft.get.pages.error = initialState.get.pages.error;
            }),
        [ASYNC_COMMON_BASIC_GET_PAGES.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.get.pages.isLoading = false;
                draft.get.pages.data = action.payload;
            }),
        [ASYNC_COMMON_BASIC_GET_PAGES.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.get.pages.isLoading = false;
                draft.get.pages.data = initialState.get.pages.data;
                draft.get.pages.error = action.payload;
            }),
        [ASYNC_COMMON_BASIC_GET_PAGES.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.get.pages.isLoading = false;
                draft.get.pages.data = initialState.get.pages.data;
                draft.get.pages.error = initialState.get.pages.error;
            }),

        [ASYNC_COMMON_BASIC_GET_COUNTRIES.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.get.countries.isLoading = true;
                draft.get.countries.data = initialState.get.countries.data;
                draft.get.countries.error = initialState.get.countries.error;
            }),
        [ASYNC_COMMON_BASIC_GET_COUNTRIES.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.get.countries.isLoading = false;
                draft.get.countries.data = action.payload;
            }),
        [ASYNC_COMMON_BASIC_GET_COUNTRIES.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.get.countries.isLoading = false;
                draft.get.countries.error = action.payload;
            }),
        [ASYNC_COMMON_BASIC_GET_COUNTRIES.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.get.countries.isLoading = false;
                draft.get.countries.data = initialState.get.countries.data;
                draft.get.countries.error = initialState.get.countries.error;
            }),

        [ASYNC_COMMON_BASIC_GET_CITIES.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.get.cities.isLoading = true;
                draft.get.cities.data = initialState.get.cities.data;
                draft.get.cities.error = initialState.get.cities.error;
            }),
        [ASYNC_COMMON_BASIC_GET_CITIES.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.get.cities.isLoading = false;
                draft.get.cities.data = action.payload;
            }),
        [ASYNC_COMMON_BASIC_GET_CITIES.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.get.cities.isLoading = false;
                draft.get.cities.error = action.payload;
            }),
        [ASYNC_COMMON_BASIC_GET_CITIES.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.get.cities.isLoading = false;
                draft.get.cities.data = initialState.get.cities.data;
                draft.get.cities.error = initialState.get.cities.error;
            }),

        [ASYNC_COMMON_BASIC_GET_UOM.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.get.uom.isLoading = true;
                draft.get.uom.data = initialState.get.uom.data;
                draft.get.uom.error = initialState.get.uom.error;
            }),
        [ASYNC_COMMON_BASIC_GET_UOM.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.get.uom.isLoading = false;
                draft.get.uom.data = action.payload;
            }),
        [ASYNC_COMMON_BASIC_GET_UOM.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.get.uom.isLoading = false;
                draft.get.uom.error = action.payload;
            }),
        [ASYNC_COMMON_BASIC_GET_UOM.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.get.uom.isLoading = false;
                draft.get.uom.data = initialState.get.uom.data;
                draft.get.uom.error = initialState.get.uom.error;
            }),

        [ASYNC_COMMON_BASIC_GET_PORT.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.get.port.isLoading = true;
                draft.get.port.data = initialState.get.port.data;
                draft.get.port.error = initialState.get.port.error;
            }),
        [ASYNC_COMMON_BASIC_GET_PORT.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.get.port.isLoading = false;
                draft.get.port.data = action.payload;
            }),
        [ASYNC_COMMON_BASIC_GET_PORT.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.get.port.isLoading = false;
                draft.get.port.error = action.payload;
            }),
        [ASYNC_COMMON_BASIC_GET_PORT.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.get.port.isLoading = false;
                draft.get.port.data = initialState.get.port.data;
                draft.get.port.error = initialState.get.port.error;
            }),

        [ASYNC_COMMON_BASIC_POST.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.post.isLoading = true;
                draft.post.data = initialState.post.data;
                draft.post.error = initialState.post.error;
            }),
        [ASYNC_COMMON_BASIC_POST.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.post.isLoading = false;
                draft.post.data = action.payload;
            }),
        [ASYNC_COMMON_BASIC_POST.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.post.isLoading = false;
                draft.post.data = initialState.post.data;
                draft.post.error = action.payload;
            }),
        [ASYNC_COMMON_BASIC_POST.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.post.isLoading = false;
                draft.post.data = initialState.post.data;
                draft.post.error = initialState.post.error;
            }),
    },
    initialState
);
