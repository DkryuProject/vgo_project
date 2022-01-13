import { takeEvery } from 'redux-saga/effects';
import createAsyncSaga from 'core/utils/reduxUtil';
import apiUtil from 'core/utils/apiUtil';
import menusModel from 'core/utils/menusUtil';

import {
    ASYNC_USER_MENU_GET_MY,
    userMenuGetMyAsyncAction,
    ASYNC_USER_MENU_GET_MENUTYPE,
    userMenuGetMenuTypeAsyncAction,
} from './reducer';

const userMenuGetMyApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/menu/my`,
        method: 'GET',
        headers: {
            'X-AUTH-TOKEN': localStorage.getItem('authToken'),
        },
    });
    const respone = new menusModel(res.data.list).object(payload);
    return respone;
};

const userMenuGetMenuTypeApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/menu/my/${payload.menuTypeId}`,
        method: 'GET',
        headers: {
            'X-AUTH-TOKEN': localStorage.getItem('authToken'),
        },
    });
    const respone = new menusModel(res.data.list).object(payload);
    return respone;
};

const userMenuGetMySaga = createAsyncSaga(
    userMenuGetMyAsyncAction,
    userMenuGetMyApi
);

const userMenuGetMenuTypeSaga = createAsyncSaga(
    userMenuGetMenuTypeAsyncAction,
    userMenuGetMenuTypeApi
);

export function* watchUserMenuSaga() {
    yield takeEvery(ASYNC_USER_MENU_GET_MY.REQUEST, userMenuGetMySaga);
    yield takeEvery(
        ASYNC_USER_MENU_GET_MENUTYPE.REQUEST,
        userMenuGetMenuTypeSaga
    );
}
