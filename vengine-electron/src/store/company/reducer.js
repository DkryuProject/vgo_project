import { handleActions } from 'redux-actions';
import { produce } from 'immer';
import { asyncActionCreator, asyncAction } from 'core/utils/reduxUtil';

// 1. 각 모듈별 함수 구분을 위한 prefix 각 모듈 파일명 + '/'의 조합으로 구성
const prefix = 'company/';

// 2. 액션에 대해서 정의 및 액션 생성자 함수에 대해서 정의

// 회사 전체 조회
export const ASYNC_COMPANY_GET_LISTS = asyncActionCreator(
    `${prefix}COMPANY_GET_LISTS`
);
export const companyGetListsAsyncAction = asyncAction(ASYNC_COMPANY_GET_LISTS);

// 회사 조회(ID)
export const ASYNC_COMPANY_GET_ID = asyncActionCreator(
    `${prefix}COMPANY_GET_ID`
);
export const companyGetIdAsyncAction = asyncAction(ASYNC_COMPANY_GET_ID);

// 회사 코드로 조회
export const ASYNC_COMPANY_GET_CODE = asyncActionCreator(
    `${prefix}COMPANY_GET_CODE`
);
export const companyGetCodeAsyncAction = asyncAction(ASYNC_COMPANY_GET_CODE);

// 회사 이름으로 조회
export const ASYNC_COMPANY_GET_NAME = asyncActionCreator(
    `${prefix}COMPANY_GET_NAME`
);
export const companyGetNameAsyncAction = asyncAction(ASYNC_COMPANY_GET_NAME);

// 회사 조회(Relation type)
export const ASYNC_COMPANY_GET_RELATION_TYPE = asyncActionCreator(
    `${prefix}COMPANY_GET_RELATION_TYPE`
);
export const companyGetRelationTypeAsyncAction = asyncAction(
    ASYNC_COMPANY_GET_RELATION_TYPE
);

// 회사별 주소 조회
export const ASYNC_COMPANY_GET_ADDRESS = asyncActionCreator(
    `${prefix}COMPANY_GET_ADDRESS`
);
export const companyGetAddressAsyncAction = asyncAction(
    ASYNC_COMPANY_GET_ADDRESS
);

// 회사 조회(BRAND)
export const ASYNC_COMPANY_GET_BRAND = asyncActionCreator(
    `${prefix}COMPANY_GET_BRAND`
);
export const companyGetBrandAsyncAction = asyncAction(ASYNC_COMPANY_GET_BRAND);

// 회사 조회(Search)
export const ASYNC_COMPANY_GET_SEARCH = asyncActionCreator(
    `${prefix}COMPANY_GET_SEARCH`
);
export const companyGetSearchAsyncAction = asyncAction(
    ASYNC_COMPANY_GET_SEARCH
);

// 회사 수정
export const ASYNC_COMPANY_PUT = asyncActionCreator(`${prefix}COMPANY_PUT`);
export const companyPutAsyncAction = asyncAction(ASYNC_COMPANY_PUT);

// 회사 비즈니스 파일  등록
export const ASYNC_COMPANY_POST_IMAGE = asyncActionCreator(
    `${prefix}COMPANY_POST_IMAGE`
);
export const companyPostImageAsyncAction = asyncAction(
    ASYNC_COMPANY_POST_IMAGE
);

// 3. 리듀서의 값을 정의
const initialState = {
    get: {
        lists: {
            isLoading: false,
            data: null,
            error: null,
        },
        id: {
            isLoading: false,
            data: null,
            error: null,
        },
        code: {
            isLoading: false,
            data: null,
            error: null,
        },
        name: {
            isLoading: false,
            data: null,
            error: null,
        },
        relationType: {
            isLoading: false,
            data: null,
            error: null,
        },
        address: {
            isLoading: false,
            data: null,
            error: null,
        },
        brand: {
            isLoading: false,
            data: null,
            error: null,
        },
        search: {
            isLoading: false,
            data: null,
            error: null,
        },
    },
    postImage: {
        isLoading: false,
        data: null,
        error: null,
    },
    put: {
        isLoading: false,
        data: null,
        error: null,
    },
};

// 4. 리듀서를 정의
export const companyReducer = handleActions(
    {
        [ASYNC_COMPANY_GET_LISTS.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.get.lists.isLoading = true;
                draft.get.lists.data = initialState.get.lists.data;
                draft.get.lists.error = initialState.get.lists.error;
            }),
        [ASYNC_COMPANY_GET_LISTS.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.get.lists.isLoading = false;
                draft.get.lists.data = action.payload;
            }),
        [ASYNC_COMPANY_GET_LISTS.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.get.lists.isLoading = false;
                draft.get.lists.data = initialState.get.lists.data;
                draft.get.lists.error = action.payload;
            }),

        [ASYNC_COMPANY_GET_ID.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.get.id.isLoading = true;
                draft.get.id.data = initialState.get.id.data;
                draft.get.id.error = initialState.get.id.error;
            }),
        [ASYNC_COMPANY_GET_ID.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.get.id.isLoading = false;
                draft.get.id.data = action.payload;
            }),
        [ASYNC_COMPANY_GET_ID.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.get.id.isLoading = false;
                draft.get.id.data = initialState.get.id.data;
                draft.get.id.error = action.payload;
            }),

        [ASYNC_COMPANY_GET_CODE.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.get.code.isLoading = true;
                draft.get.code.data = initialState.get.code.data;
                draft.get.code.error = initialState.get.code.error;
            }),
        [ASYNC_COMPANY_GET_CODE.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.get.code.isLoading = false;
                draft.get.code.data = action.payload;
            }),
        [ASYNC_COMPANY_GET_CODE.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.get.code.isLoading = false;
                draft.get.code.data = initialState.get.code.data;
                draft.get.code.error = action.payload;
            }),

        [ASYNC_COMPANY_GET_NAME.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.get.name.isLoading = true;
                draft.get.name.data = initialState.get.name.data;
                draft.get.name.error = initialState.get.name.error;
            }),
        [ASYNC_COMPANY_GET_NAME.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.get.name.isLoading = false;
                draft.get.name.data = action.payload;
            }),
        [ASYNC_COMPANY_GET_NAME.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.get.name.isLoading = false;
                draft.get.name.data = initialState.get.name.data;
                draft.get.name.error = action.payload;
            }),

        [ASYNC_COMPANY_GET_NAME.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.get.name.isLoading = false;
                draft.get.name.data = initialState.get.name.data;
                draft.get.name.error = initialState.get.name.error;
            }),

        [ASYNC_COMPANY_GET_RELATION_TYPE.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.get.relationType.isLoading = true;
                draft.get.relationType.data =
                    initialState.get.relationType.data;
                draft.get.relationType.error =
                    initialState.get.relationType.error;
            }),
        [ASYNC_COMPANY_GET_RELATION_TYPE.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.get.relationType.isLoading = false;
                draft.get.relationType.data = action.payload;
            }),
        [ASYNC_COMPANY_GET_RELATION_TYPE.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.get.relationType.isLoading = false;
                draft.get.relationType.error = action.payload;
            }),

        [ASYNC_COMPANY_GET_RELATION_TYPE.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.get.relationType.isLoading = false;
                draft.get.relationType.data =
                    initialState.get.relationType.data;
                draft.get.relationType.error =
                    initialState.get.relationType.error;
            }),

        [ASYNC_COMPANY_GET_ADDRESS.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.get.address.isLoading = true;
                draft.get.address.data = initialState.get.address.data;
                draft.get.address.error = initialState.get.address.error;
            }),
        [ASYNC_COMPANY_GET_ADDRESS.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.get.address.isLoading = false;
                draft.get.address.data = action.payload;
            }),
        [ASYNC_COMPANY_GET_ADDRESS.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.get.address.isLoading = false;
                draft.get.address.error = action.payload;
            }),

        [ASYNC_COMPANY_GET_ADDRESS.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.get.address.isLoading = false;
                draft.get.address.data = initialState.get.address.data;
                draft.get.address.error = initialState.get.address.error;
            }),

        [ASYNC_COMPANY_GET_BRAND.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.get.brand.isLoading = true;
                draft.get.brand.data = initialState.get.brand.data;
                draft.get.brand.error = initialState.get.brand.error;
            }),
        [ASYNC_COMPANY_GET_BRAND.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.get.brand.isLoading = false;
                draft.get.brand.data = action.payload;
            }),
        [ASYNC_COMPANY_GET_BRAND.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.get.brand.isLoading = false;
                draft.get.brand.error = action.payload;
            }),

        [ASYNC_COMPANY_GET_BRAND.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.get.brand.isLoading = false;
                draft.get.brand.data = initialState.get.brand.data;
                draft.get.brand.error = initialState.get.brand.error;
            }),

        [ASYNC_COMPANY_GET_SEARCH.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.get.search.isLoading = true;
                draft.get.search.data = initialState.get.search.data;
                draft.get.search.error = initialState.get.search.error;
            }),
        [ASYNC_COMPANY_GET_SEARCH.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.get.search.isLoading = false;
                draft.get.search.data = action.payload;
            }),
        [ASYNC_COMPANY_GET_SEARCH.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.get.search.isLoading = false;
                draft.get.search.data = initialState.get.search.data;
                draft.get.search.error = action.payload;
            }),

        [ASYNC_COMPANY_GET_SEARCH.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.get.search.isLoading = false;
                draft.get.search.data = initialState.get.search.data;
                draft.get.search.error = initialState.get.search.error;
            }),

        [ASYNC_COMPANY_POST_IMAGE.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.postImage.isLoading = true;
                draft.postImage.data = initialState.postImage.data;
                draft.postImage.error = initialState.postImage.error;
            }),
        [ASYNC_COMPANY_POST_IMAGE.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.postImage.isLoading = false;
                draft.postImage.data = action.payload;
            }),
        [ASYNC_COMPANY_POST_IMAGE.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.postImage.isLoading = false;
                draft.postImage.data = initialState.postImage.data;
                draft.postImage.error = action.payload;
            }),
        [ASYNC_COMPANY_POST_IMAGE.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.postImage.isLoading = false;
                draft.postImage.data = initialState.postImage.data;
                draft.postImage.error = initialState.postImage.error;
            }),

        [ASYNC_COMPANY_PUT.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.put.isLoading = true;
                draft.put.data = initialState.put.data;
                draft.put.error = initialState.put.error;
            }),
        [ASYNC_COMPANY_PUT.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.put.isLoading = false;
                draft.put.data = action.payload;
            }),
        [ASYNC_COMPANY_PUT.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.put.isLoading = false;
                draft.put.data = initialState.put.data;
                draft.put.error = action.payload;
            }),
        [ASYNC_COMPANY_PUT.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.put.isLoading = false;
                draft.put.data = initialState.put.data;
                draft.put.error = initialState.put.error;
            }),
    },
    initialState
);
