package io.vengine.api.error.errorCode;

import com.fasterxml.jackson.annotation.JsonFormat;

@JsonFormat(shape = JsonFormat.Shape.OBJECT)
public enum ErrorCode {
    // Common
    INVALID_INPUT_VALUE(400, "C001", "Invalid value input"),
    METHOD_NOT_ALLOWED(405, "C002", "The method is not allowed."),
    ENTITY_NOT_FOUND(400, "C003", "The entity is not found"),
    INTERNAL_SERVER_ERROR(500, "C004", "Server Error"),
    INVALID_TYPE_VALUE(400, "C005", "The typed value is invalid"),
    HANDLE_ACCESS_DENIED(403, "C006", "Access is denied"),
    DATA_NOT_FOUND(403, "C007", "Data is not found"),
    EXCEPTION_MESSAGE(403, "C008", "Please contact V-go team."),
    DATA_IS_NULL(400, "C009", "Data is null."),

    // User
    EMAIL_DUPLICATION(400, "USER001", "Duplicated Email"),
    LOGIN_INPUT_INVALID(400, "USER002", "Invalid login input"),
    USERID_NOT_FOUND(400, "USER003", "User is not found"),
    COMPANYID_NOT_FOUND(400, "USER004", "Company is not found"),
    DETACH_USER(400, "USER005", "Resigned member"),
    WAIT_USER(400, "USER006", "Pending user"),
    PASSWORD_NOT_MATCH(500, "USER007", "Password is not matched"),
    MENU_TYPE_NULL(500, "USER008", "Menu type is Null"),
    NOT_COMPANY_TYPE(500, "USER009", "Not the right company type"),
    COMPANY_NAME_DUPLICATION(500, "USER010", "Duplicated company name"),
    MANAGER_USER_LEVEL_NOT_FOUND(500, "USER011", "Manager level user is not found"),
    MEMBER_USER_LEVEL_NOT_FOUND(500, "USER012", "The member level user is not found."),
    DEPARTMENT_NOT_FOUND(500, "USER013", "The department info is not found."),
    VERIFY_CODE_NOT_MATCH(500, "USER014", "The verification code is incorrect."),
    DOMAIN_NOT_FOUND(500, "USER015", "Domain is not found"),
    CONFIRM_USER(500, "USER016", "Verified User"),
    COMPANY_ADDRESS_NOT_FOUND(400, "USER017", "Company Address is not found"),
    LEVEL_NOT_FOUND(500, "USER018", "The user level is not found."),
    MENU_NOT_FOUND(500, "USER019", "The user menu is not found"),
    PASSWORD_EMPTY(500, "USER020", "Password is empty"),
    DEPARTMENT_NOT_DELETE(500, "USER021", "Department information has not been deleted"),
    COMPANY_PENDING(500, "USER022", "Status of the company is pending"),
    COMPANY_CONFIRM(500, "USER023", "Company is verified."),
    PARTNER_REGISTER_USER_NULL(500, "USER024", "Partner register user is null."),
    PARTNER_RELATION_TYPE_NULL(500, "USER025", "Partner relation type is null."),
    EMAIL_EMPTY(500, "USER026", "email is empty"),
    COMPANY_NOT_FOUND(500, "USER027", "%s is not found"),
    USER_PENDING(500, "USER028", "Your company has been requested.\nPlease wait for Approval"),
    USER_CONFIRM(500, "USER029", "%s is duplicated.\nPlease check again."),
    USER_STATUS(500, "USER030", "%s is %s"),
    USER_LOGIN_AVAILABLE(500, "USER031", "Only Vendor and Supplier user login available"),

    //COMPANY INFO
    COMPANY_INFO_TYPE_INVALID(500, "I001", "Company Information type is invalid"),
    COMPANY_INFO_NAME_EMPTY(500, "I002", "Company Name shouldn't be empty"),
    COMPANY_INFO_NOT_MODIFY(500, "I003", "Can't modify company information"),
    COMPANY_INFO_NOT_DELETE(500, "I004", "Can't delete company information"),
    COMPANY_RELATION_NOT_FOUND(500, "I005", "The relationship information is not found"),
    COMPANY_SEASON_NOT_FOUND(500, "I006", "The season information is not found"),
    COMPANY_TERMS_NOT_FOUND(500, "I007", "Terms is not found"),
    COMPANY_USAGE_NOT_FOUND(500, "I008", "The usage information is not found"),
    COMPANY_FACTORY_NOT_FOUND(500, "I009", "The Factory information is not found"),
    COMPANY_FORWARD_NOT_FOUND(500, "I010", "The Forwarder company information is not found"),
    COMPANY_PROGRAM_NOT_FOUND(500, "I011", "The company program is not found"),
    COMPANY_MARKET_NOT_FOUND(500, "I012", "The market information is not found"),
    COMPANY_SIZE_NOT_FOUND(500, "I013", "The size Information is not found"),
    COMPANY_COST_NOT_FOUND(500, "I014", "Cost data is not found"),
    COMPANY_BUYER_NOT_FOUND(500, "I015", "Cannot search the Buyer"),
    COMPANY_ORDER_TYPE_NOT_FOUND(500, "I016", "The order type is not found"),
    COMPANY_RELATION_DUPLICATION(500, "I017", "Company relation is duplicated"),
    COMPANY_RELATION_SAME_COMPANY(500, "I018", "Same company relation"),
    COMPANY_DOCUMENT_CODE_NOT_FOUND(500, "I019", "Company document code is not found."),

    //MATERIAL
    MATERIAL_INFO_NOT_FOUND(500, "M001", "Material Information is not found."),
    MATERIAL_INFO_FiILE_UPLOAD_ERROR(500, "M002", "Error in uploading Material Information file."),
    MATERIAL_INFO_CAN_NOT_MODIFY(500, "M003", "Can't modify the Material Information."),
    MATERIAL_INFO_CAN_NOT_DELETE(500, "M004", "Can't delete the Material Information."),
    MATERIAL_YARN_NOT_FOUND(500, "M005", "The Yarn material is not found"),
    MATERIAL_OFFER_NOT_FOUND(500, "M009", "The Material Offer is not found"),
    MATERIAL_YARN_CAN_NOT_DELETE(500, "M014", "Can't delete the Yarn Material"),
    MATERIAL_OFFER_CAN_NOT_MODIFY(500, "M015", "Can't modify the Material Offer"),
    MATERIAL_OFFER_CAN_NOT_DELETE(500, "M016", "Can't delete the Material Offer"),
    MATERIAL_TYPE_INVALID(500, "M017", "Material Type is invalid"),
    MATERIAL_OFFER_IS_NULL(500, "M018", "Material Offer is null"),
    MATERIAL_INFO_IS_SAME(500, "M020", "Material info is same"),
    MATERIAL_OFFER_IS_SAME(500, "M021", "Material Offer is same"),
    MATERIAL_OFFER_CAN_NOT_ASSIGNED(500, "M022", "Material Offer can not assigned"),

    //CBD
    CBD_COVER_NOT_FOUND(500, "CBD001", "CBD Cover is not found"),
    CBD_COVER_NAME_DUPLICATION(500, "CBD002", "The CBD Cover Name is duplicated"),
    CBD_MCL_SAVE_ERROR(500, "CBD003", "Error in saving MCL"),
    CBD_FiILE_UPLOAD_ERROR(500, "CBD004", "Error in uploading the CBD file"),
    CBD_COVER_CAN_NOT_MODIFY(500, "CBD005", "Can't modify the CBD Cover"),
    CBD_COVER_CAN_NOT_DELETE(500, "CBD006", "Can't delete the CBD Cover"),
    CBD_OPTION_NOT_FOUND(500, "CBD007", "The CBD Option is not found"),
    CBD_OPTION_NAME_DUPLICATION(500, "CBD008", "The CBD Option name is duplicated"),
    CBD_OPTION_CAN_NOT_MODIFY(500, "CBD009", "Can't modify the CBD Option"),
    CBD_OPTION_CAN_NOT_DELETE(500, "CBD010", "Can't delete the CBD Option"),
    CBD_COSTING_NOT_FOUND(500, "CBD011", "The CBD Material info for costing is not found"),
    CBD_MATERIAL_INFO_NOT_FOUND(500, "CBD012", "The CBD Material Information is not found"),
    CBD_COSTING_INPUT_UNIT_PRICE(500, "CBD013", "Please input unit price and percentage"),
    CBD_COVER_SAME_DESIGN_DUPLICATION(500, "CBD014", "The CBD Cover design is duplicated"),

    //MCL
    MCL_OPTION_NOT_FOUND(500, "MCL001", "The MCL option is not found"),
    MCL_OPTION_CAN_NOT_MODIFY(500, "MCL002", "Can't modify the MCL option"),
    MCL_OPTION_CAN_NOT_DELETE(500, "MCL003", "Can't delete the MCL option"),
    MCL_PRE_BOOKING_NOT_FOUND(500, "MCL004", "The Pre-booked MCL is not found"),
    MCL_PRE_BOOKING_PO_NOT_FOUND(500, "MCL005", "The pre-booked MCL PO is not found"),
    MCL_COLOR_NOT_FOUND(500, "MCL006", "The MCL Garment Color is not found"),
    MCL_ORDER_QUANTITY_ID_NULL(500, "MCL007", "The MCL Order Quantity ID is null"),
    MCL_ORDER_QUANTITY_NOT_FOUND(500, "MCL008", "The MCL Order Quantity is not found"),
    MCL_CBD_ASSIGN_NOT_FOUND(500, "MCL009", "The assigned MCL CBD is not found"),
    MCL_MATERIAL_INFO_NOT_FOUND(500, "MCL010", "The MCL Material information is not found"),
    MCL_MATERIAL_INFO_CAN_NOT_DELETE(500, "MCL011", "Can't delete the MCL Material Information"),
    MCL_ORDER_INFO_NOT_FOUND(500, "MCL012", "The MCL Purchase Order is not found"),
    MCL_CBD_ASSIGN_DUPLICATION(500, "MCL013", "The assigned MCL CBD is duplicated"),
    MCL_COLOR_CAN_NOT_DELETE(500, "MCL014", "Can't delete the MCL garment color"),
    MCL_SIZE_CAN_NOT_DELETE(500, "MCL015", "Can't delete the MCL garment size"),
    MCL_MARKET_CAN_NOT_DELETE(500, "MCL016", "Can’t delete the MCL garment market"),
    MCL_ORDER_ITEM_NOT_FOUND(500, "MCL017", "The MCL Order item is not found"),
    MCL_ORDER_ITEM_ID_NULL(500, "MCL018", "The MCL order item ID is null"),
    MCL_ORDER_DEPENDENCY_ITEM_NOT_FOUND(500, "MCL019", "The MCL order Item for dependency is not found"),
    MCL_ORDER_PUBLISHED(500, "MCL020", "MCL order has been published"),
    MCL_PUBLISHED_ORDER_NOT_FOUND(500, "MCL021", "The published MCL order is not found"),
    MCL_ORDER_CANCELED(500, "MCL022", "The MCL order is canceled to be published"),
    MCL_PUBLISHED_ORDER_NOT_MODIFY(500, "MCL023", "The published MCL order is not modified"),
    MCL_ORDER_NOT_NOT_PUBLISHED(500, "MCL024", "The MCL order is not published"),
    MCL_ORDER_NUMBER_ERROR(500, "MCL025", "The MCL order number is with error."),
    MCL_ORDER_ONLY_DRAFT_DELETE(500, "MCL026", "Only the draft can be deleted"),
    MCL_OPTION_STATUS_SAME(500, "MCL027", "The MCL option status stays the same"),
    MCL_MATERIAL_STATUS_SAME(500, "MCL028", "The MCL material info status is same"),
    MCL_ORDER_ITEM_EMPTY(500, "MCL029", "The MCL order item is empty"),
    MCL_ORDER_SAME_MATERIAL_INFO(500, "MCL030", "The MCL order has the same material information"),
    MCL_MATERIAL_INFO_NETYY_EMPTY(500, "MCL031", "The netYY in MCL material info is empty"),
    MCL_ORDER_STATUS_ERROR(500, "MCL032", "MCL order status is with error"),
    MCL_ORDER_ONLY_DRAFT(500, "MCL033", "Only the draft order can be published by MCL"),
    MCL_ADHOC_ORDER_NOT_FOUND(500, "MCL034", "MCL adhoc order is not found."),
    MCL_GARMENT_COLOR_NOT_FOUND(500, "MCL035", "MCL Garment Color is not found"),
    MCL_SAME_GARMENT_COLOR(500, "MCL036", "Same Garment Color"),
    MCL_GARMENT_SIZE_NOT_FOUND(500, "MCL037", "MCL Garment Size is not found"),
    MCL_SAME_GARMENT_SIZE(500, "MCL038", "Same Garment Size"),
    MCL_GARMENT_MARKET_NOT_FOUND(500, "MCL039", "MCL garment market is not found"),
    MCL_SAME_GARMENT_MARKET(500, "MCL040", "Same Garment Market"),

    //Order
    SUPPLIER_PO_CHECKING_IS(500, "ORDER001", "Supplier PO is in check"),

    //ETC
    USAGE_PLACE_NULL(500, "ETC001", "Usage spot is null."),
    UOM_IS_NULL(500, "ETC002", "%s uom is null."),
    NO_ITEMS(500, "ETC003", "No Items"),
    ONLY_ONE_ITEM(500, "ETC004", "Only one item is available"),
    POINT_CHECK(500, "ETC005", "%s decimal point have %s"),
    UNIT_PRICE_IS_NULL(500, "ETC006", "Unit price is null."),
    NETYY_IS_NULL(500, "ETC007", "NetYy is null."),
    EXCEL_DATA_IS_NULL(500, "ETC008", "Excel Data is null."),
    EXCEL_UPLOAD_ERROR(500, "ETC009", "Error in uploading the Excel file"),
    NOTICE_NOT_FOUNR(500, "ETC010", "Notice is not found"),
    PERCENTAGE_ONLY_INTEGER(500, "ETC011", "Percentage only accepts integers."),
    NO_UPLOAD_FILE(500, "ETC012", "No Upload File"),
    ;

    private final String code;
    private final String message;
    private int status;

    ErrorCode(final int status, final String code, final String message) {
        this.status = status;
        this.message = message;
        this.code = code;
    }

    public String getMessage() {
        return this.message;
    }

    public String getCode() {
        return code;
    }

    public int getStatus() {
        return status;
    }

}
