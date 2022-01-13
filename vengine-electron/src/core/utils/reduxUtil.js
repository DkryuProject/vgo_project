import { createAction } from 'redux-actions';
import { put, call } from 'redux-saga/effects';

// 액션 생성
export const asyncActionCreator = (actionName) => {
    const asyncTypeAction = ['_REQUEST', '_SUCCESS', '_FAILURE', '_INITIAL'];

    return {
        REQUEST: actionName + asyncTypeAction[0],
        SUCCESS: actionName + asyncTypeAction[1],
        FAILURE: actionName + asyncTypeAction[2],
        INITIAL: actionName + asyncTypeAction[3],
    };
};

// 액션 함수 생성
export const asyncAction = (asyncAction, data, func) => {
    return {
        request: createAction(asyncAction.REQUEST),
        success: createAction(asyncAction.SUCCESS, data, func),
        failure: createAction(asyncAction.FAILURE),
        initial: createAction(asyncAction.INITIAL),
    };
};

// 사가 모듈
export default function createAsyncSaga(
    asyncAction,
    asyncFunc,
    successFunc,
    failureFunc
) {
    return function* saga(action) {
        try {
            // api 호출 이때 파라미터는 request()에서 받은 값으로 전달
            const result = yield call(asyncFunc, action.payload);

            // success 액션함수를 dispatch 하여 api 결과값 반환
            yield put(asyncAction.success(result));

            if (successFunc) {
                // 성공 이후의 추가 액션이 필요할 경우 이에대한  callback 선언
                yield call(successFunc, '성공');
            }
        } catch (e) {
            // failure  액션함수를 dispatch 하여 error 반환
            yield put(asyncAction.failure(e.response?.data));

            if (failureFunc) {
                // 실패 이후의 추가 액션이 필요할 경우 이에대한  callback 선언
                yield call(failureFunc, e);
            }
        }
    };
}
