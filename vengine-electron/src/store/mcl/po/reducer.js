import { handleActions } from 'redux-actions';
import { produce } from 'immer';
import { asyncActionCreator, asyncAction } from 'core/utils/reduxUtil';

// 1. 각 모듈별 함수 구분을 위한 prefix 각 모듈 파일명 + '/'의 조합으로 구성
const prefix = 'mcl/po';

// 2. 액션에 대해서 정의 및 액션 생성자 함수에 대해서 정의

// 조회
export const ASYNC_MCL_PO_GET_PAGES = asyncActionCreator(
    `${prefix}MCL_PO_GET_PAGES`
);
export const mclPoGetPagesAsyncAction = asyncAction(ASYNC_MCL_PO_GET_PAGES);

export const ASYNC_MCL_PO_GET_ID = asyncActionCreator(`${prefix}MCL_PO_GET_ID`);
export const mclPoGetIdAsyncAction = asyncAction(ASYNC_MCL_PO_GET_ID);

export const ASYNC_MCL_PO_GET_ITEM_LISTS = asyncActionCreator(
    `${prefix}MCL_PO_GET_ITEM_LISTS`
);
export const mclPoGetItemListsAsyncAction = asyncAction(
    ASYNC_MCL_PO_GET_ITEM_LISTS
);

export const ASYNC_MCL_PO_GET_ITEM_ID = asyncActionCreator(
    `${prefix}MCL_PO_GET_ITEM_ID`
);
export const mclPoGetItemIdAsyncAction = asyncAction(ASYNC_MCL_PO_GET_ITEM_ID);

export const ASYNC_MCL_PO_GET_STYLE_NUMBER = asyncActionCreator(
    `${prefix}MCL_PO_GET_STYLE_NUMBER`
);
export const mclPoGetStyleNumberAsyncAction = asyncAction(
    ASYNC_MCL_PO_GET_STYLE_NUMBER
);

export const ASYNC_MCL_PO_GET_PUBLISH_ID = asyncActionCreator(
    `${prefix}MCL_PO_GET_PUBLISH_ID`
);
export const mclPoGetPublishIdAsyncAction = asyncAction(
    ASYNC_MCL_PO_GET_PUBLISH_ID
);

// 등록
export const ASYNC_MCL_PO_POST_ID = asyncActionCreator(
    `${prefix}MCL_PO_POST_ID`
);
export const mclPoPostIdAsyncAction = asyncAction(ASYNC_MCL_PO_POST_ID);

export const ASYNC_MCL_PO_POST_ITEM_ID = asyncActionCreator(
    `${prefix}MCL_PO_POST_ITEM_ID`
);
export const mclPoPostItemIdAsyncAction = asyncAction(
    ASYNC_MCL_PO_POST_ITEM_ID
);

export const ASYNC_MCL_PO_POST_REORDER_ID = asyncActionCreator(
    `${prefix}MCL_PO_POST_REORDER_ID`
);
export const mclPoPostReorderIdAsyncAction = asyncAction(
    ASYNC_MCL_PO_POST_REORDER_ID
);

export const ASYNC_MCL_PO_POST_REORDER_ITEM_ID = asyncActionCreator(
    `${prefix}MCL_PO_POST_REORDER_ITEM_ID`
);
export const mclPoPostReorderItemIdAsyncAction = asyncAction(
    ASYNC_MCL_PO_POST_REORDER_ITEM_ID
);

export const ASYNC_MCL_PO_POST_EMAIL = asyncActionCreator(
    `${prefix}MCL_PO_POST_EMAIL`
);
export const mclPoPostEmailAsyncAction = asyncAction(ASYNC_MCL_PO_POST_EMAIL);

// 수정
export const ASYNC_MCL_PO_PUT_ID = asyncActionCreator(`${prefix}MCL_PO_PUT_ID`);
export const mclPoPutIdAsyncAction = asyncAction(ASYNC_MCL_PO_PUT_ID);

export const ASYNC_MCL_PO_PUT_ITEM_ID = asyncActionCreator(
    `${prefix}MCL_PO_PUT_ITEM_ID`
);
export const mclPoPutItemIdAsyncAction = asyncAction(ASYNC_MCL_PO_PUT_ITEM_ID);

export const ASYNC_MCL_PO_PUT_PUBLISH_ID = asyncActionCreator(
    `${prefix}MCL_PO_PUT_PUBLISH_ID`
);
export const mclPoPutPublishIdAsyncAction = asyncAction(
    ASYNC_MCL_PO_PUT_PUBLISH_ID
);

export const ASYNC_MCL_PO_PUT_CANCELED = asyncActionCreator(
    `${prefix}MCL_PO_PUT_CANCELED`
);
export const mclPoPutCanceledAsyncAction = asyncAction(
    ASYNC_MCL_PO_PUT_CANCELED
);

// 삭제
export const ASYNC_MCL_PO_DELETE_ID = asyncActionCreator(
    `${prefix}MCL_PO_DELETE_ID`
);
export const mclPoDeleteIdAsyncAction = asyncAction(ASYNC_MCL_PO_DELETE_ID);

export const ASYNC_MCL_PO_DELETE_ITEM_ID = asyncActionCreator(
    `${prefix}MCL_PO_DELETE_ITEM_ID`
);
export const mclPoDeleteItemIdAsyncAction = asyncAction(
    ASYNC_MCL_PO_DELETE_ITEM_ID
);

// 3. 리듀서의 값을 정의
const initialState = {
    get: {
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
        itemLists: {
            isLoading: false,
            data: null,
            error: null,
        },
        itemId: {
            isLoading: false,
            data: null,
            error: null,
        },
        styleNumber: {
            isLoading: false,
            data: null,
            error: null,
        },
        publishId: {
            isLoading: false,
            data: null,
            error: null,
        },
    },
    post: {
        id: {
            isLoading: false,
            data: null,
            error: null,
        },
        itemId: {
            isLoading: false,
            data: null,
            error: null,
        },
        reorderId: {
            isLoading: false,
            data: null,
            error: null,
        },
        email: {
            isLoading: false,
            data: null,
            error: null,
        },
        // 사용안함
        reorderItemId: {
            isLoading: false,
            data: null,
            error: null,
        },
    },
    put: {
        id: {
            isLoading: false,
            data: null,
            error: null,
        },
        itemId: {
            isLoading: false,
            data: null,
            error: null,
        },
        publishId: {
            isLoading: false,
            data: null,
            error: null,
        },
        canceled: {
            isLoading: false,
            data: null,
            error: null,
        },
    },
    delete: {
        id: {
            isLoading: false,
            data: null,
            error: null,
        },
        itemId: {
            isLoading: false,
            data: null,
            error: null,
        },
    },
};

// 4. 리듀서를 정의
export const mclPoReducer = handleActions(
    {
        [ASYNC_MCL_PO_GET_PAGES.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.get.pages.isLoading = true;
                draft.get.pages.data = initialState.get.pages.data;
                draft.get.pages.error = initialState.get.pages.error;
            }),
        [ASYNC_MCL_PO_GET_PAGES.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.get.pages.isLoading = false;
                draft.get.pages.data = action.payload;
            }),
        [ASYNC_MCL_PO_GET_PAGES.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.get.pages.isLoading = false;
                draft.get.pages.error = action.payload;
            }),
        [ASYNC_MCL_PO_GET_PAGES.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.get.pages.isLoading = false;
                draft.get.pages.data = initialState.get.pages.data;
                draft.get.pages.error = initialState.get.pages.error;
            }),

        [ASYNC_MCL_PO_GET_ID.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.get.id.isLoading = true;
                draft.get.id.data = initialState.get.id.data;
                draft.get.id.error = initialState.get.id.error;
            }),
        [ASYNC_MCL_PO_GET_ID.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.get.id.isLoading = false;
                draft.get.id.data = action.payload;
            }),
        [ASYNC_MCL_PO_GET_ID.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.get.id.isLoading = false;
                draft.get.id.error = action.payload;
            }),
        [ASYNC_MCL_PO_GET_ID.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.get.id.isLoading = false;
                draft.get.id.data = initialState.get.id.data;
                draft.get.id.error = initialState.get.id.error;
            }),

        [ASYNC_MCL_PO_GET_ITEM_LISTS.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.get.itemLists.isLoading = true;
                draft.get.itemLists.data = initialState.get.itemLists.data;
                draft.get.itemLists.error = initialState.get.itemLists.error;
            }),
        [ASYNC_MCL_PO_GET_ITEM_LISTS.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.get.itemLists.isLoading = false;
                draft.get.itemLists.data = action.payload;
            }),
        [ASYNC_MCL_PO_GET_ITEM_LISTS.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.get.itemLists.isLoading = false;
                draft.get.itemLists.error = action.payload;
            }),
        [ASYNC_MCL_PO_GET_ITEM_LISTS.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.get.itemLists.isLoading = false;
                draft.get.itemLists.data = initialState.get.itemLists.data;
                draft.get.itemLists.error = initialState.get.itemLists.error;
            }),

        [ASYNC_MCL_PO_GET_ITEM_ID.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.get.itemId.isLoading = true;
                draft.get.itemId.data = initialState.get.itemId.data;
                draft.get.itemId.error = initialState.get.itemId.error;
            }),
        [ASYNC_MCL_PO_GET_ITEM_ID.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.get.itemId.isLoading = false;
                draft.get.itemId.data = action.payload;
            }),
        [ASYNC_MCL_PO_GET_ITEM_ID.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.get.itemId.isLoading = false;
                draft.get.itemId.error = action.payload;
            }),
        [ASYNC_MCL_PO_GET_ITEM_ID.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.get.itemId.isLoading = false;
                draft.get.itemId.data = initialState.get.itemId.data;
                draft.get.itemId.error = initialState.get.itemId.error;
            }),

        [ASYNC_MCL_PO_GET_STYLE_NUMBER.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.get.styleNumber.isLoading = true;
                draft.get.styleNumber.data = initialState.get.styleNumber.data;
                draft.get.styleNumber.error =
                    initialState.get.styleNumber.error;
            }),
        [ASYNC_MCL_PO_GET_STYLE_NUMBER.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.get.styleNumber.isLoading = false;
                draft.get.styleNumber.data = action.payload;
            }),
        [ASYNC_MCL_PO_GET_STYLE_NUMBER.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.get.styleNumber.isLoading = false;
                draft.get.styleNumber.error = action.payload;
            }),
        [ASYNC_MCL_PO_GET_STYLE_NUMBER.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.get.styleNumber.isLoading = false;
                draft.get.styleNumber.data = initialState.get.styleNumber.data;
                draft.get.styleNumber.error =
                    initialState.get.styleNumber.error;
            }),

        [ASYNC_MCL_PO_GET_PUBLISH_ID.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.get.publishId.isLoading = true;
                draft.get.publishId.data = initialState.get.publishId.data;
                draft.get.publishId.error = initialState.get.publishId.error;
            }),
        [ASYNC_MCL_PO_GET_PUBLISH_ID.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.get.publishId.isLoading = false;
                draft.get.publishId.data = action.payload;
            }),
        [ASYNC_MCL_PO_GET_PUBLISH_ID.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.get.publishId.isLoading = false;
                draft.get.publishId.error = action.payload;
            }),
        [ASYNC_MCL_PO_GET_PUBLISH_ID.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.get.publishId.isLoading = false;
                draft.get.publishId.data = initialState.get.publishId.data;
                draft.get.publishId.error = initialState.get.publishId.error;
            }),

        [ASYNC_MCL_PO_POST_ID.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.post.id.isLoading = true;
                draft.post.id.data = initialState.post.id.data;
                draft.post.id.error = initialState.post.id.error;
            }),
        [ASYNC_MCL_PO_POST_ID.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.post.id.isLoading = false;
                draft.post.id.data = action.payload;
            }),
        [ASYNC_MCL_PO_POST_ID.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.post.id.isLoading = false;
                draft.post.id.error = action.payload;
            }),
        [ASYNC_MCL_PO_POST_ID.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.post.id.isLoading = false;
                draft.post.id.data = initialState.post.id.data;
                draft.post.id.error = initialState.post.id.error;
            }),

        [ASYNC_MCL_PO_POST_ITEM_ID.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.post.itemId.isLoading = true;
                draft.post.itemId.data = initialState.post.itemId.data;
                draft.post.itemId.error = initialState.post.itemId.error;
            }),
        [ASYNC_MCL_PO_POST_ITEM_ID.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.post.itemId.isLoading = false;
                draft.post.itemId.data = action.payload;
            }),
        [ASYNC_MCL_PO_POST_ITEM_ID.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.post.itemId.isLoading = false;
                draft.post.itemId.error = action.payload;
            }),
        [ASYNC_MCL_PO_POST_ITEM_ID.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.post.itemId.isLoading = false;
                draft.post.itemId.data = initialState.post.itemId.data;
                draft.post.itemId.error = initialState.post.itemId.error;
            }),

        [ASYNC_MCL_PO_POST_REORDER_ID.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.post.reorderId.isLoading = true;
                draft.post.reorderId.data = initialState.post.reorderId.data;
                draft.post.reorderId.error = initialState.post.reorderId.error;
            }),
        [ASYNC_MCL_PO_POST_REORDER_ID.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.post.reorderId.isLoading = false;
                draft.post.reorderId.data = action.payload;
            }),
        [ASYNC_MCL_PO_POST_REORDER_ID.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.post.reorderId.isLoading = false;
                draft.post.reorderId.error = action.payload;
            }),
        [ASYNC_MCL_PO_POST_REORDER_ID.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.post.reorderId.isLoading = false;
                draft.post.reorderId.data = initialState.post.reorderId.data;
                draft.post.reorderId.error = initialState.post.reorderId.error;
            }),

        [ASYNC_MCL_PO_POST_REORDER_ITEM_ID.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.post.reorderItemId.isLoading = true;
                draft.post.reorderItemId.data =
                    initialState.post.reorderItemId.data;
                draft.post.reorderItemId.error =
                    initialState.post.reorderItemId.error;
            }),
        [ASYNC_MCL_PO_POST_REORDER_ITEM_ID.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.post.reorderItemId.isLoading = false;
                draft.post.reorderItemId.data = action.payload;
            }),
        [ASYNC_MCL_PO_POST_REORDER_ITEM_ID.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.post.reorderItemId.isLoading = false;
                draft.post.reorderItemId.error = action.payload;
            }),
        [ASYNC_MCL_PO_POST_REORDER_ITEM_ID.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.post.reorderItemId.isLoading = false;
                draft.post.reorderItemId.data =
                    initialState.post.reorderItemId.data;
                draft.post.reorderItemId.error =
                    initialState.post.reorderItemId.error;
            }),

        [ASYNC_MCL_PO_POST_EMAIL.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.post.email.isLoading = true;
                draft.post.email.data = initialState.post.email.data;
                draft.post.email.error = initialState.post.email.error;
            }),
        [ASYNC_MCL_PO_POST_EMAIL.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.post.email.isLoading = false;
                draft.post.email.data = action.payload;
            }),
        [ASYNC_MCL_PO_POST_EMAIL.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.post.email.isLoading = false;
                draft.post.email.error = action.payload;
            }),
        [ASYNC_MCL_PO_POST_EMAIL.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.post.email.isLoading = false;
                draft.post.email.data = initialState.post.email.data;
                draft.post.email.error = initialState.post.email.error;
            }),

        [ASYNC_MCL_PO_PUT_ID.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.put.id.isLoading = true;
                draft.put.id.data = initialState.put.id.data;
                draft.put.id.error = initialState.put.id.error;
            }),
        [ASYNC_MCL_PO_PUT_ID.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.put.id.isLoading = false;
                draft.put.id.data = action.payload;
            }),
        [ASYNC_MCL_PO_PUT_ID.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.put.id.isLoading = false;
                draft.put.id.error = action.payload;
            }),
        [ASYNC_MCL_PO_PUT_ID.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.put.id.isLoading = false;
                draft.put.id.data = initialState.put.id.data;
                draft.put.id.error = initialState.put.id.error;
            }),

        [ASYNC_MCL_PO_PUT_ITEM_ID.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.put.itemId.isLoading = true;
                draft.put.itemId.data = initialState.put.itemId.data;
                draft.put.itemId.error = initialState.put.itemId.error;
            }),
        [ASYNC_MCL_PO_PUT_ITEM_ID.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.put.itemId.isLoading = false;
                draft.put.itemId.data = action.payload;
            }),
        [ASYNC_MCL_PO_PUT_ITEM_ID.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.put.itemId.isLoading = false;
                draft.put.itemId.error = action.payload;
            }),
        [ASYNC_MCL_PO_PUT_ITEM_ID.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.put.itemId.isLoading = false;
                draft.put.itemId.data = initialState.put.itemId.data;
                draft.put.itemId.error = initialState.put.itemId.error;
            }),

        [ASYNC_MCL_PO_PUT_PUBLISH_ID.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.put.publishId.isLoading = true;
                draft.put.publishId.data = initialState.put.publishId.data;
                draft.put.publishId.error = initialState.put.publishId.error;
            }),
        [ASYNC_MCL_PO_PUT_PUBLISH_ID.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.put.publishId.isLoading = false;
                draft.put.publishId.data = action.payload;
            }),
        [ASYNC_MCL_PO_PUT_PUBLISH_ID.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.put.publishId.isLoading = false;
                draft.put.publishId.error = action.payload;
            }),
        [ASYNC_MCL_PO_PUT_PUBLISH_ID.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.put.publishId.isLoading = false;
                draft.put.publishId.data = initialState.put.publishId.data;
                draft.put.publishId.error = initialState.put.publishId.error;
            }),

        [ASYNC_MCL_PO_PUT_CANCELED.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.put.canceled.isLoading = true;
                draft.put.canceled.data = initialState.put.canceled.data;
                draft.put.canceled.error = initialState.put.canceled.error;
            }),
        [ASYNC_MCL_PO_PUT_CANCELED.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.put.canceled.isLoading = false;
                draft.put.canceled.data = action.payload;
            }),
        [ASYNC_MCL_PO_PUT_CANCELED.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.put.canceled.isLoading = false;
                draft.put.canceled.error = action.payload;
            }),
        [ASYNC_MCL_PO_PUT_CANCELED.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.put.canceled.isLoading = false;
                draft.put.canceled.data = initialState.put.canceled.data;
                draft.put.canceled.error = initialState.put.canceled.error;
            }),

        [ASYNC_MCL_PO_DELETE_ID.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.delete.id.isLoading = true;
                draft.delete.id.data = initialState.delete.id.data;
                draft.delete.id.error = initialState.delete.id.error;
            }),
        [ASYNC_MCL_PO_DELETE_ID.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.delete.id.isLoading = false;
                draft.delete.id.data = action.payload;
            }),
        [ASYNC_MCL_PO_DELETE_ID.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.delete.id.isLoading = false;
                draft.delete.id.error = action.payload;
            }),
        [ASYNC_MCL_PO_DELETE_ID.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.delete.id.isLoading = false;
                draft.delete.id.data = initialState.delete.id.data;
                draft.delete.id.error = initialState.delete.id.error;
            }),

        [ASYNC_MCL_PO_DELETE_ITEM_ID.REQUEST]: (state) =>
            produce(state, (draft) => {
                draft.delete.itemId.isLoading = true;
                draft.delete.itemId.data = initialState.delete.itemId.data;
                draft.delete.itemId.error = initialState.delete.itemId.error;
            }),
        [ASYNC_MCL_PO_DELETE_ITEM_ID.SUCCESS]: (state, action) =>
            produce(state, (draft) => {
                draft.delete.itemId.isLoading = false;
                draft.delete.itemId.data = action.payload;
            }),
        [ASYNC_MCL_PO_DELETE_ITEM_ID.FAILURE]: (state, action) =>
            produce(state, (draft) => {
                draft.delete.itemId.isLoading = false;
                draft.delete.itemId.error = action.payload;
            }),
        [ASYNC_MCL_PO_DELETE_ITEM_ID.INITIAL]: (state) =>
            produce(state, (draft) => {
                draft.delete.itemId.isLoading = false;
                draft.delete.itemId.data = initialState.delete.itemId.data;
                draft.delete.itemId.error = initialState.delete.itemId.error;
            }),
    },

    initialState
);
