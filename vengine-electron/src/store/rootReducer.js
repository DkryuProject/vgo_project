import { combineReducers } from 'redux';

import { signReducer } from './sign';
import { signVerifyReducer } from './sign/verify';
import { signCheckReducer } from './sign/check';
import { userReducer } from './user';
import { userMenuReducer } from './user/menu';
import { companyReducer } from './company';
import { commonBasicReducer } from './common/basic';
import { commonAfterReducer } from './common/after';
import { commonMaterialReducer } from './common/material';
import { commonYearReducer } from './common/year';
import { commonEnumsReducer } from './common/enums';
import { materialInfoReducer } from './material/info';
import { materialYarnReducer } from './material/yarn';
import { materialSubsidiaryReducer } from './material/subsidiary';
import { materialOptionReducer } from './material/option';
import { materialOfferReducer } from './material/offer';
import { companyInfoReducer } from './companyInfo';
import { cbdCoverReducer } from './cbd/cover';
import { cbdOptionReducer } from './cbd/option';
import { cbdInfoReducer } from './cbd/info';
import { cbdCostingReducer } from './cbd/costing';
import { mclOptionReducer } from './mcl/option';
import { mclCbdAssignReducer } from './mcl/cbdAssign';
import { mclGarmentColorReducer } from './mcl/garmentColor';
import { mclGarmentSizeReducer } from './mcl/garmentSize';
import { mclGarmentMarketReducer } from './mcl/garmentMarket';
import { mclPrebookingReducer } from './mcl/prebooking';
import { mclAssignPoReducer } from './mcl/assignPo';
import { mclOrderQtyReducer } from './mcl/orderQty';
import { mclPlanningReducer } from './mcl/planning';
import { mclPoReducer } from './mcl/po';
import { mclAdhocReducer } from './mcl/adhoc';
import { buyerOrderReducer } from './buyer/order';
import { supplierOrderReducer } from './supplier/order';
import { noticeReducer } from './notice';

const rootReducer = combineReducers({
    signReducer,
    signVerifyReducer,
    signCheckReducer,
    userReducer,
    userMenuReducer,
    companyReducer,
    commonBasicReducer,
    commonAfterReducer,
    commonMaterialReducer,
    commonYearReducer,
    commonEnumsReducer,

    materialInfoReducer,
    materialYarnReducer,
    materialSubsidiaryReducer,
    materialOfferReducer,
    materialOptionReducer,
    companyInfoReducer,
    cbdCoverReducer,
    cbdOptionReducer,
    cbdInfoReducer,
    cbdCostingReducer,
    mclOptionReducer,
    mclCbdAssignReducer,
    mclGarmentColorReducer,
    mclGarmentSizeReducer,
    mclGarmentMarketReducer,
    mclPrebookingReducer,
    mclAssignPoReducer,
    mclOrderQtyReducer,
    mclPlanningReducer,
    mclPoReducer,
    mclAdhocReducer,
    buyerOrderReducer,
    supplierOrderReducer,
    noticeReducer,
});

export default rootReducer;

// const materialInfoReducerConfig = {
//     key: "materialInfoReducer",
//     storage,
//     whitelist: ["get", "post", "postFilter", "put"],
// };

// const cbdCoverReducerConfig = {
//     key: "cbdCoverReducer",
//     storage,
//     whitelist: ["get", "post", "postImage", "delete"],
// };

// const cbdInfoReducerConfig = {
//     key: "cbdInfoReducer",
//     storage,
//     whitelist: ["get", "post", "delete"],
// };

// export default (rootReducer) =>
//     combineReducers({
//         signReducer,
//         signVerifyReducer,
//         signCheckReducer,
//         userReducer,
//         userMenuReducer,
//         companyReducer,
//         commonBasicReducer,
//         commonAfterReducer,
//         commonMaterialReducer,
//         commonYearReducer,
//         materialInfoReducer: persistReducer(
//             materialInfoReducerConfig,
//             materialInfoReducers
//         ),
//         materialYarnReducer,
//         materialSubsidiaryReducer,
//         materialOfferReducer,
//         materialOptionReducer,
//         companyInfoReducer,
//         cbdCoverReducer: persistReducer(
//             cbdCoverReducerConfig,
//             cbdCoverReducers
//         ),
//         cbdOptionReducer,
//         cbdInfoReducer: persistReducer(cbdInfoReducerConfig, cbdInfoReducers),
//         router: connectRouter(rootReducer),
//     });
