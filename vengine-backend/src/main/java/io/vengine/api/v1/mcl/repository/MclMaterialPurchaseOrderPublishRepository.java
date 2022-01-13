package io.vengine.api.v1.mcl.repository;

import io.vengine.api.v1.mcl.entity.MclMaterialPurchaseOrder;
import io.vengine.api.v1.mcl.entity.MclMaterialPurchaseOrderPublish;
import io.vengine.api.v1.user.entity.Company;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.Map;
import java.util.Optional;

public interface MclMaterialPurchaseOrderPublishRepository extends JpaRepository<MclMaterialPurchaseOrderPublish, Long>, JpaSpecificationExecutor<MclMaterialPurchaseOrderPublish> {
    Optional<MclMaterialPurchaseOrderPublish> findByMclMaterialPurchaseOrder(MclMaterialPurchaseOrder mclMaterialPurchaseOrder);

    @Query(
            nativeQuery = true,
            value =  "select  publishOrderId, poNumber, status, purchaser, shipper, brand, buyer, designNumber, shippingMode, dischargePortCountry, dischargePort, loadingPortCountry, loadingPort, currency," +
                    "styleNumber, itemQty, totalAmount, estimatedDate, infactoryDate, poType, poConfirm, revertMemo, userName, updatedAt \n" +
                    "from ( \n" +
                    "select mmpop.id as publishOrderId \n" +
                    "\t  ,mmpop.material_purchase_order_number as poNumber \n" +
                    "\t  ,uc.name as purchaser \n" +
                    "\t  ,uc2.name as shipper \n" +
                    "\t  ,mmpop.cbd_brand_name as brand \n" +
                    "\t  ,mmpop.cbd_buyer_name as buyer \n" +
                    "\t  ,cc.design_number as designNumber \n" +
                    "\t  ,(select group_concat(distinct mpb.style_number) from mcl_pre_booking mpb where mpb.mcl_option_id=mmpop.mcl_option_id and mpb.del_flag='N') as styleNumber \n" +
                    "\t  ,mmpop.estimated_date as  estimatedDate\n" +
                    "\t  ,mmpop.infactory_date as infactoryDate \n" +
                    "\t  ,'mcl' as poType \n" +
                    "\t  ,(select count(*) from mcl_material_purchase_order_item_publish mmpoip where mmpoip.mcl_material_purchase_order_id = mmpop.mcl_material_purchase_order_id and mmpoip.del_flag='N') as itemQty\n" +
                    "\t  ,ifnull((select sum(mmpoip.unit_price * mmpoip.purchase_qty) from mcl_material_purchase_order_item_publish mmpoip where mmpoip.mcl_material_purchase_order_id = mmpop.mcl_material_purchase_order_id and mmpoip.del_flag='N'), 0) as totalAmount\n" +
                    "\t  ,ifnull(spc.po_confirm,0) as poConfirm\n" +
                    "\t  ,ifnull(spc.revert_memo,'') as revertMemo" +
                    "\t  ,case when ifnull(spc.po_confirm,0)= 0 then mmpop.status" +
                    "\t            when ifnull(spc.po_confirm,0) = 1 then 'Confirm' else 'Revert' end status" +
                    "\t  ,cbi1.cm_name2 as currency" +
                    "\t  ,cbi2.cm_name1 as shippingMode" +
                    "\t  ,cbi3.cm_name1 as dischargePort" +
                    "\t  ,cbi4.cm_name1 as loadingPort" +
                    "\t  ,cbi5.cm_name1 as loadingPortCountry" +
                    "\t  ,cbi6.cm_name1 as dischargePortCountry" +
                    "\t  ,ui.full_name as userName \n" +
                    "\t  ,mmpop.updated_at as updatedAt \n" +
                    "from mcl_material_purchase_order_publish mmpop \n" +
                    "inner join user_info ui on ui.id = mmpop.user_id \n" +
                    "inner join user_company uc on uc.id = mmpop.material_purchase_comp_id\n" +
                    "left join user_company uc2 on uc2.id = mmpop.shipper_comp_id \n" +
                    "inner join cbd_cover cc on cc.id = mmpop.cbd_cover_id \n" +
                    "inner join common_basic_info cbi1 on cbi1.id = mmpop.cm_currency_id \n" +
                    "inner join common_basic_info cbi2 on cbi2.id = mmpop.cm_material_shipping_method_id \n" +
                    "inner join common_basic_info cbi3 on cbi3.id = mmpop.cm_discharge_port_info_id \n" +
                    "inner join common_basic_info cbi4 on cbi4.id = mmpop.cm_loading_port_info_id \n" +
                    "inner join common_basic_info cbi5 on cbi5.id = mmpop.cm_loading_basic_country_id \n" +
                    "inner join common_basic_info cbi6 on cbi6.id = mmpop.cm_discharge_basic_country_id \n" +
                    "left join supplier_po_checking spc on spc.mcl_material_purchase_order_publish_id = mmpop.id  \n"+
                    "where mmpop.material_selling_comp_id= :company \n" +
                    "and (case when ifnull(spc.po_confirm,0) = 0 then mmpop.status\n" +
                    "                  when ifnull(spc.po_confirm,0) = 1 then 'Confirm' else 'Revert' end) like %:status% \n" +
                    "and mmpop.del_flag = 'N' \n" +
                    "and (\n" +
                    "\t mmpop.material_purchase_order_number like %:searchKeyWord%\n" +
                    "\t or cbi1.cm_name2 like %:searchKeyWord%\n" +
                    "\t or cbi2.cm_name1 like %:searchKeyWord%\n" +
                    "\t or cbi3.cm_name1 like %:searchKeyWord%\n" +
                    "\t or cbi4.cm_name1 like %:searchKeyWord%\n" +
                    "\t or cbi5.cm_name1 like %:searchKeyWord%\n" +
                    "\t or cbi6.cm_name1 like %:searchKeyWord%\n" +
                    ")\n" +
                    "union all \n" +
                    "select mmapop.id as publishOrderId \n" +
                    "\t  ,mmapop.material_purchase_order_number as poNumber \n" +
                    "\t  ,uc.name as purchaser \n" +
                    "\t  ,uc2.name as shipper \n" +
                    "\t  ,null as brand \n" +
                    "\t  ,null as buyer \n" +
                    "\t  ,null as designNumber \n" +
                    "\t  ,null as styleNumber \n" +
                    "\t  ,mmapop.estimated_date as  estimatedDate \n" +
                    "\t  ,mmapop.infactory_date as infactoryDate \n" +
                    "\t  ,'adhoc' as poType \n" +
                    "\t  ,(select count(*) from mcl_material_adhoc_purchase_order_item_publish mmapoip where mmapoip.mcl_material_adhoc_purchase_order_id = mmapop.id and mmapoip.del_flag='N') as itemQty\n" +
                    "\t  ,ifnull((select sum(mmapoip.unit_price*mmapoip.ordered_qty) from mcl_material_adhoc_purchase_order_item_publish mmapoip where mmapoip.mcl_material_adhoc_purchase_order_id = mmapop.id and mmapoip.del_flag='N'),0) as totalAmount\n" +
                    "\t  ,ifnull(sapc.po_confirm,0) as poConfirm\n" +
                    "\t  ,ifnull(sapc.revert_memo,'') as revertMemo\n" +
                    "\t  ,mmapop.status as status" +
                    "\t  ,cbi1.cm_name2 as currency" +
                    "\t  ,cbi2.cm_name1 as shippingMode" +
                    "\t  ,cbi3.cm_name1 as dischargePort" +
                    "\t  ,cbi4.cm_name1 as loadingPort" +
                    "\t  ,cbi5.cm_name1 as loadingPortCountry" +
                    "\t  ,cbi6.cm_name1 as dischargePortCountry" +
                    "\t  ,ui.full_name as userName \n" +
                    "\t  ,mmapop.updated_at as updatedAt \n" +
                    "from mcl_material_adhoc_purchase_order_publish mmapop \n" +
                    "inner join user_info ui on ui.id = mmapop.user_id \n" +
                    "inner join user_company uc on uc.id = mmapop.material_purchase_comp_id\n" +
                    "left join user_company uc2 on uc2.id = mmapop.shipper_comp_id \n" +
                    "inner join common_basic_info cbi1 on cbi1.id = mmapop.cm_currency_id \n" +
                    "inner join common_basic_info cbi2 on cbi2.id = mmapop.cm_material_shipping_method_id \n" +
                    "inner join common_basic_info cbi3 on cbi3.id = mmapop.cm_discharge_port_info_id \n" +
                    "inner join common_basic_info cbi4 on cbi4.id = mmapop.cm_loading_port_info_id \n" +
                    "inner join common_basic_info cbi5 on cbi5.id = mmapop.cm_loading_basic_country_id \n" +
                    "inner join common_basic_info cbi6 on cbi6.id = mmapop.cm_discharge_basic_country_id \n" +
                    "left join supplier_adhoc_po_checking sapc on sapc.mcl_material_adhoc_purchase_order_publish_id = mmapop.id \n" +
                    "where mmapop.material_selling_comp_id= :company \n" +
                    "and mmapop.del_flag = 'N' \n" +
                    "and mmapop.status like %:status% \n" +
                    "and (\n" +
                    "\tmmapop.material_purchase_order_number like %:searchKeyWord%\n" +
                    "\t or cbi1.cm_name2 like %:searchKeyWord%\n" +
                    "\t or cbi2.cm_name1 like %:searchKeyWord%\n" +
                    "\t or cbi3.cm_name1 like %:searchKeyWord%\n" +
                    "\t or cbi4.cm_name1 like %:searchKeyWord%\n" +
                    "\t or cbi5.cm_name1 like %:searchKeyWord%\n" +
                    "\t or cbi6.cm_name1 like %:searchKeyWord%\n" +
                    ")\n" +
                    ") so \n" +
                    "order by so.updatedAt desc",
            countQuery =  "select count(so.id) from ( " +
                    "select mmpop.id " +
                    "from mcl_material_purchase_order_publish mmpop \n" +
                    "inner join user_info ui on ui.id = mmpop.user_id \n" +
                    "inner join user_company uc on uc.id = mmpop.material_purchase_comp_id\n" +
                    "left join user_company uc2 on uc2.id = mmpop.shipper_comp_id \n" +
                    "inner join cbd_cover cc on cc.id = mmpop.cbd_cover_id \n" +
                    "inner join common_basic_info cbi1 on cbi1.id = mmpop.cm_currency_id \n" +
                    "inner join common_basic_info cbi2 on cbi2.id = mmpop.cm_material_shipping_method_id \n" +
                    "inner join common_basic_info cbi3 on cbi3.id = mmpop.cm_discharge_port_info_id \n" +
                    "inner join common_basic_info cbi4 on cbi4.id = mmpop.cm_loading_port_info_id \n" +
                    "inner join common_basic_info cbi5 on cbi5.id = mmpop.cm_loading_basic_country_id \n" +
                    "inner join common_basic_info cbi6 on cbi6.id = mmpop.cm_discharge_basic_country_id \n" +
                    "left join supplier_po_checking spc on spc.mcl_material_purchase_order_publish_id = mmpop.id  \n"+
                    "where mmpop.material_selling_comp_id= :company \n" +
                    "and (case when spc.po_confirm is null then mmpop.status\n" +
                    "else case when spc.po_confirm = 0 then 'Confirm' else 'Revert' end end) like %:status% \n" +
                    "and mmpop.del_flag = 'N' \n" +
                    "and (\n" +
                    "\t mmpop.material_purchase_order_number like %:searchKeyWord%\n" +
                    "\t or cbi1.cm_name2 like %:searchKeyWord%\n" +
                    "\t or cbi2.cm_name1 like %:searchKeyWord%\n" +
                    "\t or cbi3.cm_name1 like %:searchKeyWord%\n" +
                    "\t or cbi4.cm_name1 like %:searchKeyWord%\n" +
                    "\t or cbi5.cm_name1 like %:searchKeyWord%\n" +
                    "\t or cbi6.cm_name1 like %:searchKeyWord%\n" +
                    ")" +
                    "union all " +
                    "select mmapop.id " +
                    "from mcl_material_adhoc_purchase_order_publish mmapop \n" +
                    "inner join user_info ui on ui.id = mmapop.user_id \n" +
                    "inner join user_company uc on uc.id = mmapop.material_purchase_comp_id\n" +
                    "left join user_company uc2 on uc2.id = mmapop.shipper_comp_id \n" +
                    "inner join common_basic_info cbi1 on cbi1.id = mmapop.cm_currency_id \n" +
                    "inner join common_basic_info cbi2 on cbi2.id = mmapop.cm_material_shipping_method_id \n" +
                    "inner join common_basic_info cbi3 on cbi3.id = mmapop.cm_discharge_port_info_id \n" +
                    "inner join common_basic_info cbi4 on cbi4.id = mmapop.cm_loading_port_info_id \n" +
                    "inner join common_basic_info cbi5 on cbi5.id = mmapop.cm_loading_basic_country_id \n" +
                    "inner join common_basic_info cbi6 on cbi6.id = mmapop.cm_discharge_basic_country_id \n" +
                    "left join supplier_adhoc_po_checking sapc on sapc.mcl_material_adhoc_purchase_order_publish_id = mmapop.id \n" +
                    "where mmapop.material_selling_comp_id= :company \n" +
                    "and mmapop.status like %:status% \n" +
                    "and mmapop.del_flag = 'N' \n" +
                    "and (\n" +
                    "\tmmapop.material_purchase_order_number like %:searchKeyWord%\n" +
                    "\t or cbi1.cm_name2 like %:searchKeyWord%\n" +
                    "\t or cbi2.cm_name1 like %:searchKeyWord%\n" +
                    "\t or cbi3.cm_name1 like %:searchKeyWord%\n" +
                    "\t or cbi4.cm_name1 like %:searchKeyWord%\n" +
                    "\t or cbi5.cm_name1 like %:searchKeyWord%\n" +
                    "\t or cbi6.cm_name1 like %:searchKeyWord%\n" +
                    ") " +
                    ") so"
    )
    Page<Map<String, Object>> findAll(String status, String searchKeyWord, Company company, Pageable pageable);
}
