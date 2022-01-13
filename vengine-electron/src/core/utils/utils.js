import { Tooltip } from 'antd';
import React from 'react';

// 일단은 나중에 공통화하고 tooltip을 여기에 모으자..
// export const TooltipUtils = (
//     data, // data 모듬.
//     item, // item 에 대한
//     hasProperty, // 속성을 가져야한다면
//     pageName // 해당 페이지의 dimension 처리를 위한 구분
// ) => {
//     if (data !== '') {
//         if (pageName === 'MaterialRegistrationLists') {
//             let items = '';

//             items =
//                 data &&
//                 data.map((v, i) => {
//                     return <div key={i}>{`${v.contents.name} ${v.rate}%`}</div>;
//                 });

//             return (
//                 <Tooltip title={items} color="#2db7f5">
//                     {items}
//                 </Tooltip>
//             );
//         } else if (pageName === 'CbdAssign') {
//             let items = '';

//             items =
//                 data &&
//                 data.map((v, i) => {
//                     return <div key={i}>{`${v.contents.name} ${v.rate}%`}</div>;
//                 });

//             return (
//                 <Tooltip title={items} color="#2db7f5">
//                     {items}
//                 </Tooltip>
//             );
//         } else if (pageName === 'CbdOption') {
//             let items = '';

//             items =
//                 data &&
//                 data.map((v, i) => {
//                     return <div key={i}>{`${v.contents.name} ${v.rate}%`}</div>;
//                 });

//             return (
//                 <Tooltip title={items} color="#2db7f5">
//                     {items}
//                 </Tooltip>
//             );
//         } else if (pageName === 'mclPlanningQtyInfo') {
//             return (
//                 <Tooltip
//                     title={
//                         <>
//                             <div>Req Qty: {data.requireQty}</div>
//                             <div>Ord Qty: {data.orderQty}</div>
//                             <div>Bal Qty: {data.balanceQty}</div>
//                         </>
//                     }
//                     color="#2db7f5"
//                 >
//                     <div>Req Qty: {data.requireQty}</div>
//                     <div>Ord Qty: {data.orderQty}</div>
//                     <div>Bal Qty: {data.balanceQty}</div>
//                 </Tooltip>
//             );
//         } else if (pageName === 'mclPlanningDependency') {
//             return (
//                 <Tooltip
//                     title={
//                         <>
//                             <div>Color: {data.colorDependency.type}</div>
//                             <div>Size: {data.sizeDependency.type}</div>
//                             <div>Market: {data.marketDependency.type}</div>
//                         </>
//                     }
//                     color="#2db7f5"
//                 >
//                     <div>Color: {data.colorDependency.type}</div>
//                     <div>Size: {data.sizeDependency.type}</div>
//                     <div>Market: {data.marketDependency.type}</div>
//                 </Tooltip>
//             );
//         } else if (pageName === 'mclPlanningOption') {
//             const {
//                 fabricCw,
//                 fabricCwUom,
//                 fabricWeight,
//                 fabricWeightUom,
//                 materialAfterManufacturingFashion,
//                 materialAfterManufacturingFinishing,
//                 materialAfterManufacturingDyeing,
//             } = data;

//             const result = (
//                 <div>
//                     <div>
//                         CW: {fabricCw}{' '}
//                         {Object.keys(fabricCwUom).length === 0
//                             ? ''
//                             : fabricCwUom.name3}
//                     </div>
//                     <div>
//                         WEIGHT: {fabricWeight}{' '}
//                         {Object.keys(fabricWeightUom).length === 0
//                             ? ''
//                             : fabricWeightUom.name3}
//                     </div>
//                     <div>
//                         FASHION:{' '}
//                         {Object.keys(materialAfterManufacturingFashion)
//                             .length === 0
//                             ? ''
//                             : materialAfterManufacturingFashion.name}
//                     </div>
//                     <div>
//                         FINISHING:{' '}
//                         {Object.keys(materialAfterManufacturingFinishing)
//                             .length === 0
//                             ? ''
//                             : materialAfterManufacturingFinishing.name}
//                     </div>
//                     <div>
//                         DYEING:{' '}
//                         {Object.keys(materialAfterManufacturingDyeing)
//                             .length === 0
//                             ? ''
//                             : materialAfterManufacturingDyeing.name}
//                     </div>
//                 </div>
//             );

//             return (
//                 <Tooltip title={result} color="#2db7f5">
//                     {result}
//                 </Tooltip>
//             );
//         } else if (pageName === 'mclPlanningItemInfo') {
//             const result = (
//                 <div>
//                     <div>Mill#: {data.vendorMaterial}</div>
//                     <div>Color: {data.fabricColorName}</div>
//                     <div>
//                         Size:{' '}
//                         {Object.keys(data.materialInfo.materialSubsidiaries)
//                             .length > 0 &&
//                             `${data.materialInfo.materialSubsidiaries[0].size} ${data.materialInfo.materialSubsidiaries[0].sizeUom.name3}`}
//                     </div>
//                 </div>
//             );
//             return (
//                 <Tooltip title={result} color="#2db7f5">
//                     {result}
//                 </Tooltip>
//             );
//         } else if (pageName === 'mclRmPoItemDetailInfo') {
//             const result = (
//                 <div>
//                     <div>
//                         Content:
//                         {data.mclMaterialInfo?.materialInfo?.fabricContents?.map(
//                             (v) => {
//                                 return (
//                                     <span key={v.contents.id}>
//                                         {v.rate}% {v.contents.name}
//                                     </span>
//                                 );
//                             }
//                         )}
//                     </div>
//                     <div>
//                         Construction: {data.mclMaterialInfo?.fabricConstruction}
//                     </div>
//                     <div>
//                         CW: {data.mclMaterialInfo?.fabricCw}
//                         {data.mclMaterialInfo?.fabricCwUom.name3}
//                         {'    '}
//                         WEIGHT: {data.mclMaterialInfo?.fabricWeight}
//                         {data.mclMaterialInfo?.fabricWeightUom.name3}
//                     </div>
//                     <div>
//                         Fashion/Finishing/Dyeing:{' '}
//                         {
//                             data.mclMaterialInfo
//                                 ?.materialAfterManufacturingFashion.name
//                         }{' '}
//                         {
//                             data.mclMaterialInfo
//                                 ?.materialAfterManufacturingFinishing.name
//                         }{' '}
//                         {
//                             data.mclMaterialInfo
//                                 ?.materialAfterManufacturingDyeing.name
//                         }
//                     </div>
//                 </div>
//             );
//             return (
//                 <Tooltip title={result} color="#2db7f5">
//                     {result}
//                 </Tooltip>
//             );
//         } else if (pageName === 'mclRmPoShipper') {
//             const result = (
//                 <div>
//                     <div>SHPR: {data.order.shipper.companyName}</div>
//                     <div>CNEE: {data.order.consignee.companyName} </div>
//                 </div>
//             );
//             return (
//                 <Tooltip title={result} color="#2db7f5">
//                     {result}
//                 </Tooltip>
//             );
//         } else if (pageName === 'PoShipper') {
//             const result = (
//                 <div>
//                     <div>
//                         SHPR: {data.supplierOrder.order.shipper.companyName}
//                     </div>
//                     <div>
//                         CNEE: {data.supplierOrder.order.consignee.companyName}{' '}
//                     </div>
//                 </div>
//             );
//             return (
//                 <Tooltip title={result} color="#2db7f5">
//                     {result}
//                 </Tooltip>
//             );
//         } else if (pageName === 'mclRmPoShippingInfo') {
//             const {
//                 loadingPort,
//                 loadingBasicCountry,
//                 dischargePort,
//                 dischargeBasicCountry,
//                 shippingMethod,
//                 incoterms,
//             } = data.order;
//             const result = (
//                 <div>
//                     <div>
//                         POL: {loadingPort.name1}, {loadingBasicCountry.name1}(
//                         {loadingBasicCountry.name3}){' '}
//                     </div>
//                     <div>
//                         POD: {dischargePort.name1},{' '}
//                         {dischargeBasicCountry.name1}(
//                         {dischargeBasicCountry.name3})
//                     </div>
//                     <div>Ship Mode: {shippingMethod.name1}</div>
//                     <div>Terms: {incoterms.name2}</div>
//                 </div>
//             );
//             return (
//                 <Tooltip title={result} color="#2db7f5">
//                     {result}
//                 </Tooltip>
//             );
//         } else if (pageName === 'poShippingInfo') {
//             const {
//                 loadingPort,
//                 loadingBasicCountry,
//                 dischargePort,
//                 dischargeBasicCountry,
//                 shippingMethod,
//                 incoterms,
//             } = data.supplierOrder.order;
//             const result = (
//                 <div>
//                     <div>
//                         POL: {loadingPort.name1}, {loadingBasicCountry.name1}(
//                         {loadingBasicCountry.name3}){' '}
//                     </div>
//                     <div>
//                         POD: {dischargePort.name1},{' '}
//                         {dischargeBasicCountry.name1}(
//                         {dischargeBasicCountry.name3})
//                     </div>
//                     <div>Ship Mode: {shippingMethod.name1}</div>
//                     <div>Terms: {incoterms.name2}</div>
//                 </div>
//             );
//             return (
//                 <Tooltip title={result} color="#2db7f5">
//                     {result}
//                 </Tooltip>
//             );
//         } else if (pageName === 'mclRmPoQtyAmount') {
//             const { itemQty, totalPoAmt, totalPoQty, order } = data;
//             const result = (
//                 <div>
//                     <div>Item Qty: {itemQty} ea</div>
//                     <div>Total Qty: {totalPoQty}</div>
//                     <div>
//                         Total Amount: {totalPoAmt} {order.currency.name3}
//                     </div>
//                 </div>
//             );

//             return (
//                 <Tooltip title={result} color="#2db7f5">
//                     {result}
//                 </Tooltip>
//             );
//         } else if (pageName === 'poQtyAmount') {
//             const { itemQty, totalPoAmt, totalPoQty, supplierOrder } = data;
//             const result = (
//                 <div>
//                     <div>Item Qty: {itemQty} ea</div>
//                     <div>Total Qty: {totalPoQty}</div>
//                     <div>
//                         Total Amount: {totalPoAmt}{' '}
//                         {supplierOrder.order.currency.name3}
//                     </div>
//                 </div>
//             );

//             return (
//                 <Tooltip title={result} color="#2db7f5">
//                     {result}
//                 </Tooltip>
//             );
//         } else if (pageName === 'mclRmPoDateInfo') {
//             const { estimatedDate, infactoryDate } = data.order;
//             const result = (
//                 <div>
//                     <div>Ship Date: {estimatedDate}</div>
//                     <div>In House: {infactoryDate}</div>
//                 </div>
//             );
//             return (
//                 <Tooltip title={result} color="#2db7f5">
//                     {result}
//                 </Tooltip>
//             );
//         } else if (pageName === 'poDateInfo') {
//             const { estimatedDate, infactoryDate } = data.supplierOrder.order;
//             const result = (
//                 <div>
//                     <div>Ship Date: {estimatedDate}</div>
//                     <div>In House: {infactoryDate}</div>
//                 </div>
//             );
//             return (
//                 <Tooltip title={result} color="#2db7f5">
//                     {result}
//                 </Tooltip>
//             );
//         } else if (pageName === 'mclRmPoBuyerInfo') {
//             const { styleNumbers, order } = data;
//             const { buyer, brand, designNumber } = order;
//             const result = (
//                 <div>
//                     <div>Buyer: {buyer.companyName}</div>
//                     <div>Brand: {brand.companyName}</div>
//                     <div>Design#: {designNumber}</div>
//                     <div>Style#: {styleNumbers.join(',')}</div>
//                 </div>
//             );

//             return (
//                 <Tooltip title={result} color="#2db7f5">
//                     {result}
//                 </Tooltip>
//             );
//         } else if (pageName === 'poBuyerInfo') {
//             const { supplierOrder } = data;
//             const { buyer, brand, designNumber } = supplierOrder.order;
//             const result = (
//                 <div>
//                     <div>Buyer: {buyer.companyName}</div>
//                     <div>Brand: {brand.companyName}</div>
//                     <div>Design#: {designNumber}</div>
//                     <div>Style#: {supplierOrder.styleNumbers.join(',')}</div>
//                 </div>
//             );

//             return (
//                 <Tooltip title={result} color="#2db7f5">
//                     {result}
//                 </Tooltip>
//             );
//         } else if (pageName === 'mclRmPoItemType') {
//             const { styleNumbers, designNumber, mclMaterialInfo } = data;
//             const { materialInfo } = mclMaterialInfo;
//             const { category, type } = materialInfo;

//             const result = (
//                 <div>
//                     <div>Design#: {designNumber}</div>
//                     <div>
//                         {type} -{' '}
//                         {category.typeC
//                             ? `${category.typeB} ${category.typeC}`
//                             : category.typeB}
//                     </div>
//                     <div>Style#: {styleNumbers.join(',')}</div>
//                 </div>
//             );

//             return (
//                 <Tooltip title={result} color="#2db7f5">
//                     {result}
//                 </Tooltip>
//             );
//         }
//     } else if (item !== '') {
//         if (hasProperty !== '' && hasProperty === 'name' && pageName === '') {
//             // console.log("======= ", item);
//             return item ? (
//                 item.hasOwnProperty('name') ? (
//                     <Tooltip title={item.name} color="#2db7f5">
//                         {item.name}
//                     </Tooltip>
//                 ) : (
//                     <Tooltip
//                         title={item.length > 0 ? item : ''}
//                         color="#2db7f5"
//                     >
//                         {item.length > 0 ? item : ''}
//                     </Tooltip>
//                 )
//             ) : (
//                 ''
//             );
//         } else if (
//             hasProperty !== '' &&
//             hasProperty === 'name1' &&
//             pageName === ''
//         ) {
//             return item ? (
//                 item.hasOwnProperty('name1') ? (
//                     <Tooltip title={item.name1} color="#2db7f5">
//                         {item.name1}
//                     </Tooltip>
//                 ) : item.hasOwnProperty('name') ? (
//                     <Tooltip title={item.name} color="#2db7f5">
//                         {item.name}
//                     </Tooltip>
//                 ) : (
//                     <Tooltip
//                         title={item.length > 0 ? item : ''}
//                         color="#2db7f5"
//                     >
//                         {item.length > 0 ? item : ''}
//                     </Tooltip>
//                 )
//             ) : (
//                 ''
//             );
//         } else if (
//             hasProperty !== '' &&
//             hasProperty === 'name2' &&
//             pageName === ''
//         ) {
//             return item ? (
//                 item.hasOwnProperty('name2') ? (
//                     <Tooltip title={item.name2} color="#2db7f5">
//                         {item.name2}
//                     </Tooltip>
//                 ) : (
//                     <Tooltip title={item.name} color="#2db7f5">
//                         {item.name}
//                     </Tooltip>
//                 )
//             ) : (
//                 ''
//             );
//         } else if (
//             hasProperty !== '' &&
//             hasProperty === 'name3' &&
//             pageName === ''
//         ) {
//             return item ? (
//                 item.hasOwnProperty('name3') ? (
//                     <Tooltip title={item.name3} color="#2db7f5">
//                         {item.name3}
//                     </Tooltip>
//                 ) : item.hasOwnProperty('name') ? (
//                     <Tooltip title={item.name} color="#2db7f5">
//                         {item.name}
//                     </Tooltip>
//                 ) : (
//                     <Tooltip
//                         title={item.length > 0 ? item : ''}
//                         color="#2db7f5"
//                     >
//                         {item.length > 0 ? item : ''}
//                     </Tooltip>
//                 )
//             ) : (
//                 ''
//             );
//         } else if (
//             hasProperty !== '' &&
//             hasProperty === 'name4' &&
//             pageName === ''
//         ) {
//             return item ? (
//                 item.hasOwnProperty('name4') ? (
//                     <Tooltip title={item.name4} color="#2db7f5">
//                         {item.name4}
//                     </Tooltip>
//                 ) : item.hasOwnProperty('name') ? (
//                     <Tooltip title={item.name} color="#2db7f5">
//                         {item.name}
//                     </Tooltip>
//                 ) : (
//                     <Tooltip
//                         title={item.length > 0 ? item : ''}
//                         color="#2db7f5"
//                     >
//                         {item.length > 0 ? item : ''}
//                     </Tooltip>
//                 )
//             ) : (
//                 ''
//             );
//         } else if (
//             hasProperty !== '' &&
//             hasProperty === 'data' &&
//             pageName === ''
//         ) {
//             return item ? (
//                 item.hasOwnProperty('data') ? (
//                     <Tooltip title={item.data} color="#2db7f5">
//                         {item.data}
//                     </Tooltip>
//                 ) : (
//                     <Tooltip
//                         title={item.length > 0 ? item : ''}
//                         color="#2db7f5"
//                     >
//                         {item.length > 0 ? item : ''}
//                     </Tooltip>
//                 )
//             ) : (
//                 ''
//             );
//         } else if (
//             hasProperty !== '' &&
//             hasProperty === 'userName' &&
//             pageName === ''
//         ) {
//             return item ? (
//                 item.hasOwnProperty('userName') ? (
//                     <Tooltip title={item.userName} color="#2db7f5">
//                         {item.userName}
//                     </Tooltip>
//                 ) : (
//                     <Tooltip
//                         title={item.length > 0 ? item : ''}
//                         color="#2db7f5"
//                     >
//                         {item.length > 0 ? item : ''}
//                     </Tooltip>
//                 )
//             ) : (
//                 ''
//             );
//         } else if (
//             hasProperty !== '' &&
//             hasProperty === 'userLevelName' &&
//             pageName === ''
//         ) {
//             return item ? (
//                 item.hasOwnProperty('userLevelName') ? (
//                     <Tooltip title={item.userLevelName} color="#2db7f5">
//                         {item.userLevelName}
//                     </Tooltip>
//                 ) : (
//                     <Tooltip title={item.name} color="#2db7f5">
//                         {item.name}
//                     </Tooltip>
//                 )
//             ) : (
//                 ''
//             );
//         } else if (
//             hasProperty !== '' &&
//             hasProperty === 'name' &&
//             pageName === 'CompanyInfoList'
//         ) {
//             return item ? (
//                 item.hasOwnProperty('name') ? (
//                     <Tooltip title={item.name} color="#2db7f5">
//                         {item.name}
//                     </Tooltip>
//                 ) : (
//                     <Tooltip title={item.name1} color="#2db7f5">
//                         {item.name1}
//                     </Tooltip>
//                 )
//             ) : (
//                 ''
//             );
//         } else if (
//             hasProperty !== '' &&
//             hasProperty === 'materialOptionID' &&
//             pageName === 'MaterialRegistrationOffer'
//         ) {
//             return item ? (
//                 item.hasOwnProperty('materialOptionID') ? (
//                     <Tooltip
//                         placement="top"
//                         title={
//                             <>
//                                 <div>
//                                     FASHION :{' '}
//                                     {item.fashion && item.fashion.name}
//                                 </div>
//                                 <div>
//                                     FINISHING :{' '}
//                                     {item.finishing && item.finishing.name}
//                                 </div>
//                                 <div>
//                                     DYEING : {item.dyeing && item.dyeing.name}
//                                 </div>
//                             </>
//                         }
//                         arrowPointAtCenter
//                         color="#2db7f5"
//                     >
//                         {item.fashion?.name} {item.finishing?.name}{' '}
//                         {item.dyeing?.name}
//                     </Tooltip>
//                 ) : (
//                     <Tooltip
//                         placement="top"
//                         title={
//                             <>
//                                 <div>FASHION : {item.data.fashion.name}</div>
//                                 <div>
//                                     FINISHING : {item.data.finishing.name}
//                                 </div>
//                                 <div>DYEING : {item.data.dyeing.name}</div>
//                             </>
//                         }
//                         arrowPointAtCenter
//                         color="#2db7f5"
//                     >
//                         {item.data.fashion.name
//                             ? item.data.fashion.name + ' ...'
//                             : item.data.finishing.name
//                             ? item.data.finishing.name + ' ...'
//                             : item.data.dyeing.name
//                             ? item.data.dyeing.name + ' ...'
//                             : ''}
//                     </Tooltip>
//                 )
//             ) : (
//                 ''
//             );
//         } else if (pageName === 'userlist') {
//             let _status = ' ';
//             if (item === 'A' || item === 'Active') {
//                 _status = 'Active';
//             } else if (item === 'D' || item === 'Deactive') {
//                 _status = 'Deactive';
//             } else if (item === 'W' || item === 'Waiting') {
//                 _status = 'Waiting';
//             }
//             return item ? (
//                 item.hasOwnProperty('name') ? (
//                     <Tooltip title={item.name} color="#2db7f5">
//                         {item.name}
//                     </Tooltip>
//                 ) : (
//                     <Tooltip title={_status} color="#2db7f5">
//                         {_status}
//                     </Tooltip>
//                 )
//             ) : (
//                 ''
//             );
//         } else if (
//             hasProperty !== '' &&
//             hasProperty === 'materialSubsidiarySizeId'
//         ) {
//             return item ? (
//                 item.hasOwnProperty('materialSubsidiarySizeId') ? (
//                     <Tooltip
//                         placement="top"
//                         title={
//                             <div>
//                                 {item.size}
//                                 {item.sizeUom
//                                     ? item.sizeUom['name3'] &&
//                                       item.sizeUom['name3']
//                                     : ''}
//                             </div>
//                         }
//                         arrowPointAtCenter
//                         color="#2db7f5"
//                     >
//                         {
//                             <div>
//                                 {item.size}
//                                 {item.sizeUom
//                                     ? item.sizeUom['name3'] &&
//                                       item.sizeUom['name3']
//                                     : ''}
//                             </div>
//                         }
//                     </Tooltip>
//                 ) : (
//                     <Tooltip
//                         placement="top"
//                         title={
//                             <div>
//                                 {item.data.size}
//                                 {item.data.sizeUom
//                                     ? item.data.sizeUom['name3'] &&
//                                       item.data.sizeUom['name3']
//                                     : ''}
//                             </div>
//                         }
//                         arrowPointAtCenter
//                         color="#2db7f5"
//                     >
//                         <div>
//                             {item.data.size}
//                             {item.data.sizeUom
//                                 ? item.data.sizeUom['name3'] &&
//                                   item.data.sizeUom['name3']
//                                 : ''}
//                         </div>
//                     </Tooltip>
//                 )
//             ) : (
//                 ''
//             );
//         } else if (pageName === 'mclPlanningCategory') {
//             return (
//                 <Tooltip
//                     placement="top"
//                     title={
//                         <>
//                             <div>
//                                 {item.category.typeC
//                                     ? `${item.category.typeB} /  ${item.category.typeC}`
//                                     : item.category.typeB}
//                             </div>
//                             {item.fabricContents.map((v, i) => {
//                                 return (
//                                     <div key={i}>
//                                         {v.contents.name}: {v.rate}
//                                     </div>
//                                 );
//                             })}
//                         </>
//                     }
//                     arrowPointAtCenter
//                     color="#2db7f5"
//                 >
//                     <div>
//                         {item.category.typeC
//                             ? `${item.category.typeB} /  ${item.category.typeC}`
//                             : item.category.typeB}
//                     </div>
//                     {item.fabricContents.map((v, i) => {
//                         return (
//                             <div key={i}>
//                                 {v.contents.name}: {v.rate}
//                             </div>
//                         );
//                     })}
//                 </Tooltip>
//             );
//         } else if (pageName === 'mclDocumentItemDetail') {
//             const { construction, content, cw, weight, method } = item;
//             const result = (
//                 <div>
//                     <div>Content: {content}</div>
//                     <div>Construction: {construction}</div>
//                     <div>
//                         CW: {cw} Weight: {weight}
//                     </div>
//                     <div>Finished/Dye Method: {method}</div>
//                 </div>
//             );

//             return (
//                 <Tooltip title={result} color="#2db7f5">
//                     {result}
//                 </Tooltip>
//             );
//         } else if (pageName === 'mclDocumentItemColorSize') {
//             const { color, size } = item;

//             const result = (
//                 <div>
//                     <div>Color: {color}</div>
//                     <div>Size: {size}</div>
//                 </div>
//             );

//             return (
//                 <Tooltip title={result} color="#2db7f5">
//                     {result}
//                 </Tooltip>
//             );
//         } else {
//             return (
//                 // 별도로 폰트 색상 지정에 대해 값을 받아 처리해야하나......... ㄷ ㄷ ㄷ
//                 <Tooltip title={item} color="#2db7f5">
//                     {
//                         <span
//                             style={{
//                                 color:
//                                     item === 'OPEN'
//                                         ? '#1890ff'
//                                         : item === 'CLOSE'
//                                         ? 'red'
//                                         : null,
//                             }}
//                         >
//                             {item}
//                         </span>
//                     }
//                 </Tooltip>
//             );
//         }
//     }
// };

// 차후 모든 tooltip 여기로..
