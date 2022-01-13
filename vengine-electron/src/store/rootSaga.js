import { all, fork } from 'redux-saga/effects';
import { watchSignSaga } from './sign';
import { watchSignVerifySaga } from './sign/verify';
import { watchSignCheckSaga } from './sign/check';
import { watchUserSaga } from './user';
import { watchUserMenuSaga } from './user/menu';
import { watchCompanySaga } from './company';
import { watchCommonBasicSaga } from './common/basic';
import { watchCommonAfterSaga } from './common/after';
import { watchCommonMaterialSaga } from './common/material';
import { watchCommonYearSaga } from './common/year';
import { watchCommonEnumsSaga } from './common/enums';
import { watchMaterialInfoSaga } from './material/info';
import { watchMaterialYarnSaga } from './material/yarn';

import { watchMaterialOptionSaga } from './material/option';
import { watchMaterialSubsidiarySaga } from './material/subsidiary';
import { watchMaterialOfferSaga } from './material/offer';

import { watchCompanyInfoSaga } from './companyInfo';

import { watchCbdCoverSaga } from './cbd/cover';
import { watchCbdOptionSaga } from './cbd/option';
import { watchCbdInfoSaga } from './cbd/info';
import { watchCbdCostingSaga } from './cbd/costing';
import { watchMclOptionSaga } from './mcl/option';
import { watchMclCbdAssignSaga } from './mcl/cbdAssign';
import { watchMclGarmentColorSaga } from './mcl/garmentColor';
import { watchMclGarmentSizeSaga } from './mcl/garmentSize';
import { watchMclGarmentMarketSaga } from './mcl/garmentMarket';
import { watchMclPrebookingSaga } from './mcl/prebooking';
import { watchMclAssignPoSaga } from './mcl/assignPo';
import { watchMclOrderQtySaga } from './mcl/orderQty';
import { watchMclPlanningSaga } from './mcl/planning';
import { watchMclPoSaga } from './mcl/po';
import { watchMclAdhocSaga } from './mcl/adhoc';
import { watchBuyerOrderSaga } from './buyer/order';
import { watchSupplierOrderSaga } from './supplier/order';
import { watchNoticeSaga } from './notice';

export default function* rootSaga() {
    yield all([
        fork(watchSignSaga),
        fork(watchSignVerifySaga),
        fork(watchSignCheckSaga),
        fork(watchUserSaga),
        fork(watchUserMenuSaga),
        fork(watchCompanySaga),
        fork(watchCommonBasicSaga),
        fork(watchCommonAfterSaga),
        fork(watchCommonMaterialSaga),
        fork(watchCommonYearSaga),
        fork(watchCommonEnumsSaga),
        fork(watchMaterialInfoSaga),
        fork(watchMaterialYarnSaga),
        fork(watchMaterialSubsidiarySaga),
        fork(watchMaterialOptionSaga),
        fork(watchMaterialOfferSaga),
        fork(watchCompanyInfoSaga),
        fork(watchCbdCoverSaga),
        fork(watchCbdOptionSaga),
        fork(watchCbdInfoSaga),
        fork(watchCbdCostingSaga),
        fork(watchMclOptionSaga),
        fork(watchMclCbdAssignSaga),
        fork(watchMclGarmentColorSaga),
        fork(watchMclGarmentSizeSaga),
        fork(watchMclGarmentMarketSaga),
        fork(watchMclPrebookingSaga),
        fork(watchMclAssignPoSaga),
        fork(watchMclOrderQtySaga),
        fork(watchMclPlanningSaga),
        fork(watchMclPoSaga),
        fork(watchMclAdhocSaga),

        fork(watchBuyerOrderSaga),
        fork(watchSupplierOrderSaga),
        fork(watchNoticeSaga),
    ]);
}
