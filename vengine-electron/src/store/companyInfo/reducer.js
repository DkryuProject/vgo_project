import { handleActions } from 'redux-actions';
import { produce } from 'immer';
import { asyncActionCreator, asyncAction } from 'core/utils/reduxUtil';

// 1. 각 모듈별 함수 구분을 위한 prefix 각 모듈 파일명 + '/'의 조합으로 구성
const prefix = 'companyinfo/';

// 2. 액션에 대해서 정의 및 액션 생성자 함수에 대해서 정의

// 전체 조회
export const ASYNC_SEARCH_PAGE = asyncActionCreator(`${prefix}SEARCH_PAGE`);
export const companySearchPageAsyncAction = asyncAction(ASYNC_SEARCH_PAGE);

// 전체 리스트 조회
export const ASYNC_SEARCH_LISTS = asyncActionCreator(`${prefix}SEARCH_LISTS`);
export const companySearchListsAsyncAction = asyncAction(ASYNC_SEARCH_LISTS);

// 전체 사이즈
export const ASYNC_COMPANY_GARMENT_GET_SIZES = asyncActionCreator(
    `${prefix}COMPANY_GARMENT_GET_SIZES`
);
export const companyGarmentGetSizesAsyncAction = asyncAction(
    ASYNC_COMPANY_GARMENT_GET_SIZES
);

// 사이즈 (GourpName)
export const ASYNC_COMPANY_GARMENT_GET_SIZE = asyncActionCreator(
    `${prefix}COMPANY_GARMENT_GET_SIZE`
);
export const companyGarmentGetSizeAsyncAction = asyncAction(
    ASYNC_COMPANY_GARMENT_GET_SIZE
);

// 약관 조회
export const ASYNC_COMPANY_GET_TERMS = asyncActionCreator(
    `${prefix}COMPANY_GET_TERMS`
);
export const companyGetTermsAsyncAction = asyncAction(ASYNC_COMPANY_GET_TERMS);

// 약관 저장 및 수정
export const ASYNC_COMPANY_POST_TERMS = asyncActionCreator(
    `${prefix}COMPANY_POST_TERMS`
);
export const companyPostTermsAsyncAction = asyncAction(
    ASYNC_COMPANY_POST_TERMS
);

// 약관 삭제
export const ASYNC_COMPANY_DELETE_TERMS = asyncActionCreator(
    `${prefix}COMPANY_DELETE_TERMS`
);
export const companyDeleteTermsAsyncAction = asyncAction(
    ASYNC_COMPANY_DELETE_TERMS
);

// 비즈니스 관계 조회
export const ASYNC_COMPANY_BIZ_GET_RELATION = asyncActionCreator(
    `${prefix}COMPANY_BIZ_GET_RELATION`
);
export const companyBizGetRelationAsyncAction = asyncAction(
    ASYNC_COMPANY_BIZ_GET_RELATION
);

// 비즈니스 관계 저장
export const ASYNC_COMPANY_BIZ_POST_RELATION = asyncActionCreator(
    `${prefix}COMPANY_BIZ_POST_RELATION`
);
export const companyBizPostRelationAsyncAction = asyncAction(
    ASYNC_COMPANY_BIZ_POST_RELATION
);

// 비즈니스 새로 생성
export const ASYNC_COMPANY_BIZ_POST_NEW_PARTNER = asyncActionCreator(
    `${prefix}COMPANY_BIZ_POST_NEW_PARTNER`
);
export const companyBizPostNewPartnerAsyncAction = asyncAction(
    ASYNC_COMPANY_BIZ_POST_NEW_PARTNER
);

// 비즈니스 요청 조회
export const ASYNC_COMPANY_BIZ_GET_REQUEST = asyncActionCreator(
    `${prefix}COMPANY_BIZ_GET_REQUEST`
);
export const companyBizGetRequestAsyncAction = asyncAction(
    ASYNC_COMPANY_BIZ_GET_REQUEST
);

// 비즈니스 요청 승인/반려
export const ASYNC_COMPANY_BIZ_PUT_REQUEST_STATUS = asyncActionCreator(
    `${prefix}COMPANY_BIZ_PUT_REQUEST_STATUS`
);
export const companyBizPutRequestStatusAsyncAction = asyncAction(
    ASYNC_COMPANY_BIZ_PUT_REQUEST_STATUS
);

// 비즈니스 재요청 / 해지
export const ASYNC_COMPANY_BIZ_PUT_RELATION_STATUS = asyncActionCreator(
    `${prefix}COMPANY_BIZ_PUT_RELATION_STATUS`
);
export const companyBizPutRelationStatusAsyncAction = asyncAction(
    ASYNC_COMPANY_BIZ_PUT_RELATION_STATUS
);

//저장
export const ASYNC_SAVE = asyncActionCreator(`${prefix}SAVE`);
export const companyInfoSaveAsyncAction = asyncAction(ASYNC_SAVE);

//Relation저장
export const ASYNC_RELATION_SAVE = asyncActionCreator(`${prefix}RELATION_SAVE`);
export const companyRelationSaveAsyncAction = asyncAction(ASYNC_RELATION_SAVE);

//Buyer 관리 저장
export const ASYNC_BUYER_SAVE = asyncActionCreator(`${prefix}BUYER_SAVE`);
export const companyBuyerSaveAsyncAction = asyncAction(ASYNC_BUYER_SAVE);

// 비즈니스 상태 수정
export const ASYNC_COMPANY_BIZ_PUT_STATUS = asyncActionCreator(
    `${prefix}COMPANY_BIZ_PUT_STATUS`
);
export const companyBizPutStatusAsyncAction = asyncAction(
    ASYNC_COMPANY_BIZ_PUT_STATUS
);

//삭제
export const ASYNC_DELETE = asyncActionCreator(`${prefix}DELETE`);
export const companyInfoDeleteAsyncAction = asyncAction(ASYNC_DELETE);

// 3. 리듀서의 값을 정의
const initialState = {
    search: {
        isLoading: false,
        data: null,
        error: null,
    },
    searchLists: {
        isLoading: false,
        data: null,
    },
    get: {
        sizes: {
            isLoading: false,
            data: null,
            error: null,
        },
        size: {
            isLoading: false,
            data: null,
            error: null,
        },
        bizRelation: {
            isLoading: false,
            data: null,
            error: null,
        },
        terms: {
            isLoading: false,
            data: null,
            error: null,
        },
        bizRequest: {
            isLoading: false,
            data: null,
            error: null,
        },
    },

    postBizRelation: {
        isLoading: false,
        data: null,
        error: null,
    },
    postBizNewPartner: {
        isLoading: false,
        data: null,
        error: null,
    },
    postTerms: {
        isLoading: false,
        data: null,
        error: null,
    },
    save: {
        isLoading: false,
        data: null,
        error: null,
    },

    put: {
        bizStatus: {
            isLoading: false,
            data: null,
            error: null,
        },
        bizRequestStatus: {
            isLoading: false,
            data: null,
            error: null,
        },
        bizRelationStatus: {
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
    deleteTerms: {
        isLoading: false,
        data: null,
        error: null,
    },
};

// 4. 리듀서를 정의
export const companyInfoReducer = handleActions(
    {
        [ASYNC_SEARCH_PAGE.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.search.isLoading = true;
                draft.search.data = initialState.search.data;
                draft.search.error = initialState.search.error;
            }),
        [ASYNC_SEARCH_PAGE.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.search.isLoading = false;
                draft.search.data = action.payload;
            }),
        [ASYNC_SEARCH_PAGE.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.search.isLoading = false;
                draft.search.error = action.payload;
            }),

        [ASYNC_SEARCH_LISTS.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.searchLists.isLoading = true;
            }),
        [ASYNC_SEARCH_LISTS.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.searchLists.isLoading = false;
                draft.searchLists.data = {
                    type: action.payload.type,
                    result: action.payload.data,
                };
            }),
        [ASYNC_SEARCH_LISTS.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.searchLists.isLoading = false;
            }),

        [ASYNC_COMPANY_GARMENT_GET_SIZES.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.get.sizes.isLoading = true;
                draft.get.sizes.data = initialState.get.sizes.data;
                draft.get.sizes.error = initialState.get.sizes.error;
            }),
        [ASYNC_COMPANY_GARMENT_GET_SIZES.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.get.sizes.isLoading = false;
                draft.get.sizes.data = action.payload;
            }),
        [ASYNC_COMPANY_GARMENT_GET_SIZES.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.get.sizes.isLoading = false;
                draft.get.sizes.error = action.payload;
            }),

        [ASYNC_COMPANY_GARMENT_GET_SIZE.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.get.size.isLoading = true;
                draft.get.size.data = initialState.get.size.data;
                draft.get.size.error = initialState.get.size.error;
            }),
        [ASYNC_COMPANY_GARMENT_GET_SIZE.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.get.size.isLoading = false;
                draft.get.size.data = action.payload;
            }),
        [ASYNC_COMPANY_GARMENT_GET_SIZE.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.get.size.isLoading = false;
                draft.get.size.error = action.payload;
            }),

        [ASYNC_COMPANY_BIZ_GET_RELATION.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.get.bizRelation.isLoading = true;
                draft.get.bizRelation.data = initialState.get.bizRelation.data;
                draft.get.bizRelation.error =
                    initialState.get.bizRelation.error;
            }),
        [ASYNC_COMPANY_BIZ_GET_RELATION.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.get.bizRelation.isLoading = false;
                draft.get.bizRelation.data = action.payload;
                draft.get.bizRelation.error =
                    initialState.get.bizRelation.error;
            }),
        [ASYNC_COMPANY_BIZ_GET_RELATION.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.get.bizRelation.isLoading = false;
                draft.get.bizRelation.data = initialState.get.bizRelation.data;
                draft.get.bizRelation.error = action.payload;
            }),

        [ASYNC_COMPANY_BIZ_GET_RELATION.INITIAL]: (state, action) =>
            produce(state, (draft) => {
                draft.get.bizRelation.isLoading = false;
                draft.get.bizRelation.data = initialState.get.bizRelation.data;
                draft.get.bizRelation.error =
                    initialState.get.bizRelation.error;
            }),

        [ASYNC_COMPANY_BIZ_GET_REQUEST.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.get.bizRequest.isLoading = true;
                draft.get.bizRequest.data = initialState.get.bizRequest.data;
                draft.get.bizRequest.error = initialState.get.bizRequest.error;
            }),
        [ASYNC_COMPANY_BIZ_GET_REQUEST.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.get.bizRequest.isLoading = false;
                draft.get.bizRequest.data = action.payload;
                draft.get.bizRequest.error = initialState.get.bizRequest.error;
            }),
        [ASYNC_COMPANY_BIZ_GET_REQUEST.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.get.bizRequest.isLoading = false;
                draft.get.bizRequest.data = initialState.get.bizRequest.data;
                draft.get.bizRequest.error = action.payload;
            }),

        [ASYNC_COMPANY_BIZ_GET_REQUEST.INITIAL]: (state, action) =>
            produce(state, (draft) => {
                draft.get.bizRequest.isLoading = false;
                draft.get.bizRequest.data = initialState.get.bizRequest.data;
                draft.get.bizRequest.error = initialState.get.bizRequest.error;
            }),

        [ASYNC_COMPANY_GET_TERMS.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.search.isLoading = true;
                draft.search.data = initialState.search.data;
                draft.search.error = initialState.search.error;
            }),
        [ASYNC_COMPANY_GET_TERMS.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.search.isLoading = false;
                draft.search.data = action.payload;
                draft.search.error = initialState.search.error;
            }),
        [ASYNC_COMPANY_GET_TERMS.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.search.isLoading = false;
                draft.search.data = initialState.search.data;
                draft.search.error = action.payload;
            }),

        [ASYNC_COMPANY_GET_TERMS.INITIAL]: (state, action) =>
            produce(state, (draft) => {
                draft.search.isLoading = false;
                draft.search.data = initialState.search.data;
                draft.search.error = initialState.search.error;
            }),

        [ASYNC_COMPANY_POST_TERMS.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.save.isLoading = true;
                draft.save.data = initialState.save.data;
                draft.save.error = initialState.save.error;
            }),
        [ASYNC_COMPANY_POST_TERMS.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.save.isLoading = false;
                draft.save.data = action.payload;
                draft.save.error = initialState.save.error;
            }),
        [ASYNC_COMPANY_POST_TERMS.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.save.isLoading = false;
                draft.save.data = initialState.save.data;
                draft.save.error = action.payload;
            }),

        [ASYNC_COMPANY_POST_TERMS.INITIAL]: (state, action) =>
            produce(state, (draft) => {
                draft.save.isLoading = false;
                draft.save.data = initialState.save.data;
                draft.save.error = initialState.save.error;
            }),

        [ASYNC_COMPANY_DELETE_TERMS.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.delete.isLoading = true;
                draft.delete.data = initialState.delete.data;
                draft.delete.error = initialState.delete.error;
            }),
        [ASYNC_COMPANY_DELETE_TERMS.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.delete.isLoading = false;
                draft.delete.data = action.payload;
                draft.delete.error = initialState.delete.error;
            }),
        [ASYNC_COMPANY_DELETE_TERMS.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.delete.isLoading = false;
                draft.delete.data = initialState.delete.data;
                draft.delete.error = action.payload;
            }),

        [ASYNC_COMPANY_DELETE_TERMS.INITIAL]: (state, action) =>
            produce(state, (draft) => {
                draft.delete.isLoading = false;
                draft.delete.data = initialState.delete.data;
                draft.delete.error = initialState.delete.error;
            }),

        [ASYNC_COMPANY_BIZ_POST_RELATION.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.postBizRelation.isLoading = true;
                draft.postBizRelation.data = initialState.postBizRelation.data;
                draft.postBizRelation.error =
                    initialState.postBizRelation.error;
            }),
        [ASYNC_COMPANY_BIZ_POST_RELATION.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.postBizRelation.isLoading = false;
                draft.postBizRelation.data = action.payload;
                draft.postBizRelation.error =
                    initialState.postBizRelation.error;
            }),
        [ASYNC_COMPANY_BIZ_POST_RELATION.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.postBizRelation.isLoading = false;
                draft.postBizRelation.data = initialState.postBizRelation.data;
                draft.postBizRelation.error = action.payload;
            }),

        [ASYNC_COMPANY_BIZ_POST_RELATION.INITIAL]: (state, action) =>
            produce(state, (draft) => {
                draft.postBizRelation.isLoading = false;
                draft.postBizRelation.data = initialState.postBizRelation.data;
                draft.postBizRelation.error =
                    initialState.postBizRelation.error;
            }),

        [ASYNC_COMPANY_BIZ_POST_NEW_PARTNER.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.postBizNewPartner.isLoading = true;
                draft.postBizNewPartner.data =
                    initialState.postBizNewPartner.data;
                draft.postBizNewPartner.error =
                    initialState.postBizRelation.error;
            }),
        [ASYNC_COMPANY_BIZ_POST_NEW_PARTNER.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.postBizNewPartner.isLoading = false;
                draft.postBizNewPartner.data = action.payload;
                draft.postBizNewPartner.error =
                    initialState.postBizNewPartner.error;
            }),
        [ASYNC_COMPANY_BIZ_POST_NEW_PARTNER.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.postBizNewPartner.isLoading = false;
                draft.postBizNewPartner.data =
                    initialState.postBizNewPartner.data;
                draft.postBizNewPartner.error = action.payload;
            }),

        [ASYNC_COMPANY_BIZ_POST_NEW_PARTNER.INITIAL]: (state, action) =>
            produce(state, (draft) => {
                draft.postBizNewPartner.isLoading = false;
                draft.postBizNewPartner.data =
                    initialState.postBizNewPartner.data;
                draft.postBizNewPartner.error =
                    initialState.postBizNewPartner.error;
            }),

        [ASYNC_SAVE.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.save.isLoading = true;
                draft.save.data = initialState.save.data;
                draft.save.error = initialState.save.error;
            }),
        [ASYNC_SAVE.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.save.isLoading = false;
                draft.save.data = action.payload;
            }),
        [ASYNC_SAVE.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.save.isLoading = false;
                draft.save.error = action.payload;
            }),
        [ASYNC_SAVE.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.save.isLoading = false;
                draft.save.data = initialState.save.data;
                draft.save.error = initialState.save.error;
            }),

        [ASYNC_RELATION_SAVE.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.save.isLoading = true;
                draft.save.data = initialState.save.data;
                draft.save.error = initialState.save.error;
            }),
        [ASYNC_RELATION_SAVE.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.save.isLoading = false;
                draft.save.data = action.payload;
            }),
        [ASYNC_RELATION_SAVE.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.save.isLoading = false;
                draft.save.error = action.payload;
            }),
        [ASYNC_RELATION_SAVE.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.save.isLoading = false;
                draft.save.data = initialState.save.data;
                draft.save.error = initialState.save.error;
            }),

        [ASYNC_BUYER_SAVE.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.save.isLoading = true;
            }),
        [ASYNC_BUYER_SAVE.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.save.isLoading = false;
                draft.save.data = action.payload;
            }),
        [ASYNC_BUYER_SAVE.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.save.isLoading = false;
                draft.save.data = action.payload;
            }),
        [ASYNC_BUYER_SAVE.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.save.isLoading = false;
                draft.save.data = initialState.save.data;
            }),

        [ASYNC_COMPANY_BIZ_PUT_STATUS.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.put.bizStatus.isLoading = true;
                draft.put.bizStatus.data = initialState.put.bizStatus.data;
                draft.put.bizStatus.error = initialState.put.bizStatus.error;
            }),
        [ASYNC_COMPANY_BIZ_PUT_STATUS.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.put.bizStatus.isLoading = false;
                draft.put.bizStatus.data = action.payload;
                draft.put.bizStatus.error = initialState.put.bizStatus.error;
            }),
        [ASYNC_COMPANY_BIZ_PUT_STATUS.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.put.bizStatus.isLoading = false;
                draft.put.bizStatus.data = initialState.put.bizStatus.data;
                draft.put.bizStatus.error = action.payload;
            }),

        [ASYNC_COMPANY_BIZ_PUT_STATUS.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.put.bizStatus.isLoading = false;
                draft.put.bizStatus.data = initialState.put.bizStatus.data;
                draft.put.bizStatus.error = initialState.put.bizStatus.error;
            }),

        [ASYNC_COMPANY_BIZ_PUT_REQUEST_STATUS.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.put.bizRequestStatus.isLoading = true;
                draft.put.bizRequestStatus.data =
                    initialState.put.bizRequestStatus.data;
                draft.put.bizRequestStatus.error =
                    initialState.put.bizRequestStatus.error;
            }),
        [ASYNC_COMPANY_BIZ_PUT_REQUEST_STATUS.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.put.bizRequestStatus.isLoading = false;
                draft.put.bizRequestStatus.data = action.payload;
                draft.put.bizRequestStatus.error =
                    initialState.put.bizRequestStatus.error;
            }),
        [ASYNC_COMPANY_BIZ_PUT_REQUEST_STATUS.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.put.bizRequestStatus.isLoading = false;
                draft.put.bizRequestStatus.data =
                    initialState.put.bizRequestStatus.data;
                draft.put.bizRequestStatus.error = action.payload;
            }),

        [ASYNC_COMPANY_BIZ_PUT_REQUEST_STATUS.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.put.bizRequestStatus.isLoading = false;
                draft.put.bizRequestStatus.data =
                    initialState.put.bizRequestStatus.data;
                draft.put.bizRequestStatus.error =
                    initialState.put.bizRequestStatus.error;
            }),

        [ASYNC_COMPANY_BIZ_PUT_RELATION_STATUS.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.put.bizRelationStatus.isLoading = true;
                draft.put.bizRelationStatus.data =
                    initialState.put.bizRelationStatus.data;
                draft.put.bizRelationStatus.error =
                    initialState.put.bizRelationStatus.error;
            }),
        [ASYNC_COMPANY_BIZ_PUT_RELATION_STATUS.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.put.bizRelationStatus.isLoading = false;
                draft.put.bizRelationStatus.data = action.payload;
                draft.put.bizRelationStatus.error =
                    initialState.put.bizRelationStatus.error;
            }),
        [ASYNC_COMPANY_BIZ_PUT_RELATION_STATUS.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.put.bizRelationStatus.isLoading = false;
                draft.put.bizRelationStatus.data =
                    initialState.put.bizRelationStatus.data;
                draft.put.bizRelationStatus.error = action.payload;
            }),

        [ASYNC_COMPANY_BIZ_PUT_RELATION_STATUS.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.put.bizRelationStatus.isLoading = false;
                draft.put.bizRelationStatus.data =
                    initialState.put.bizRelationStatus.data;
                draft.put.bizRelationStatus.error =
                    initialState.put.bizRelationStatus.error;
            }),

        [ASYNC_DELETE.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.delete.isLoading = true;
            }),
        [ASYNC_DELETE.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.delete.isLoading = false;
                draft.delete.data = action.payload;
            }),
        [ASYNC_DELETE.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.delete.isLoading = false;
                draft.delete.data = action.payload;
            }),
        [ASYNC_DELETE.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.delete.isLoading = false;
                draft.delete.data = initialState.save.data;
            }),
    },
    initialState
);
