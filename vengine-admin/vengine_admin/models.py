# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class BatchJobExecution(models.Model):
    job_execution_id = models.BigIntegerField(db_column='JOB_EXECUTION_ID', primary_key=True)  # Field name made lowercase.
    version = models.BigIntegerField(db_column='VERSION', blank=True, null=True)  # Field name made lowercase.
    job_instance = models.ForeignKey('BatchJobInstance', models.DO_NOTHING, db_column='JOB_INSTANCE_ID')  # Field name made lowercase.
    create_time = models.DateTimeField(db_column='CREATE_TIME')  # Field name made lowercase.
    start_time = models.DateTimeField(db_column='START_TIME', blank=True, null=True)  # Field name made lowercase.
    end_time = models.DateTimeField(db_column='END_TIME', blank=True, null=True)  # Field name made lowercase.
    status = models.CharField(db_column='STATUS', max_length=10, blank=True, null=True)  # Field name made lowercase.
    exit_code = models.CharField(db_column='EXIT_CODE', max_length=2500, blank=True, null=True)  # Field name made lowercase.
    exit_message = models.CharField(db_column='EXIT_MESSAGE', max_length=2500, blank=True, null=True)  # Field name made lowercase.
    last_updated = models.DateTimeField(db_column='LAST_UPDATED', blank=True, null=True)  # Field name made lowercase.
    job_configuration_location = models.CharField(db_column='JOB_CONFIGURATION_LOCATION', max_length=2500, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'BATCH_JOB_EXECUTION'


class BatchJobExecutionContext(models.Model):
    job_execution = models.OneToOneField(BatchJobExecution, models.DO_NOTHING, db_column='JOB_EXECUTION_ID', primary_key=True)  # Field name made lowercase.
    short_context = models.CharField(db_column='SHORT_CONTEXT', max_length=2500)  # Field name made lowercase.
    serialized_context = models.TextField(db_column='SERIALIZED_CONTEXT', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'BATCH_JOB_EXECUTION_CONTEXT'


class BatchJobExecutionParams(models.Model):
    job_execution = models.ForeignKey(BatchJobExecution, models.DO_NOTHING, db_column='JOB_EXECUTION_ID')  # Field name made lowercase.
    type_cd = models.CharField(db_column='TYPE_CD', max_length=6)  # Field name made lowercase.
    key_name = models.CharField(db_column='KEY_NAME', max_length=100)  # Field name made lowercase.
    string_val = models.CharField(db_column='STRING_VAL', max_length=250, blank=True, null=True)  # Field name made lowercase.
    date_val = models.DateTimeField(db_column='DATE_VAL', blank=True, null=True)  # Field name made lowercase.
    long_val = models.BigIntegerField(db_column='LONG_VAL', blank=True, null=True)  # Field name made lowercase.
    double_val = models.FloatField(db_column='DOUBLE_VAL', blank=True, null=True)  # Field name made lowercase.
    identifying = models.CharField(db_column='IDENTIFYING', max_length=1)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'BATCH_JOB_EXECUTION_PARAMS'


class BatchJobExecutionSeq(models.Model):
    id = models.BigIntegerField(db_column='ID')  # Field name made lowercase.
    unique_key = models.CharField(db_column='UNIQUE_KEY', unique=True, max_length=1)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'BATCH_JOB_EXECUTION_SEQ'


class BatchJobInstance(models.Model):
    job_instance_id = models.BigIntegerField(db_column='JOB_INSTANCE_ID', primary_key=True)  # Field name made lowercase.
    version = models.BigIntegerField(db_column='VERSION', blank=True, null=True)  # Field name made lowercase.
    job_name = models.CharField(db_column='JOB_NAME', max_length=100)  # Field name made lowercase.
    job_key = models.CharField(db_column='JOB_KEY', max_length=32)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'BATCH_JOB_INSTANCE'
        unique_together = (('job_name', 'job_key'),)


class BatchJobSeq(models.Model):
    id = models.BigIntegerField(db_column='ID')  # Field name made lowercase.
    unique_key = models.CharField(db_column='UNIQUE_KEY', unique=True, max_length=1)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'BATCH_JOB_SEQ'


class BatchStepExecution(models.Model):
    step_execution_id = models.BigIntegerField(db_column='STEP_EXECUTION_ID', primary_key=True)  # Field name made lowercase.
    version = models.BigIntegerField(db_column='VERSION')  # Field name made lowercase.
    step_name = models.CharField(db_column='STEP_NAME', max_length=100)  # Field name made lowercase.
    job_execution = models.ForeignKey(BatchJobExecution, models.DO_NOTHING, db_column='JOB_EXECUTION_ID')  # Field name made lowercase.
    start_time = models.DateTimeField(db_column='START_TIME')  # Field name made lowercase.
    end_time = models.DateTimeField(db_column='END_TIME', blank=True, null=True)  # Field name made lowercase.
    status = models.CharField(db_column='STATUS', max_length=10, blank=True, null=True)  # Field name made lowercase.
    commit_count = models.BigIntegerField(db_column='COMMIT_COUNT', blank=True, null=True)  # Field name made lowercase.
    read_count = models.BigIntegerField(db_column='READ_COUNT', blank=True, null=True)  # Field name made lowercase.
    filter_count = models.BigIntegerField(db_column='FILTER_COUNT', blank=True, null=True)  # Field name made lowercase.
    write_count = models.BigIntegerField(db_column='WRITE_COUNT', blank=True, null=True)  # Field name made lowercase.
    read_skip_count = models.BigIntegerField(db_column='READ_SKIP_COUNT', blank=True, null=True)  # Field name made lowercase.
    write_skip_count = models.BigIntegerField(db_column='WRITE_SKIP_COUNT', blank=True, null=True)  # Field name made lowercase.
    process_skip_count = models.BigIntegerField(db_column='PROCESS_SKIP_COUNT', blank=True, null=True)  # Field name made lowercase.
    rollback_count = models.BigIntegerField(db_column='ROLLBACK_COUNT', blank=True, null=True)  # Field name made lowercase.
    exit_code = models.CharField(db_column='EXIT_CODE', max_length=2500, blank=True, null=True)  # Field name made lowercase.
    exit_message = models.CharField(db_column='EXIT_MESSAGE', max_length=2500, blank=True, null=True)  # Field name made lowercase.
    last_updated = models.DateTimeField(db_column='LAST_UPDATED', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'BATCH_STEP_EXECUTION'


class BatchStepExecutionContext(models.Model):
    step_execution = models.OneToOneField(BatchStepExecution, models.DO_NOTHING, db_column='STEP_EXECUTION_ID', primary_key=True)  # Field name made lowercase.
    short_context = models.CharField(db_column='SHORT_CONTEXT', max_length=2500)  # Field name made lowercase.
    serialized_context = models.TextField(db_column='SERIALIZED_CONTEXT', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'BATCH_STEP_EXECUTION_CONTEXT'


class BatchStepExecutionSeq(models.Model):
    id = models.BigIntegerField(db_column='ID')  # Field name made lowercase.
    unique_key = models.CharField(db_column='UNIQUE_KEY', unique=True, max_length=1)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'BATCH_STEP_EXECUTION_SEQ'


class BuyerApiInfo(models.Model):
    id = models.BigAutoField(primary_key=True)
    comp = models.ForeignKey('UserCompany', models.DO_NOTHING)
    user_id = models.CharField(max_length=150, blank=True, null=True)
    accesskeyid = models.CharField(db_column='accessKeyId', max_length=150, blank=True, null=True)  # Field name made lowercase.
    secretaccesskey = models.CharField(db_column='secretAccessKey', max_length=255, blank=True, null=True)  # Field name made lowercase.
    datakey = models.CharField(db_column='dataKey', max_length=150, blank=True, null=True)  # Field name made lowercase.
    del_flag = models.CharField(max_length=2, blank=True, null=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'buyer_api_info'


class BuyerOrderChangeDescription(models.Model):
    id = models.BigAutoField(primary_key=True)
    text = models.CharField(max_length=500, db_collation='utf8mb4_unicode_ci')
    buyerorderinfoid = models.ForeignKey('BuyerOrderInfo', models.DO_NOTHING, db_column='buyerOrderInfoId')  # Field name made lowercase.
    createdat = models.DateTimeField(db_column='createdAt')  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'buyer_order_change_description'


class BuyerOrderHangtag(models.Model):
    id = models.BigAutoField(primary_key=True)
    ponumber = models.CharField(db_column='poNumber', max_length=45)  # Field name made lowercase.
    skunumber = models.CharField(db_column='skuNumber', max_length=50)  # Field name made lowercase.
    descriptivesize = models.CharField(db_column='descriptiveSize', max_length=45)  # Field name made lowercase.
    upcnumber = models.CharField(db_column='upcNumber', max_length=45)  # Field name made lowercase.
    price = models.CharField(max_length=60)
    tickettype = models.CharField(db_column='ticketType', max_length=45)  # Field name made lowercase.
    ticketquantity = models.IntegerField(db_column='ticketQuantity')  # Field name made lowercase.
    acceptedon = models.CharField(db_column='acceptedOn', max_length=45)  # Field name made lowercase.
    comp_id = models.BigIntegerField()
    user_id = models.CharField(max_length=255, blank=True, null=True)
    createdat = models.DateTimeField(db_column='createdAt')  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'buyer_order_hangtag'


class BuyerOrderInfo(models.Model):
    id = models.BigAutoField(primary_key=True)
    assignedtouserid = models.CharField(db_column='assignedToUserId', max_length=30, blank=True, null=True)  # Field name made lowercase.
    uid = models.CharField(max_length=15, blank=True, null=True)
    objecttype = models.CharField(db_column='objectType', max_length=45, blank=True, null=True)  # Field name made lowercase.
    documenttype = models.CharField(db_column='documentType', max_length=30, blank=True, null=True)  # Field name made lowercase.
    documentid = models.CharField(db_column='documentId', max_length=15, blank=True, null=True)  # Field name made lowercase.
    documentrefnumber = models.CharField(db_column='documentRefNumber', max_length=30, blank=True, null=True)  # Field name made lowercase.
    status = models.CharField(max_length=20, blank=True, null=True)
    orderstatuscode = models.CharField(db_column='orderStatusCode', max_length=30, blank=True, null=True)  # Field name made lowercase.
    assignedon = models.CharField(db_column='assignedOn', max_length=45, blank=True, null=True)  # Field name made lowercase.
    acceptedon = models.CharField(db_column='acceptedOn', max_length=45, blank=True, null=True)  # Field name made lowercase.
    cancelledon = models.CharField(db_column='cancelledOn', max_length=45, blank=True, null=True)  # Field name made lowercase.
    suspendedon = models.CharField(db_column='suspendedOn', max_length=45, blank=True, null=True)  # Field name made lowercase.
    finishedon = models.CharField(db_column='finishedOn', max_length=45, blank=True, null=True)  # Field name made lowercase.
    url = models.CharField(max_length=150, blank=True, null=True)
    shipmenturl = models.CharField(db_column='shipmentUrl', max_length=150, blank=True, null=True)  # Field name made lowercase.
    orderclass = models.CharField(db_column='orderClass', max_length=10, blank=True, null=True)  # Field name made lowercase.
    deptname = models.CharField(db_column='deptName', max_length=30, blank=True, null=True)  # Field name made lowercase.
    deptcode = models.CharField(db_column='deptCode', max_length=10, blank=True, null=True)  # Field name made lowercase.
    destinationcountry = models.CharField(db_column='destinationCountry', max_length=5, blank=True, null=True)  # Field name made lowercase.
    origincountry = models.CharField(db_column='originCountry', max_length=20, blank=True, null=True)  # Field name made lowercase.
    origincity = models.CharField(db_column='originCity', max_length=20, blank=True, null=True)  # Field name made lowercase.
    brand = models.CharField(max_length=50, blank=True, null=True)
    divisionname = models.CharField(db_column='divisionName', max_length=30, blank=True, null=True)  # Field name made lowercase.
    marketpono = models.CharField(db_column='marketPONo', max_length=10, blank=True, null=True)  # Field name made lowercase.
    marketdesc = models.CharField(db_column='marketDesc', max_length=20, blank=True, null=True)  # Field name made lowercase.
    issuedate = models.CharField(db_column='issueDate', max_length=10, blank=True, null=True)  # Field name made lowercase.
    cancelafterdate = models.CharField(db_column='cancelAfterDate', max_length=10, blank=True, null=True)  # Field name made lowercase.
    latestdate = models.CharField(db_column='latestDate', max_length=10, blank=True, null=True)  # Field name made lowercase.
    earliestdate = models.CharField(db_column='earliestDate', max_length=10, blank=True, null=True)  # Field name made lowercase.
    contractshipcanceldate = models.CharField(db_column='contractShipCancelDate', max_length=10, blank=True, null=True)  # Field name made lowercase.
    indcdate = models.CharField(db_column='inDcDate', max_length=10, blank=True, null=True)  # Field name made lowercase.
    instoredate = models.CharField(db_column='inStoreDate', max_length=10, blank=True, null=True)  # Field name made lowercase.
    revisionnumber = models.CharField(db_column='revisionNumber', max_length=15, blank=True, null=True)  # Field name made lowercase.
    currencycode = models.CharField(db_column='currencyCode', max_length=5, blank=True, null=True)  # Field name made lowercase.
    retailseason = models.CharField(db_column='retailSeason', max_length=45, blank=True, null=True)  # Field name made lowercase.
    buildtypecode = models.CharField(db_column='buildTypeCode', max_length=20, blank=True, null=True)  # Field name made lowercase.
    shipmentmethodcode = models.CharField(db_column='shipmentMethodCode', max_length=2, blank=True, null=True)  # Field name made lowercase.
    factorydifferent = models.IntegerField(db_column='factoryDifferent')  # Field name made lowercase.
    orderedquantity = models.IntegerField(db_column='orderedQuantity', blank=True, null=True)  # Field name made lowercase.
    shipmentquantity = models.IntegerField(db_column='shipmentQuantity', blank=True, null=True)  # Field name made lowercase.
    incotermcode = models.CharField(db_column='incotermCode', max_length=45, blank=True, null=True)  # Field name made lowercase.
    timestamp = models.DateTimeField(blank=True, null=True)
    flag = models.CharField(max_length=1, blank=True, null=True)
    comp_id = models.BigIntegerField()
    user_id = models.CharField(max_length=255, blank=True, null=True)
    createdat = models.DateTimeField(db_column='createdAt')  # Field name made lowercase.
    buyer = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'buyer_order_info'


class BuyerOrderInvoice(models.Model):
    id = models.BigAutoField(primary_key=True)
    buyerorderinfoid = models.ForeignKey(BuyerOrderInfo, models.DO_NOTHING, db_column='buyerOrderInfoId')  # Field name made lowercase.
    invoiceurl = models.CharField(db_column='invoiceURL', max_length=500, blank=True, null=True)  # Field name made lowercase.
    invoicenumber = models.CharField(db_column='invoiceNumber', max_length=45)  # Field name made lowercase.
    invoiceuid = models.CharField(db_column='invoiceUid', max_length=45)  # Field name made lowercase.
    shipmentdocumentuid = models.CharField(db_column='shipmentDocumentUid', max_length=45)  # Field name made lowercase.
    shipmenturl = models.CharField(db_column='shipmentURL', max_length=500, blank=True, null=True)  # Field name made lowercase.
    draftedon = models.CharField(db_column='draftedOn', max_length=45, blank=True, null=True)  # Field name made lowercase.
    publishedon = models.CharField(db_column='publishedOn', max_length=45, blank=True, null=True)  # Field name made lowercase.
    cancelledon = models.CharField(db_column='cancelledOn', max_length=45, blank=True, null=True)  # Field name made lowercase.
    rejectedon = models.CharField(db_column='rejectedOn', max_length=45, blank=True, null=True)  # Field name made lowercase.
    finishedon = models.CharField(db_column='finishedOn', max_length=45, blank=True, null=True)  # Field name made lowercase.
    status = models.CharField(max_length=15)
    totalquantity = models.CharField(db_column='totalQuantity', max_length=45, blank=True, null=True)  # Field name made lowercase.
    totalmerchandiseamount = models.FloatField(db_column='totalMerchandiseAmount', blank=True, null=True)  # Field name made lowercase.
    totalallowancechargeamount = models.FloatField(db_column='totalAllowanceChargeAmount', blank=True, null=True)  # Field name made lowercase.
    totaltaxamount = models.FloatField(db_column='totalTaxAmount', blank=True, null=True)  # Field name made lowercase.
    totaldocumentamount = models.FloatField(db_column='totalDocumentAmount', blank=True, null=True)  # Field name made lowercase.
    rejectedreferencedocumenttype = models.CharField(db_column='rejectedReferenceDocumentType', max_length=10, blank=True, null=True)  # Field name made lowercase.
    rejectedreferencedocumentid = models.CharField(db_column='rejectedReferenceDocumentId', max_length=50, blank=True, null=True)  # Field name made lowercase.
    rejectedreferencedocumentnote = models.CharField(db_column='rejectedReferenceDocumentNote', max_length=200, blank=True, null=True)  # Field name made lowercase.
    rejectedreferencedocumenturl = models.CharField(db_column='rejectedReferenceDocumentUrl', max_length=500, blank=True, null=True)  # Field name made lowercase.
    comp_id = models.BigIntegerField()
    user_id = models.CharField(max_length=255, blank=True, null=True)
    createdat = models.DateTimeField(db_column='createdAt')  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'buyer_order_invoice'


class BuyerOrderItem(models.Model):
    id = models.BigAutoField(primary_key=True)
    color = models.CharField(max_length=50, blank=True, null=True)
    size = models.CharField(max_length=10, blank=True, null=True)
    qty = models.CharField(max_length=5, blank=True, null=True)
    pkqty = models.CharField(db_column='pkQty', max_length=5, blank=True, null=True)  # Field name made lowercase.
    priceperunit = models.CharField(db_column='pricePerUnit', max_length=10, blank=True, null=True)  # Field name made lowercase.
    totalprice = models.CharField(db_column='totalPrice', max_length=10, blank=True, null=True)  # Field name made lowercase.
    description = models.CharField(max_length=100, blank=True, null=True)
    prepacktype = models.CharField(db_column='prepackType', max_length=10, blank=True, null=True)  # Field name made lowercase.
    fullcartonindicator = models.CharField(db_column='fullCartonIndicator', max_length=1, blank=True, null=True)  # Field name made lowercase.
    qtyperouterpack = models.CharField(db_column='qtyPerOuterPack', max_length=5, blank=True, null=True)  # Field name made lowercase.
    qtyperinnerpack = models.CharField(db_column='qtyPerInnerPack', max_length=5, blank=True, null=True)  # Field name made lowercase.
    sku = models.CharField(max_length=20, blank=True, null=True)
    line = models.CharField(max_length=5, blank=True, null=True)
    packinstructionreference = models.CharField(db_column='packInstructionReference', max_length=15, blank=True, null=True)  # Field name made lowercase.
    buyerorderinfoid = models.ForeignKey(BuyerOrderInfo, models.DO_NOTHING, db_column='buyerOrderInfoId')  # Field name made lowercase.
    stylenumber = models.CharField(db_column='styleNumber', max_length=45, blank=True, null=True)  # Field name made lowercase.
    itemtypecode = models.CharField(db_column='itemTypeCode', max_length=50, blank=True, null=True)  # Field name made lowercase.
    itemuid = models.CharField(db_column='itemUid', max_length=50, blank=True, null=True)  # Field name made lowercase.
    comp_id = models.BigIntegerField()
    user_id = models.CharField(max_length=255, blank=True, null=True)
    createdat = models.DateTimeField(db_column='createdAt')  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'buyer_order_item'


class BuyerOrderParty(models.Model):
    id = models.BigAutoField(primary_key=True)
    role = models.CharField(max_length=50, blank=True, null=True)
    name = models.CharField(max_length=70, blank=True, null=True)
    department = models.CharField(max_length=50, blank=True, null=True)
    addressline1 = models.CharField(db_column='addressLine1', max_length=100, blank=True, null=True)  # Field name made lowercase.
    addressline2 = models.CharField(db_column='addressLine2', max_length=100, blank=True, null=True)  # Field name made lowercase.
    city = models.CharField(max_length=30, blank=True, null=True)
    stateorprovince = models.CharField(db_column='stateOrProvince', max_length=30, blank=True, null=True)  # Field name made lowercase.
    postalcodenumber = models.CharField(db_column='postalCodeNumber', max_length=50, blank=True, null=True)  # Field name made lowercase.
    countrycode = models.CharField(db_column='countryCode', max_length=10, blank=True, null=True)  # Field name made lowercase.
    buyerorderinfoid = models.ForeignKey(BuyerOrderInfo, models.DO_NOTHING, db_column='buyerOrderInfoId')  # Field name made lowercase.
    comp_id = models.BigIntegerField()
    user_id = models.CharField(max_length=255, blank=True, null=True)
    createdat = models.DateTimeField(db_column='createdAt')  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'buyer_order_party'
        unique_together = (('role', 'buyerorderinfoid'),)


class CbdCover(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey('UserInfo', models.DO_NOTHING)
    comp = models.ForeignKey('UserCompany', models.DO_NOTHING)
    dept = models.ForeignKey('UserDepartment', models.DO_NOTHING)
    buyer_comp = models.ForeignKey('UserCompany', models.DO_NOTHING)
    vendor_brand = models.ForeignKey('UserCompany', models.DO_NOTHING)
    common_gender = models.ForeignKey('CommonBasicInfo', models.DO_NOTHING)
    cm_material_type = models.ForeignKey('CommonMaterialType', models.DO_NOTHING)
    comp_season = models.ForeignKey('CompSeason', models.DO_NOTHING)
    season_year = models.IntegerField()
    comp_order_type = models.ForeignKey('CompOrderType', models.DO_NOTHING)
    design_number = models.CharField(max_length=60)
    cbd_name = models.CharField(max_length=50)
    cbd_img = models.CharField(max_length=255, blank=True, null=True)
    common_garment_category = models.ForeignKey('CommonBasicInfo', models.DO_NOTHING)
    common_currency = models.ForeignKey('CommonBasicInfo', models.DO_NOTHING)
    status = models.CharField(max_length=30, blank=True, null=True)
    del_flag = models.CharField(max_length=2, blank=True, null=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField(blank=True, null=True)
    del_date = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'cbd_cover'
        unique_together = (('comp', 'buyer_comp', 'vendor_brand', 'common_gender', 'cm_material_type', 'comp_season', 'season_year', 'comp_order_type', 'design_number', 'common_garment_category', 'common_currency', 'del_date'),)


class CbdMaterialCosting(models.Model):
    id = models.BigAutoField(primary_key=True)
    cbd_option = models.ForeignKey('CbdOption', models.DO_NOTHING)
    type = models.CharField(max_length=20)
    comp_cost = models.ForeignKey('CompCost', models.DO_NOTHING)
    cost_value = models.DecimalField(max_digits=15, decimal_places=2, blank=True, null=True)
    value_kind = models.CharField(max_length=20, blank=True, null=True)
    del_flag = models.CharField(max_length=2, blank=True, null=True)
    comp = models.ForeignKey('UserCompany', models.DO_NOTHING)
    dept = models.ForeignKey('UserDepartment', models.DO_NOTHING)
    user = models.ForeignKey('UserInfo', models.DO_NOTHING)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'cbd_material_costing'


class CbdMaterialInfo(models.Model):
    id = models.BigAutoField(primary_key=True)
    cbd_option = models.ForeignKey('CbdOption', models.DO_NOTHING)
    comp = models.ForeignKey('UserCompany', models.DO_NOTHING)
    dept = models.ForeignKey('UserDepartment', models.DO_NOTHING)
    user = models.ForeignKey('UserInfo', models.DO_NOTHING)
    material_info = models.ForeignKey('MaterialInfo', models.DO_NOTHING)
    type = models.CharField(max_length=20)
    supplier_material = models.CharField(max_length=20, blank=True, null=True)
    net_yy = models.DecimalField(max_digits=6, decimal_places=3, blank=True, null=True)
    tolerance = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    cbd_material_uom = models.ForeignKey('CommonBasicInfo', models.DO_NOTHING, blank=True, null=True)
    subsidiary_detail = models.CharField(max_length=200, blank=True, null=True)
    del_flag = models.CharField(max_length=2, blank=True, null=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField(blank=True, null=True)
    material_offer = models.ForeignKey('MaterialOffer', models.DO_NOTHING, blank=True, null=True)
    comp_usage = models.CharField(max_length=100, blank=True, null=True)
    unit_price = models.DecimalField(max_digits=15, decimal_places=5, blank=True, null=True)
    size_memo = models.CharField(max_length=1000, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'cbd_material_info'


class CbdOption(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=100)
    final_cost = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    profit_cost = models.DecimalField(max_digits=5, decimal_places=2)
    goods_quantity = models.IntegerField(blank=True, null=True)
    cbd_cover = models.ForeignKey(CbdCover, models.DO_NOTHING)
    del_flag = models.CharField(max_length=2, blank=True, null=True)
    status = models.CharField(max_length=30, blank=True, null=True)
    comp = models.ForeignKey('UserCompany', models.DO_NOTHING)
    dept = models.ForeignKey('UserDepartment', models.DO_NOTHING)
    user = models.ForeignKey('UserInfo', models.DO_NOTHING)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'cbd_option'
        unique_together = (('cbd_cover', 'name'),)


class CommonBasicInfo(models.Model):
    id = models.BigAutoField(primary_key=True)
    type = models.CharField(max_length=30)
    cm_name1 = models.CharField(max_length=255, blank=True, null=True)
    cm_name2 = models.CharField(max_length=255, blank=True, null=True)
    cm_name3 = models.CharField(max_length=255, blank=True, null=True)
    cm_name4 = models.CharField(max_length=2000, blank=True, null=True)
    cm_name5 = models.BigIntegerField(blank=True, null=True)
    cm_name6 = models.BigIntegerField(blank=True, null=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'common_basic_info'


class CommonMaterialType(models.Model):
    id = models.BigAutoField(primary_key=True)
    category_a = models.CharField(max_length=100, blank=True, null=True)
    category_b = models.CharField(max_length=100, blank=True, null=True)
    category_c = models.CharField(max_length=100, blank=True, null=True)
    del_flag = models.CharField(max_length=2, blank=True, null=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'common_material_type'


class CommonNotice(models.Model):
    id = models.BigAutoField(primary_key=True)
    category = models.IntegerField()
    event = models.CharField(max_length=200)
    detail = models.CharField(max_length=2000)
    status = models.IntegerField()
    del_flag = models.CharField(max_length=2, blank=True, null=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'common_notice'


class CompBizRelation(models.Model):
    id = models.BigAutoField(primary_key=True)
    relation_type = models.CharField(max_length=100)
    status = models.CharField(max_length=30, blank=True, null=True)
    del_flag = models.CharField(max_length=2, blank=True, null=True)
    comp_register = models.ForeignKey('UserCompany', models.DO_NOTHING)
    biz_comp = models.ForeignKey('UserCompany', models.DO_NOTHING)
    comp = models.ForeignKey('UserCompany', models.DO_NOTHING)
    dept = models.ForeignKey('UserDepartment', models.DO_NOTHING)
    user = models.ForeignKey('UserInfo', models.DO_NOTHING)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'comp_biz_relation'


class CompBizRequest(models.Model):
    id = models.BigAutoField(primary_key=True)
    request_comp = models.ForeignKey('UserCompany', models.DO_NOTHING)
    response_comp = models.ForeignKey('UserCompany', models.DO_NOTHING)
    approve_status = models.IntegerField()
    del_flag = models.CharField(max_length=2, blank=True, null=True)
    comp = models.ForeignKey('UserCompany', models.DO_NOTHING)
    dept = models.ForeignKey('UserDepartment', models.DO_NOTHING)
    user = models.ForeignKey('UserInfo', models.DO_NOTHING)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField(blank=True, null=True)
    comp_biz_relation = models.ForeignKey(CompBizRelation, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'comp_biz_request'


class CompBuyer(models.Model):
    id = models.BigAutoField(primary_key=True)
    brand_comp = models.ForeignKey('UserCompany', models.DO_NOTHING)
    cm_incoterms = models.ForeignKey(CommonBasicInfo, models.DO_NOTHING)
    cm_payment = models.ForeignKey(CommonBasicInfo, models.DO_NOTHING)
    cm_payment_period = models.ForeignKey(CommonBasicInfo, models.DO_NOTHING)
    cm_payment_base = models.ForeignKey(CommonBasicInfo, models.DO_NOTHING)
    accountee_comp = models.ForeignKey('UserCompany', models.DO_NOTHING, blank=True, null=True)
    comp_garment_market = models.ForeignKey('CompGarmentMarket', models.DO_NOTHING, blank=True, null=True)
    forwarder_comp = models.ForeignKey('UserCompany', models.DO_NOTHING)
    buyer_plus_tolerance = models.IntegerField()
    buyer_minus_tolerance = models.IntegerField()
    del_flag = models.CharField(max_length=2, blank=True, null=True)
    comp = models.ForeignKey('UserCompany', models.DO_NOTHING)
    dept = models.ForeignKey('UserDepartment', models.DO_NOTHING)
    user = models.ForeignKey('UserInfo', models.DO_NOTHING)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'comp_buyer'


class CompBuyerDeduction(models.Model):
    id = models.BigAutoField(primary_key=True)
    comp_buyer = models.ForeignKey(CompBuyer, models.DO_NOTHING)
    name = models.CharField(max_length=100)
    cm_uom = models.ForeignKey(CommonBasicInfo, models.DO_NOTHING)
    value = models.DecimalField(max_digits=15, decimal_places=2)
    comp_cost = models.ForeignKey('CompCost', models.DO_NOTHING)
    del_flag = models.CharField(max_length=2, blank=True, null=True)
    comp = models.ForeignKey('UserCompany', models.DO_NOTHING)
    dept = models.ForeignKey('UserDepartment', models.DO_NOTHING)
    user = models.ForeignKey('UserInfo', models.DO_NOTHING)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'comp_buyer_deduction'


class CompCost(models.Model):
    id = models.BigAutoField(primary_key=True)
    type = models.CharField(max_length=20)
    name = models.CharField(max_length=200)
    del_flag = models.CharField(max_length=2, blank=True, null=True)
    comp = models.ForeignKey('UserCompany', models.DO_NOTHING, blank=True, null=True)
    dept = models.ForeignKey('UserDepartment', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey('UserInfo', models.DO_NOTHING, blank=True, null=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'comp_cost'
        unique_together = (('type', 'name', 'comp'),)


class CompDocumentCode(models.Model):
    id = models.BigAutoField(primary_key=True)
    comp = models.ForeignKey('UserCompany', models.DO_NOTHING)
    cm_doc_info = models.ForeignKey(CommonBasicInfo, models.DO_NOTHING)
    doc_code = models.CharField(max_length=30)
    idx = models.IntegerField()
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'comp_document_code'


class CompDomainRelation(models.Model):
    id = models.BigAutoField(primary_key=True)
    comp_info = models.ForeignKey('UserCompany', models.DO_NOTHING)
    relation_domain = models.CharField(max_length=150, blank=True, null=True)
    del_flag = models.CharField(max_length=2, blank=True, null=True)
    comp = models.ForeignKey('UserCompany', models.DO_NOTHING)
    dept = models.ForeignKey('UserDepartment', models.DO_NOTHING)
    user = models.ForeignKey('UserInfo', models.DO_NOTHING)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'comp_domain_relation'


class CompFactoryStore(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=100)
    del_flag = models.CharField(max_length=2, blank=True, null=True)
    comp = models.ForeignKey('UserCompany', models.DO_NOTHING, blank=True, null=True)
    dept = models.ForeignKey('UserDepartment', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey('UserInfo', models.DO_NOTHING, blank=True, null=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'comp_factory_store'
        unique_together = (('name', 'comp'),)


class CompForwarder(models.Model):
    id = models.BigAutoField(primary_key=True)
    forwarder_comp = models.ForeignKey('UserCompany', models.DO_NOTHING)
    cm_country_pol = models.ForeignKey(CommonBasicInfo, models.DO_NOTHING)
    cm_port_pol = models.ForeignKey(CommonBasicInfo, models.DO_NOTHING)
    pol_locode = models.CharField(max_length=10)
    cm_country_pod = models.ForeignKey(CommonBasicInfo, models.DO_NOTHING)
    cm_port_pod = models.ForeignKey(CommonBasicInfo, models.DO_NOTHING)
    pod_locode = models.CharField(max_length=10)
    del_flag = models.CharField(max_length=2, blank=True, null=True)
    comp = models.ForeignKey('UserCompany', models.DO_NOTHING, blank=True, null=True)
    dept = models.ForeignKey('UserDepartment', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey('UserInfo', models.DO_NOTHING, blank=True, null=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'comp_forwarder'


class CompGarmentMarket(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=100)
    del_flag = models.CharField(max_length=2, blank=True, null=True)
    comp = models.ForeignKey('UserCompany', models.DO_NOTHING, blank=True, null=True)
    dept = models.ForeignKey('UserDepartment', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey('UserInfo', models.DO_NOTHING, blank=True, null=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'comp_garment_market'
        unique_together = (('name', 'comp'),)


class CompGarmentProgram(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=100)
    del_flag = models.CharField(max_length=2, blank=True, null=True)
    comp = models.ForeignKey('UserCompany', models.DO_NOTHING, blank=True, null=True)
    dept = models.ForeignKey('UserDepartment', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey('UserInfo', models.DO_NOTHING, blank=True, null=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'comp_garment_program'
        unique_together = (('name', 'comp'),)


class CompGarmentSize(models.Model):
    id = models.BigAutoField(primary_key=True)
    created_at = models.DateTimeField(blank=True, null=True)
    del_flag = models.CharField(max_length=2, blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)
    name = models.CharField(max_length=100)
    size_group = models.CharField(max_length=200)
    comp = models.ForeignKey('UserCompany', models.DO_NOTHING)
    dept = models.ForeignKey('UserDepartment', models.DO_NOTHING)
    user = models.ForeignKey('UserInfo', models.DO_NOTHING)
    common_garment_category = models.ForeignKey(CommonBasicInfo, models.DO_NOTHING)
    common_gender = models.ForeignKey(CommonBasicInfo, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'comp_garment_size'


class CompOrderType(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=100)
    del_flag = models.CharField(max_length=2, blank=True, null=True)
    comp = models.ForeignKey('UserCompany', models.DO_NOTHING, blank=True, null=True)
    dept = models.ForeignKey('UserDepartment', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey('UserInfo', models.DO_NOTHING, blank=True, null=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'comp_order_type'
        unique_together = (('name', 'comp'),)


class CompPurchaseOrderType(models.Model):
    id = models.BigAutoField(primary_key=True)
    created_at = models.DateTimeField(blank=True, null=True)
    del_flag = models.CharField(max_length=2, blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)
    description = models.CharField(max_length=200, blank=True, null=True)
    name = models.CharField(max_length=100)
    comp = models.ForeignKey('UserCompany', models.DO_NOTHING)
    dept = models.ForeignKey('UserDepartment', models.DO_NOTHING)
    user = models.ForeignKey('UserInfo', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'comp_purchase_order_type'


class CompRelation(models.Model):
    id = models.BigAutoField(primary_key=True)
    buyer_comp = models.ForeignKey('UserCompany', models.DO_NOTHING)
    buyer_nickname = models.CharField(max_length=100, blank=True, null=True)
    buyer_code = models.CharField(max_length=10, blank=True, null=True)
    subsidiary_comp = models.ForeignKey('UserCompany', models.DO_NOTHING, blank=True, null=True)
    subsidiary_nickname = models.CharField(max_length=100, blank=True, null=True)
    subsidiary_code = models.CharField(max_length=10, blank=True, null=True)
    del_flag = models.CharField(max_length=2, blank=True, null=True)
    comp = models.ForeignKey('UserCompany', models.DO_NOTHING)
    dept = models.ForeignKey('UserDepartment', models.DO_NOTHING)
    user = models.ForeignKey('UserInfo', models.DO_NOTHING)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'comp_relation'


class CompSeason(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=100)
    del_flag = models.CharField(max_length=2, blank=True, null=True)
    comp = models.ForeignKey('UserCompany', models.DO_NOTHING, blank=True, null=True)
    dept = models.ForeignKey('UserDepartment', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey('UserInfo', models.DO_NOTHING, blank=True, null=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'comp_season'
        unique_together = (('name', 'comp'),)


class CompTerms(models.Model):
    id = models.BigAutoField(primary_key=True)
    terms = models.TextField(blank=True, null=True)
    del_flag = models.CharField(max_length=2, blank=True, null=True)
    comp = models.ForeignKey('UserCompany', models.DO_NOTHING, blank=True, null=True)
    dept = models.ForeignKey('UserDepartment', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey('UserInfo', models.DO_NOTHING, blank=True, null=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField(blank=True, null=True)
    cm_document_type = models.ForeignKey(CommonBasicInfo, models.DO_NOTHING, blank=True, null=True)
    cm_material_type = models.ForeignKey(CommonBasicInfo, models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'comp_terms'


class CrawlingNews(models.Model):
    id = models.BigAutoField(primary_key=True)
    create_date = models.DateTimeField(blank=True, null=True)
    article_num = models.CharField(max_length=10)
    country = models.CharField(max_length=10)
    category_name = models.CharField(max_length=100, blank=True, null=True)
    outlets = models.CharField(max_length=100, blank=True, null=True)
    reporter = models.CharField(max_length=200, blank=True, null=True)
    headline = models.CharField(max_length=255, blank=True, null=True)
    sentence = models.TextField(blank=True, null=True)
    image_url = models.CharField(max_length=255, blank=True, null=True)
    content_url = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 'crawling_news'


class CrawlingWord(models.Model):
    created_at = models.DateField(primary_key=True)
    updated_at = models.DateTimeField(blank=True, null=True)
    word_nouns = models.CharField(max_length=2000, blank=True, null=True)
    country = models.CharField(max_length=10)

    class Meta:
        managed = False
        db_table = 'crawling_word'
        unique_together = (('created_at', 'country'),)


class MaterialInfo(models.Model):
    id = models.BigAutoField(primary_key=True)
    supplier_comp = models.ForeignKey('UserCompany', models.DO_NOTHING)
    item_name = models.CharField(max_length=100)
    material_pic = models.CharField(max_length=255, blank=True, null=True)
    type = models.CharField(max_length=20)
    cm_material_type = models.ForeignKey(CommonMaterialType, models.DO_NOTHING)
    item_detail = models.CharField(max_length=200, blank=True, null=True)
    status = models.CharField(max_length=30, blank=True, null=True)
    del_flag = models.CharField(max_length=2, blank=True, null=True)
    comp = models.ForeignKey('UserCompany', models.DO_NOTHING)
    dept = models.ForeignKey('UserDepartment', models.DO_NOTHING)
    user = models.ForeignKey('UserInfo', models.DO_NOTHING)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField(blank=True, null=True)
    structure = models.CharField(max_length=20, blank=True, null=True)
    yarn_size_wrap = models.CharField(max_length=20, blank=True, null=True)
    yarn_size_weft = models.CharField(max_length=20, blank=True, null=True)
    construction_epi = models.SmallIntegerField(blank=True, null=True)
    construction_ppi = models.SmallIntegerField(blank=True, null=True)
    shrinkage_plus = models.DecimalField(max_digits=4, decimal_places=1, blank=True, null=True)
    shrinkage_minus = models.DecimalField(max_digits=4, decimal_places=1, blank=True, null=True)
    parent_material_info = models.BigIntegerField(blank=True, null=True)
    usage_type = models.CharField(max_length=255, blank=True, null=True)
    sus_eco = models.CharField(max_length=255, blank=True, null=True)
    application = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'material_info'


class MaterialOffer(models.Model):
    id = models.BigAutoField(primary_key=True)
    recipient_comp = models.ForeignKey('UserCompany', models.DO_NOTHING, blank=True, null=True)
    material_info = models.ForeignKey(MaterialInfo, models.DO_NOTHING)
    unit_price = models.DecimalField(max_digits=15, decimal_places=5, blank=True, null=True)
    mcq_quantity = models.IntegerField(blank=True, null=True)
    moq_quantity = models.IntegerField(blank=True, null=True)
    common_uom = models.ForeignKey(CommonBasicInfo, models.DO_NOTHING, blank=True, null=True)
    common_currency = models.ForeignKey(CommonBasicInfo, models.DO_NOTHING)
    vendor_brand = models.ForeignKey('UserCompany', models.DO_NOTHING, blank=True, null=True)
    buyer_comp = models.ForeignKey('UserCompany', models.DO_NOTHING, blank=True, null=True)
    del_flag = models.CharField(max_length=2, blank=True, null=True)
    deputy_comp = models.ForeignKey('UserCompany', models.DO_NOTHING)
    deputy_dept = models.ForeignKey('UserDepartment', models.DO_NOTHING)
    deputy_user = models.ForeignKey('UserInfo', models.DO_NOTHING)
    comp = models.ForeignKey('UserCompany', models.DO_NOTHING)
    dept = models.ForeignKey('UserDepartment', models.DO_NOTHING)
    user = models.ForeignKey('UserInfo', models.DO_NOTHING, blank=True, null=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField(blank=True, null=True)
    my_millarticle = models.CharField(max_length=20, blank=True, null=True)
    original_millarticle_id = models.BigIntegerField(blank=True, null=True)
    material_after_manufacturing_dyeing = models.CharField(max_length=100, blank=True, null=True)
    material_after_manufacturing_fashion = models.CharField(max_length=100, blank=True, null=True)
    material_after_manufacturing_finishing = models.CharField(max_length=100, blank=True, null=True)
    fabric_weight = models.DecimalField(max_digits=15, decimal_places=2, blank=True, null=True)
    common_fabric_weight_uom = models.ForeignKey(CommonBasicInfo, models.DO_NOTHING, blank=True, null=True)
    fabric_cw = models.IntegerField(blank=True, null=True)
    common_fabric_cw_uom = models.ForeignKey(CommonBasicInfo, models.DO_NOTHING, blank=True, null=True)
    size = models.CharField(max_length=10, blank=True, null=True)
    common_subsidiary_size_uom = models.ForeignKey(CommonBasicInfo, models.DO_NOTHING, blank=True, null=True)
    characteristic = models.CharField(max_length=255, blank=True, null=True)
    solid_pattern = models.CharField(max_length=255, blank=True, null=True)
    function = models.CharField(max_length=255, blank=True, null=True)
    performance = models.CharField(max_length=255, blank=True, null=True)
    stretch = models.CharField(max_length=255, blank=True, null=True)
    lead_time = models.CharField(max_length=100, blank=True, null=True)
    season_year = models.IntegerField(blank=True, null=True)
    comp_season_id = models.BigIntegerField(blank=True, null=True)
    fabric_fw = models.IntegerField(blank=True, null=True)
    common_fabric_full_weight_uom_id = models.BigIntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'material_offer'


class MaterialYarn(models.Model):
    id = models.BigAutoField(primary_key=True)
    material_info = models.ForeignKey(MaterialInfo, models.DO_NOTHING)
    common_material_yarn = models.ForeignKey(CommonBasicInfo, models.DO_NOTHING)
    used = models.DecimalField(max_digits=5, decimal_places=2)
    del_flag = models.CharField(max_length=2, blank=True, null=True)
    deputy_comp = models.ForeignKey('UserCompany', models.DO_NOTHING)
    deputy_dept = models.ForeignKey('UserDepartment', models.DO_NOTHING)
    deputy_user = models.ForeignKey('UserInfo', models.DO_NOTHING)
    comp = models.ForeignKey('UserCompany', models.DO_NOTHING)
    dept = models.ForeignKey('UserDepartment', models.DO_NOTHING)
    user = models.ForeignKey('UserInfo', models.DO_NOTHING, blank=True, null=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'material_yarn'


class MclCbdAssign(models.Model):
    id = models.BigAutoField(primary_key=True)
    mcl_option = models.ForeignKey('MclOption', models.DO_NOTHING)
    cbd_option = models.ForeignKey(CbdOption, models.DO_NOTHING)
    fabric_check = models.IntegerField()
    trims_check = models.IntegerField()
    accessories_check = models.IntegerField()
    final_cost = models.DecimalField(max_digits=15, decimal_places=2, blank=True, null=True)
    comp = models.ForeignKey('UserCompany', models.DO_NOTHING)
    dept = models.ForeignKey('UserDepartment', models.DO_NOTHING)
    user = models.ForeignKey('UserInfo', models.DO_NOTHING)
    del_flag = models.CharField(max_length=2, blank=True, null=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'mcl_cbd_assign'


class MclComment(models.Model):
    id = models.BigAutoField(primary_key=True)
    mcl_option = models.ForeignKey('MclOption', models.DO_NOTHING)
    remark = models.CharField(max_length=255, blank=True, null=True)
    comp = models.ForeignKey('UserCompany', models.DO_NOTHING)
    dept = models.ForeignKey('UserDepartment', models.DO_NOTHING)
    user = models.ForeignKey('UserInfo', models.DO_NOTHING)
    del_flag = models.CharField(max_length=2, blank=True, null=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'mcl_comment'


class MclCover(models.Model):
    id = models.BigAutoField(primary_key=True)
    cbd_cover = models.ForeignKey(CbdCover, models.DO_NOTHING)
    comp = models.ForeignKey('UserCompany', models.DO_NOTHING)
    dept = models.ForeignKey('UserDepartment', models.DO_NOTHING)
    user = models.ForeignKey('UserInfo', models.DO_NOTHING)
    del_flag = models.CharField(max_length=2, blank=True, null=True)
    status = models.CharField(max_length=30, blank=True, null=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'mcl_cover'


class MclFactoryAlloc(models.Model):
    id = models.BigAutoField(primary_key=True)
    created_at = models.DateTimeField(blank=True, null=True)
    del_flag = models.CharField(max_length=2, blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)
    po_total_quantity = models.IntegerField(blank=True, null=True)
    comp = models.ForeignKey('UserCompany', models.DO_NOTHING)
    dept = models.ForeignKey('UserDepartment', models.DO_NOTHING)
    user = models.ForeignKey('UserInfo', models.DO_NOTHING)
    common_material_product = models.ForeignKey(CommonBasicInfo, models.DO_NOTHING)
    factory_comp = models.ForeignKey('UserCompany', models.DO_NOTHING)
    mcl_option = models.ForeignKey('MclOption', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'mcl_factory_alloc'


class MclGarmentColor(models.Model):
    id = models.BigAutoField(primary_key=True)
    mcl_option = models.ForeignKey('MclOption', models.DO_NOTHING)
    garment_color = models.CharField(max_length=100, blank=True, null=True)
    po_garment_color = models.CharField(max_length=100, blank=True, null=True)
    comp = models.ForeignKey('UserCompany', models.DO_NOTHING)
    dept = models.ForeignKey('UserDepartment', models.DO_NOTHING)
    user = models.ForeignKey('UserInfo', models.DO_NOTHING)
    del_flag = models.CharField(max_length=2, blank=True, null=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'mcl_garment_color'


class MclGarmentMarket(models.Model):
    id = models.BigAutoField(primary_key=True)
    mcl_option = models.ForeignKey('MclOption', models.DO_NOTHING)
    common_basic_country = models.ForeignKey(CommonBasicInfo, models.DO_NOTHING, blank=True, null=True)
    comp_market = models.ForeignKey(CompGarmentMarket, models.DO_NOTHING, blank=True, null=True)
    po_garment_market = models.CharField(max_length=100, blank=True, null=True)
    comp = models.ForeignKey('UserCompany', models.DO_NOTHING)
    dept = models.ForeignKey('UserDepartment', models.DO_NOTHING)
    user = models.ForeignKey('UserInfo', models.DO_NOTHING)
    del_flag = models.CharField(max_length=2, blank=True, null=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'mcl_garment_market'


class MclGarmentSize(models.Model):
    id = models.BigAutoField(primary_key=True)
    mcl_option = models.ForeignKey('MclOption', models.DO_NOTHING)
    cm_garment_size_info = models.ForeignKey(CommonBasicInfo, models.DO_NOTHING, blank=True, null=True)
    po_garment_size = models.CharField(max_length=10, blank=True, null=True)
    comp = models.ForeignKey('UserCompany', models.DO_NOTHING)
    dept = models.ForeignKey('UserDepartment', models.DO_NOTHING)
    user = models.ForeignKey('UserInfo', models.DO_NOTHING)
    del_flag = models.CharField(max_length=2, blank=True, null=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'mcl_garment_size'


class MclMaterialAdhocPurchaseOrderItemPublish(models.Model):
    id = models.BigAutoField(primary_key=True)
    mcl_material_adhoc_purchase_order = models.ForeignKey('MclMaterialAdhocPurchaseOrderPublish', models.DO_NOTHING)
    cm_material_type = models.ForeignKey(CommonMaterialType, models.DO_NOTHING)
    material_info = models.ForeignKey(MaterialInfo, models.DO_NOTHING)
    mcl_material_fabric_color_name = models.CharField(max_length=100, blank=True, null=True)
    cm_actual_color = models.ForeignKey(CommonBasicInfo, models.DO_NOTHING, blank=True, null=True)
    mcl_material_active_color_name = models.CharField(max_length=100, blank=True, null=True)
    material_type = models.CharField(max_length=20)
    net_yy = models.DecimalField(max_digits=6, decimal_places=3, blank=True, null=True)
    plus_tolerance = models.IntegerField(blank=True, null=True)
    minus_tolerance = models.IntegerField(blank=True, null=True)
    unit_price = models.DecimalField(max_digits=15, decimal_places=5, blank=True, null=True)
    ordered_qty = models.IntegerField(blank=True, null=True)
    ordered_cm_uom = models.ForeignKey(CommonBasicInfo, models.DO_NOTHING, blank=True, null=True)
    cm_ordered_qty_adj_uom = models.ForeignKey(CommonBasicInfo, models.DO_NOTHING)
    comp_order_type = models.ForeignKey(CompOrderType, models.DO_NOTHING, blank=True, null=True)
    status = models.CharField(max_length=30, blank=True, null=True)
    comp = models.ForeignKey('UserCompany', models.DO_NOTHING)
    dept = models.ForeignKey('UserDepartment', models.DO_NOTHING)
    user = models.ForeignKey('UserInfo', models.DO_NOTHING, blank=True, null=True)
    del_flag = models.CharField(max_length=2, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)
    material_offer = models.ForeignKey(MaterialOffer, models.DO_NOTHING, blank=True, null=True)
    comp_usage = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'mcl_material_adhoc_purchase_order_item_publish'


class MclMaterialAdhocPurchaseOrderPublish(models.Model):
    id = models.BigAutoField(primary_key=True)
    material_purchase_order_number = models.CharField(max_length=100)
    material_purchase_comp = models.ForeignKey('UserCompany', models.DO_NOTHING, blank=True, null=True)
    material_purchase_comp_addr = models.ForeignKey('UserCompanyAddress', models.DO_NOTHING, blank=True, null=True)
    material_selling_comp = models.ForeignKey('UserCompany', models.DO_NOTHING, blank=True, null=True)
    material_selling_comp_addr = models.ForeignKey('UserCompanyAddress', models.DO_NOTHING, blank=True, null=True)
    consignee_comp = models.ForeignKey('UserCompany', models.DO_NOTHING, blank=True, null=True)
    consignee_comp_addr = models.ForeignKey('UserCompanyAddress', models.DO_NOTHING, blank=True, null=True)
    shipper_comp = models.ForeignKey('UserCompany', models.DO_NOTHING, blank=True, null=True)
    shipper_comp_addr = models.ForeignKey('UserCompanyAddress', models.DO_NOTHING, blank=True, null=True)
    cm_incoterms_info = models.ForeignKey(CommonBasicInfo, models.DO_NOTHING, blank=True, null=True)
    transhipment_allow = models.IntegerField(blank=True, null=True)
    cm_material_shipping_method = models.ForeignKey(CommonBasicInfo, models.DO_NOTHING, blank=True, null=True)
    partial_shipment = models.IntegerField(blank=True, null=True)
    cm_material_payment_term = models.ForeignKey(CommonBasicInfo, models.DO_NOTHING, blank=True, null=True)
    cm_payment_base = models.ForeignKey(CommonBasicInfo, models.DO_NOTHING, blank=True, null=True)
    cm_payment_period = models.ForeignKey(CommonBasicInfo, models.DO_NOTHING, blank=True, null=True)
    plus_tolerance = models.IntegerField(blank=True, null=True)
    minus_tolerance = models.IntegerField(blank=True, null=True)
    cm_loading_basic_country = models.ForeignKey(CommonBasicInfo, models.DO_NOTHING, blank=True, null=True)
    cm_loading_port_info = models.ForeignKey(CommonBasicInfo, models.DO_NOTHING, blank=True, null=True)
    cm_discharge_basic_country = models.ForeignKey(CommonBasicInfo, models.DO_NOTHING, blank=True, null=True)
    cm_discharge_port_info = models.ForeignKey(CommonBasicInfo, models.DO_NOTHING, blank=True, null=True)
    estimated_date = models.DateTimeField(blank=True, null=True)
    infactory_date = models.DateTimeField(blank=True, null=True)
    forwarder_comp = models.ForeignKey('UserCompany', models.DO_NOTHING, blank=True, null=True)
    forwarder_comp_addr = models.ForeignKey('UserCompanyAddress', models.DO_NOTHING, blank=True, null=True)
    memo = models.TextField(blank=True, null=True)
    cm_currency = models.ForeignKey(CommonBasicInfo, models.DO_NOTHING, blank=True, null=True)
    status = models.CharField(max_length=30, blank=True, null=True)
    comp = models.ForeignKey('UserCompany', models.DO_NOTHING)
    dept = models.ForeignKey('UserDepartment', models.DO_NOTHING)
    user = models.ForeignKey('UserInfo', models.DO_NOTHING, blank=True, null=True)
    user_name = models.CharField(max_length=100, blank=True, null=True)
    del_flag = models.CharField(max_length=2, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)
    comp_biz_relation = models.ForeignKey('UserCompany', models.DO_NOTHING, blank=True, null=True)
    material_terms = models.TextField(blank=True, null=True)
    comp_biz_relation_addr = models.ForeignKey('UserCompanyAddress', models.DO_NOTHING, blank=True, null=True)
    ex_mill = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'mcl_material_adhoc_purchase_order_publish'


class MclMaterialDependencyColor(models.Model):
    id = models.BigAutoField(primary_key=True)
    mcl_option = models.ForeignKey('MclOption', models.DO_NOTHING)
    cbd_option = models.ForeignKey(CbdOption, models.DO_NOTHING, blank=True, null=True)
    material_type = models.CharField(max_length=20)
    garment_color = models.ForeignKey(MclGarmentColor, models.DO_NOTHING)
    mcl_material_info = models.ForeignKey('MclMaterialInfo', models.DO_NOTHING)
    comp = models.ForeignKey('UserCompany', models.DO_NOTHING)
    dept = models.ForeignKey('UserDepartment', models.DO_NOTHING)
    user = models.ForeignKey('UserInfo', models.DO_NOTHING, blank=True, null=True)
    del_flag = models.CharField(max_length=2, blank=True, null=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'mcl_material_dependency_color'


class MclMaterialDependencyMarket(models.Model):
    id = models.BigAutoField(primary_key=True)
    mcl_option = models.ForeignKey('MclOption', models.DO_NOTHING)
    cbd_option = models.ForeignKey(CbdOption, models.DO_NOTHING, blank=True, null=True)
    material_type = models.CharField(max_length=20)
    garment_market = models.ForeignKey(MclGarmentMarket, models.DO_NOTHING)
    mcl_material_info = models.ForeignKey('MclMaterialInfo', models.DO_NOTHING)
    comp = models.ForeignKey('UserCompany', models.DO_NOTHING)
    dept = models.ForeignKey('UserDepartment', models.DO_NOTHING)
    user = models.ForeignKey('UserInfo', models.DO_NOTHING, blank=True, null=True)
    del_flag = models.CharField(max_length=2, blank=True, null=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'mcl_material_dependency_market'


class MclMaterialDependencySize(models.Model):
    id = models.BigAutoField(primary_key=True)
    mcl_option = models.ForeignKey('MclOption', models.DO_NOTHING)
    cbd_option = models.ForeignKey(CbdOption, models.DO_NOTHING, blank=True, null=True)
    material_type = models.CharField(max_length=20)
    garment_size = models.ForeignKey(MclGarmentSize, models.DO_NOTHING)
    mcl_material_info = models.ForeignKey('MclMaterialInfo', models.DO_NOTHING)
    comp = models.ForeignKey('UserCompany', models.DO_NOTHING)
    dept = models.ForeignKey('UserDepartment', models.DO_NOTHING)
    user = models.ForeignKey('UserInfo', models.DO_NOTHING, blank=True, null=True)
    del_flag = models.CharField(max_length=2, blank=True, null=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'mcl_material_dependency_size'


class MclMaterialInfo(models.Model):
    id = models.BigAutoField(primary_key=True)
    mcl_option = models.ForeignKey('MclOption', models.DO_NOTHING)
    cbd_material_info = models.ForeignKey(CbdMaterialInfo, models.DO_NOTHING, blank=True, null=True)
    material_info = models.ForeignKey(MaterialInfo, models.DO_NOTHING)
    type = models.CharField(max_length=20)
    color_dependency = models.CharField(max_length=20, blank=True, null=True)
    size_dependency = models.CharField(max_length=20, blank=True, null=True)
    market_dependency = models.CharField(max_length=20, blank=True, null=True)
    supplier_material = models.CharField(max_length=20, blank=True, null=True)
    net_yy = models.DecimalField(max_digits=6, decimal_places=3, blank=True, null=True)
    tolerance = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    mcl_material_uom = models.ForeignKey(CommonBasicInfo, models.DO_NOTHING, blank=True, null=True)
    fabric_color_name = models.CharField(max_length=100, blank=True, null=True)
    cm_actual_color = models.ForeignKey(CommonBasicInfo, models.DO_NOTHING, blank=True, null=True)
    subsidiary_detail = models.CharField(max_length=200, blank=True, null=True)
    status = models.CharField(max_length=30, blank=True, null=True)
    comp = models.ForeignKey('UserCompany', models.DO_NOTHING)
    dept = models.ForeignKey('UserDepartment', models.DO_NOTHING)
    user = models.ForeignKey('UserInfo', models.DO_NOTHING)
    del_flag = models.CharField(max_length=2, blank=True, null=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField(blank=True, null=True)
    required_qty = models.IntegerField(blank=True, null=True)
    supplier_comp = models.ForeignKey('UserCompany', models.DO_NOTHING, blank=True, null=True)
    buyer_comp = models.ForeignKey('UserCompany', models.DO_NOTHING, blank=True, null=True)
    factory_comp = models.ForeignKey('UserCompany', models.DO_NOTHING, blank=True, null=True)
    size_memo = models.CharField(max_length=1000, blank=True, null=True)
    material_offer = models.ForeignKey(MaterialOffer, models.DO_NOTHING, blank=True, null=True)
    comp_usage = models.CharField(max_length=100, blank=True, null=True)
    unit_price = models.DecimalField(max_digits=15, decimal_places=5, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'mcl_material_info'


class MclMaterialPurchaseOrder(models.Model):
    id = models.BigAutoField(primary_key=True)
    cbd_cover = models.ForeignKey(CbdCover, models.DO_NOTHING, blank=True, null=True)
    mcl_option = models.ForeignKey('MclOption', models.DO_NOTHING, blank=True, null=True)
    material_purchase_order_number = models.CharField(max_length=100)
    material_fabric_po_url = models.CharField(max_length=2000, blank=True, null=True)
    material_purchase_comp = models.ForeignKey('UserCompany', models.DO_NOTHING, blank=True, null=True)
    material_purchase_comp_addr = models.ForeignKey('UserCompanyAddress', models.DO_NOTHING, blank=True, null=True)
    material_selling_comp = models.ForeignKey('UserCompany', models.DO_NOTHING, blank=True, null=True)
    material_selling_comp_addr = models.ForeignKey('UserCompanyAddress', models.DO_NOTHING, blank=True, null=True)
    consignee_comp = models.ForeignKey('UserCompany', models.DO_NOTHING, blank=True, null=True)
    consignee_comp_addr = models.ForeignKey('UserCompanyAddress', models.DO_NOTHING, blank=True, null=True)
    shipper_comp = models.ForeignKey('UserCompany', models.DO_NOTHING, blank=True, null=True)
    shipper_comp_addr = models.ForeignKey('UserCompanyAddress', models.DO_NOTHING, blank=True, null=True)
    cm_incoterms_info = models.ForeignKey(CommonBasicInfo, models.DO_NOTHING, blank=True, null=True)
    partial_shipment = models.IntegerField(blank=True, null=True)
    cm_material_shipping_method = models.ForeignKey(CommonBasicInfo, models.DO_NOTHING, blank=True, null=True)
    cm_material_payment_term = models.ForeignKey(CommonBasicInfo, models.DO_NOTHING, blank=True, null=True)
    cm_payment_base = models.ForeignKey(CommonBasicInfo, models.DO_NOTHING, blank=True, null=True)
    cm_payment_period = models.ForeignKey(CommonBasicInfo, models.DO_NOTHING, blank=True, null=True)
    cm_loading_basic_country = models.ForeignKey(CommonBasicInfo, models.DO_NOTHING, blank=True, null=True)
    cm_loading_port_info = models.ForeignKey(CommonBasicInfo, models.DO_NOTHING, blank=True, null=True)
    cm_discharge_basic_country = models.ForeignKey(CommonBasicInfo, models.DO_NOTHING, blank=True, null=True)
    cm_discharge_port_info = models.ForeignKey(CommonBasicInfo, models.DO_NOTHING, blank=True, null=True)
    forwarder_comp = models.ForeignKey('UserCompany', models.DO_NOTHING, blank=True, null=True)
    forwarder_comp_addr = models.ForeignKey('UserCompanyAddress', models.DO_NOTHING, blank=True, null=True)
    comp_terms = models.ForeignKey(CompTerms, models.DO_NOTHING, blank=True, null=True)
    plus_tolerance = models.IntegerField(blank=True, null=True)
    minus_tolerance = models.IntegerField(blank=True, null=True)
    estimated_date = models.DateTimeField(blank=True, null=True)
    infactory_date = models.DateTimeField(blank=True, null=True)
    cm_currency = models.ForeignKey(CommonBasicInfo, models.DO_NOTHING, blank=True, null=True)
    exchange_rate = models.DecimalField(max_digits=15, decimal_places=2, blank=True, null=True)
    memo = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=30, blank=True, null=True)
    comp = models.ForeignKey('UserCompany', models.DO_NOTHING)
    dept = models.ForeignKey('UserDepartment', models.DO_NOTHING)
    user = models.ForeignKey('UserInfo', models.DO_NOTHING, blank=True, null=True)
    user_name = models.CharField(max_length=100, blank=True, null=True)
    del_flag = models.CharField(max_length=2, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)
    comp_biz_relation = models.ForeignKey('UserCompany', models.DO_NOTHING, blank=True, null=True)
    comp_biz_relation_addr = models.ForeignKey('UserCompanyAddress', models.DO_NOTHING, blank=True, null=True)
    ex_mill = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'mcl_material_purchase_order'


class MclMaterialPurchaseOrderDependencyItem(models.Model):
    id = models.BigAutoField(primary_key=True)
    cbd_option = models.ForeignKey(CbdOption, models.DO_NOTHING, blank=True, null=True)
    mcl_material_purchase_order_item = models.ForeignKey('MclMaterialPurchaseOrderItem', models.DO_NOTHING)
    mcl_material_info = models.ForeignKey(MclMaterialInfo, models.DO_NOTHING)
    mcl_material_type = models.CharField(max_length=20, blank=True, null=True)
    mcl_garment_color = models.ForeignKey(MclGarmentColor, models.DO_NOTHING, blank=True, null=True)
    mcl_garment_size = models.ForeignKey(MclGarmentSize, models.DO_NOTHING, blank=True, null=True)
    mcl_garment_market = models.ForeignKey(MclGarmentMarket, models.DO_NOTHING, blank=True, null=True)
    ordered_qty = models.IntegerField(blank=True, null=True)
    ordered_cm_uom = models.ForeignKey(CommonBasicInfo, models.DO_NOTHING, blank=True, null=True)
    del_flag = models.CharField(max_length=2, blank=True, null=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'mcl_material_purchase_order_dependency_item'


class MclMaterialPurchaseOrderDependencyItemPublish(models.Model):
    id = models.BigAutoField(primary_key=True)
    cbd_option = models.ForeignKey(CbdOption, models.DO_NOTHING, blank=True, null=True)
    mcl_material_purchase_order_item = models.ForeignKey('MclMaterialPurchaseOrderItem', models.DO_NOTHING)
    mcl_material_info = models.ForeignKey(MclMaterialInfo, models.DO_NOTHING)
    mcl_material_type = models.CharField(max_length=20, blank=True, null=True)
    mcl_garment_color = models.ForeignKey(MclGarmentColor, models.DO_NOTHING, blank=True, null=True)
    mcl_garment_size = models.ForeignKey(MclGarmentSize, models.DO_NOTHING, blank=True, null=True)
    mcl_garment_market = models.ForeignKey(MclGarmentMarket, models.DO_NOTHING, blank=True, null=True)
    ordered_qty = models.IntegerField(blank=True, null=True)
    ordered_cm_uom = models.ForeignKey(CommonBasicInfo, models.DO_NOTHING, blank=True, null=True)
    del_flag = models.CharField(max_length=2, blank=True, null=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'mcl_material_purchase_order_dependency_item_publish'


class MclMaterialPurchaseOrderItem(models.Model):
    id = models.BigAutoField(primary_key=True)
    mcl_material_purchase_order = models.ForeignKey(MclMaterialPurchaseOrder, models.DO_NOTHING)
    cm_material_type = models.ForeignKey(CommonMaterialType, models.DO_NOTHING)
    mcl_material_info = models.ForeignKey(MclMaterialInfo, models.DO_NOTHING, blank=True, null=True)
    material_type = models.CharField(max_length=20)
    unit_price = models.DecimalField(max_digits=15, decimal_places=5, blank=True, null=True)
    cm_ordered_qty_uom = models.ForeignKey(CommonBasicInfo, models.DO_NOTHING)
    cm_ordered_qty_adj_uom = models.ForeignKey(CommonBasicInfo, models.DO_NOTHING)
    comp_order_type = models.ForeignKey(CompOrderType, models.DO_NOTHING, blank=True, null=True)
    purchase_qty = models.IntegerField()
    pre_production_qty = models.IntegerField(blank=True, null=True)
    pre_production_uom = models.ForeignKey(CommonBasicInfo, models.DO_NOTHING, blank=True, null=True)
    pre_production_unit_price = models.DecimalField(max_digits=15, decimal_places=2, blank=True, null=True)
    pre_production_cm_order_type = models.ForeignKey(CommonBasicInfo, models.DO_NOTHING, blank=True, null=True)
    advertisement_qty = models.IntegerField(blank=True, null=True)
    advertisement_uom = models.ForeignKey(CommonBasicInfo, models.DO_NOTHING, blank=True, null=True)
    advertisement_unit_price = models.DecimalField(max_digits=15, decimal_places=2, blank=True, null=True)
    advertisement_cm_order_type = models.ForeignKey(CommonBasicInfo, models.DO_NOTHING, blank=True, null=True)
    status = models.CharField(max_length=30, blank=True, null=True)
    comp = models.ForeignKey('UserCompany', models.DO_NOTHING)
    dept = models.ForeignKey('UserDepartment', models.DO_NOTHING)
    user = models.ForeignKey('UserInfo', models.DO_NOTHING, blank=True, null=True)
    del_flag = models.CharField(max_length=2, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)
    issued_qty = models.IntegerField(blank=True, null=True)
    material_offer = models.ForeignKey(MaterialOffer, models.DO_NOTHING, blank=True, null=True)
    from_to_uom = models.DecimalField(max_digits=10, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'mcl_material_purchase_order_item'


class MclMaterialPurchaseOrderItemPublish(models.Model):
    id = models.BigAutoField(primary_key=True)
    mcl_material_purchase_order = models.ForeignKey(MclMaterialPurchaseOrder, models.DO_NOTHING)
    cm_material_type = models.ForeignKey(CommonMaterialType, models.DO_NOTHING)
    mcl_material_info = models.ForeignKey(MclMaterialInfo, models.DO_NOTHING, blank=True, null=True)
    mcl_material_fabric_color_name = models.CharField(max_length=100, blank=True, null=True)
    cm_actual_color = models.ForeignKey(CommonBasicInfo, models.DO_NOTHING, blank=True, null=True)
    mcl_material_active_color_name = models.CharField(max_length=100, blank=True, null=True)
    material_type = models.CharField(max_length=20)
    purchase_qty = models.IntegerField()
    net_yy = models.DecimalField(max_digits=6, decimal_places=3, blank=True, null=True)
    plus_tolerance = models.IntegerField(blank=True, null=True)
    minus_tolerance = models.IntegerField(blank=True, null=True)
    unit_price = models.DecimalField(max_digits=15, decimal_places=5, blank=True, null=True)
    cm_ordered_qty_uom = models.ForeignKey(CommonBasicInfo, models.DO_NOTHING)
    cm_ordered_qty_adj_uom = models.ForeignKey(CommonBasicInfo, models.DO_NOTHING)
    comp_order_type = models.ForeignKey(CompOrderType, models.DO_NOTHING, blank=True, null=True)
    pre_production_qty = models.IntegerField(blank=True, null=True)
    pre_production_uom = models.ForeignKey(CommonBasicInfo, models.DO_NOTHING, blank=True, null=True)
    pre_production_unit_price = models.DecimalField(max_digits=15, decimal_places=2, blank=True, null=True)
    pre_production_cm_order_type = models.ForeignKey(CommonBasicInfo, models.DO_NOTHING, blank=True, null=True)
    advertisement_qty = models.IntegerField(blank=True, null=True)
    advertisement_uom = models.ForeignKey(CommonBasicInfo, models.DO_NOTHING, blank=True, null=True)
    advertisement_unit_price = models.DecimalField(max_digits=15, decimal_places=2, blank=True, null=True)
    advertisement_cm_order_type = models.ForeignKey(CommonBasicInfo, models.DO_NOTHING, blank=True, null=True)
    status = models.CharField(max_length=30, blank=True, null=True)
    comp = models.ForeignKey('UserCompany', models.DO_NOTHING)
    dept = models.ForeignKey('UserDepartment', models.DO_NOTHING)
    user = models.ForeignKey('UserInfo', models.DO_NOTHING, blank=True, null=True)
    del_flag = models.CharField(max_length=2, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)
    issued_qty = models.IntegerField(blank=True, null=True)
    material_offer = models.ForeignKey(MaterialOffer, models.DO_NOTHING, blank=True, null=True)
    from_to_uom = models.DecimalField(max_digits=10, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'mcl_material_purchase_order_item_publish'


class MclMaterialPurchaseOrderOption(models.Model):
    id = models.BigAutoField(primary_key=True)
    mcl_material_purchase_order = models.ForeignKey(MclMaterialPurchaseOrder, models.DO_NOTHING, blank=True, null=True)
    option_name = models.CharField(max_length=30, blank=True, null=True)
    option_type = models.CharField(max_length=20, blank=True, null=True)
    option_value = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    comp = models.ForeignKey('UserCompany', models.DO_NOTHING)
    dept = models.ForeignKey('UserDepartment', models.DO_NOTHING)
    user = models.ForeignKey('UserInfo', models.DO_NOTHING, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'mcl_material_purchase_order_option'


class MclMaterialPurchaseOrderOptionPublish(models.Model):
    id = models.BigAutoField(primary_key=True)
    mcl_material_purchase_order = models.ForeignKey('MclMaterialPurchaseOrderPublish', models.DO_NOTHING, blank=True, null=True)
    option_name = models.CharField(max_length=30, blank=True, null=True)
    option_type = models.CharField(max_length=20, blank=True, null=True)
    option_value = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    comp = models.ForeignKey('UserCompany', models.DO_NOTHING)
    dept = models.ForeignKey('UserDepartment', models.DO_NOTHING)
    user = models.ForeignKey('UserInfo', models.DO_NOTHING, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'mcl_material_purchase_order_option_publish'


class MclMaterialPurchaseOrderPublish(models.Model):
    id = models.BigAutoField(primary_key=True)
    mcl_material_purchase_order = models.ForeignKey(MclMaterialPurchaseOrder, models.DO_NOTHING)
    po_url = models.CharField(max_length=2000, blank=True, null=True)
    cbd_cover = models.ForeignKey(CbdCover, models.DO_NOTHING, blank=True, null=True)
    mcl_option = models.ForeignKey('MclOption', models.DO_NOTHING, blank=True, null=True)
    cbd_buyer_name = models.CharField(max_length=100, blank=True, null=True)
    cbd_brand_name = models.CharField(max_length=100, blank=True, null=True)
    cbd_season_name = models.CharField(max_length=100, blank=True, null=True)
    material_purchase_order_number = models.CharField(max_length=100)
    material_fabric_po_url = models.CharField(max_length=2000, blank=True, null=True)
    material_purchase_comp = models.ForeignKey('UserCompany', models.DO_NOTHING, blank=True, null=True)
    material_purchase_comp_name = models.CharField(max_length=100, blank=True, null=True)
    material_purchase_comp_addr = models.ForeignKey('UserCompanyAddress', models.DO_NOTHING, blank=True, null=True)
    material_selling_comp = models.ForeignKey('UserCompany', models.DO_NOTHING, blank=True, null=True)
    material_selling_comp_addr = models.ForeignKey('UserCompanyAddress', models.DO_NOTHING, blank=True, null=True)
    consignee_comp = models.ForeignKey('UserCompany', models.DO_NOTHING, blank=True, null=True)
    consignee_comp_addr = models.ForeignKey('UserCompanyAddress', models.DO_NOTHING, blank=True, null=True)
    shipper_comp = models.ForeignKey('UserCompany', models.DO_NOTHING, blank=True, null=True)
    shipper_comp_addr = models.ForeignKey('UserCompanyAddress', models.DO_NOTHING, blank=True, null=True)
    partial_shipment = models.IntegerField(blank=True, null=True)
    cm_incoterms_info = models.ForeignKey(CommonBasicInfo, models.DO_NOTHING, blank=True, null=True)
    cm_material_shipping_method = models.ForeignKey(CommonBasicInfo, models.DO_NOTHING, blank=True, null=True)
    cm_material_payment_term = models.ForeignKey(CommonBasicInfo, models.DO_NOTHING, blank=True, null=True)
    cm_payment_base = models.ForeignKey(CommonBasicInfo, models.DO_NOTHING, blank=True, null=True)
    cm_payment_period = models.ForeignKey(CommonBasicInfo, models.DO_NOTHING, blank=True, null=True)
    cm_loading_basic_country = models.ForeignKey(CommonBasicInfo, models.DO_NOTHING, blank=True, null=True)
    cm_loading_port_info = models.ForeignKey(CommonBasicInfo, models.DO_NOTHING, blank=True, null=True)
    cm_discharge_basic_country = models.ForeignKey(CommonBasicInfo, models.DO_NOTHING, blank=True, null=True)
    cm_discharge_port_info = models.ForeignKey(CommonBasicInfo, models.DO_NOTHING, blank=True, null=True)
    forwarder_comp = models.ForeignKey('UserCompany', models.DO_NOTHING, blank=True, null=True)
    forwarder_comp_addr = models.ForeignKey('UserCompanyAddress', models.DO_NOTHING, blank=True, null=True)
    plus_tolerance = models.IntegerField(blank=True, null=True)
    minus_tolerance = models.IntegerField(blank=True, null=True)
    estimated_date = models.DateTimeField(blank=True, null=True)
    infactory_date = models.DateTimeField(blank=True, null=True)
    cm_currency = models.ForeignKey(CommonBasicInfo, models.DO_NOTHING, blank=True, null=True)
    exchange_rate = models.DecimalField(max_digits=15, decimal_places=2, blank=True, null=True)
    status = models.CharField(max_length=30, blank=True, null=True)
    comp = models.ForeignKey('UserCompany', models.DO_NOTHING)
    dept = models.ForeignKey('UserDepartment', models.DO_NOTHING)
    user = models.ForeignKey('UserInfo', models.DO_NOTHING, blank=True, null=True)
    user_name = models.CharField(max_length=100, blank=True, null=True)
    user_phone = models.CharField(max_length=100, blank=True, null=True)
    del_flag = models.CharField(max_length=2, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)
    comp_biz_relation = models.ForeignKey('UserCompany', models.DO_NOTHING, blank=True, null=True)
    material_terms = models.TextField(blank=True, null=True)
    comp_biz_relation_addr = models.ForeignKey('UserCompanyAddress', models.DO_NOTHING, blank=True, null=True)
    ex_mill = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'mcl_material_purchase_order_publish'


class MclMaterialPurchaseOrderStyle(models.Model):
    id = models.BigAutoField(primary_key=True)
    style_number = models.BigIntegerField()
    mcl_material_purchase_order_item = models.ForeignKey(MclMaterialPurchaseOrderItem, models.DO_NOTHING)
    comp = models.ForeignKey('UserCompany', models.DO_NOTHING)
    dept = models.ForeignKey('UserDepartment', models.DO_NOTHING)
    user = models.ForeignKey('UserInfo', models.DO_NOTHING, blank=True, null=True)
    del_flag = models.CharField(max_length=2, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'mcl_material_purchase_order_style'


class MclMaterialPurchaseOrderStylePublish(models.Model):
    id = models.BigAutoField(primary_key=True)
    style_number = models.BigIntegerField()
    mcl_material_purchase_order_item = models.ForeignKey(MclMaterialPurchaseOrderItem, models.DO_NOTHING)
    comp = models.ForeignKey('UserCompany', models.DO_NOTHING)
    dept = models.ForeignKey('UserDepartment', models.DO_NOTHING)
    user = models.ForeignKey('UserInfo', models.DO_NOTHING, blank=True, null=True)
    del_flag = models.CharField(max_length=2, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'mcl_material_purchase_order_style_publish'


class MclOption(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=100, blank=True, null=True)
    mcl_cover = models.ForeignKey(MclCover, models.DO_NOTHING)
    factory_comp = models.ForeignKey('UserCompany', models.DO_NOTHING)
    pcd_date = models.DateTimeField(blank=True, null=True)
    comp = models.ForeignKey('UserCompany', models.DO_NOTHING)
    dept = models.ForeignKey('UserDepartment', models.DO_NOTHING)
    user = models.ForeignKey('UserInfo', models.DO_NOTHING)
    status = models.CharField(max_length=30, blank=True, null=True)
    del_flag = models.CharField(max_length=2, blank=True, null=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'mcl_option'


class MclOrderQuantity(models.Model):
    id = models.BigAutoField(primary_key=True)
    mcl_option = models.ForeignKey(MclOption, models.DO_NOTHING)
    measured_quantity = models.IntegerField(blank=True, null=True)
    order_quantity = models.IntegerField(blank=True, null=True)
    mcl_garment_color = models.ForeignKey(MclGarmentColor, models.DO_NOTHING, blank=True, null=True)
    mcl_garment_market = models.ForeignKey(MclGarmentMarket, models.DO_NOTHING, blank=True, null=True)
    mcl_garment_size = models.ForeignKey(MclGarmentSize, models.DO_NOTHING, blank=True, null=True)
    comp = models.ForeignKey('UserCompany', models.DO_NOTHING)
    dept = models.ForeignKey('UserDepartment', models.DO_NOTHING)
    user = models.ForeignKey('UserInfo', models.DO_NOTHING)
    del_flag = models.CharField(max_length=2, blank=True, null=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'mcl_order_quantity'


class MclOrderQuantityOption(models.Model):
    id = models.BigAutoField(primary_key=True)
    mcl_order_quantity = models.ForeignKey(MclOrderQuantity, models.DO_NOTHING)
    register_option = models.IntegerField()
    increase_quantity_percent = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    comp = models.ForeignKey('UserCompany', models.DO_NOTHING)
    dept = models.ForeignKey('UserDepartment', models.DO_NOTHING)
    user = models.ForeignKey('UserInfo', models.DO_NOTHING)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'mcl_order_quantity_option'


class MclPreBooking(models.Model):
    id = models.BigAutoField(primary_key=True)
    mcl_option = models.ForeignKey(MclOption, models.DO_NOTHING)
    ship_date_from = models.DateTimeField()
    ship_date_to = models.DateTimeField()
    style_number = models.BigIntegerField()
    comp_program = models.ForeignKey(CompGarmentProgram, models.DO_NOTHING)
    cbd_option = models.ForeignKey(CbdOption, models.DO_NOTHING, blank=True, null=True)
    comp = models.ForeignKey('UserCompany', models.DO_NOTHING)
    dept = models.ForeignKey('UserDepartment', models.DO_NOTHING)
    user = models.ForeignKey('UserInfo', models.DO_NOTHING)
    del_flag = models.CharField(max_length=2, blank=True, null=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'mcl_pre_booking'


class MclPreBookingPo(models.Model):
    id = models.BigAutoField(primary_key=True)
    mcl_option = models.ForeignKey(MclOption, models.DO_NOTHING)
    mcl_pre_booking = models.ForeignKey(MclPreBooking, models.DO_NOTHING)
    buyer_product_order = models.ForeignKey(BuyerOrderInfo, models.DO_NOTHING)
    comp = models.ForeignKey('UserCompany', models.DO_NOTHING)
    dept = models.ForeignKey('UserDepartment', models.DO_NOTHING)
    user = models.ForeignKey('UserInfo', models.DO_NOTHING)
    del_flag = models.CharField(max_length=2, blank=True, null=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'mcl_pre_booking_po'
        unique_together = (('buyer_product_order', 'id'),)


class MclPreBookingPoItem(models.Model):
    id = models.BigAutoField(primary_key=True)
    mcl_pre_booking_po = models.ForeignKey(MclPreBookingPo, models.DO_NOTHING)
    buyer_product_order_item = models.ForeignKey(BuyerOrderItem, models.DO_NOTHING)
    comp = models.ForeignKey('UserCompany', models.DO_NOTHING)
    dept = models.ForeignKey('UserDepartment', models.DO_NOTHING)
    user = models.ForeignKey('UserInfo', models.DO_NOTHING)
    del_flag = models.CharField(max_length=2, blank=True, null=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'mcl_pre_booking_po_item'


class MenuBasicInfo(models.Model):
    id = models.BigAutoField(primary_key=True)
    menu_name = models.CharField(max_length=255, blank=True, null=True)
    custom = models.ForeignKey(CommonBasicInfo, models.DO_NOTHING, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'menu_basic_info'


class MenuPageInfo(models.Model):
    id = models.BigAutoField(primary_key=True)
    menu = models.ForeignKey(MenuBasicInfo, models.DO_NOTHING)
    m_menu = models.CharField(max_length=100, blank=True, null=True)
    s_menu = models.CharField(max_length=100, blank=True, null=True)
    idx = models.CharField(max_length=100)
    status = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'menu_page_info'
        unique_together = (('menu', 'm_menu', 's_menu'),)


class SupplierAdhocPoChecking(models.Model):
    id = models.BigAutoField(primary_key=True)
    mcl_material_adhoc_purchase_order_publish = models.ForeignKey(MclMaterialAdhocPurchaseOrderPublish, models.DO_NOTHING)
    po_confirm = models.IntegerField(blank=True, null=True)
    revert_memo = models.CharField(max_length=2000, blank=True, null=True)
    comp = models.ForeignKey('UserCompany', models.DO_NOTHING)
    dept = models.ForeignKey('UserDepartment', models.DO_NOTHING)
    user = models.ForeignKey('UserInfo', models.DO_NOTHING, blank=True, null=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'supplier_adhoc_po_checking'


class SupplierPoChecking(models.Model):
    id = models.BigAutoField(primary_key=True)
    mcl_material_purchase_order_publish = models.ForeignKey(MclMaterialPurchaseOrderPublish, models.DO_NOTHING)
    po_confirm = models.IntegerField(blank=True, null=True)
    revert_memo = models.CharField(max_length=2000, blank=True, null=True)
    comp = models.ForeignKey('UserCompany', models.DO_NOTHING)
    dept = models.ForeignKey('UserDepartment', models.DO_NOTHING)
    user = models.ForeignKey('UserInfo', models.DO_NOTHING, blank=True, null=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'supplier_po_checking'


class SupplierSample2021(models.Model):
    id = models.BigAutoField(primary_key=True)
    supplier = models.CharField(max_length=255, blank=True, null=True)
    shortname = models.CharField(db_column='shortName', max_length=255, blank=True, null=True)  # Field name made lowercase.
    email1 = models.CharField(max_length=255, blank=True, null=True)
    email2 = models.CharField(max_length=255, blank=True, null=True)
    email3 = models.CharField(max_length=255, blank=True, null=True)
    email4 = models.CharField(max_length=255, blank=True, null=True)
    email5 = models.CharField(max_length=255, blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=255, blank=True, null=True)
    state = models.CharField(max_length=255, blank=True, null=True)
    country = models.CharField(max_length=255, blank=True, null=True)
    postalcode = models.CharField(max_length=255, blank=True, null=True)
    telephone = models.CharField(max_length=255, blank=True, null=True)
    fax = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'supplier_sample_2021'


class UserCompany(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(unique=True, max_length=100)
    nick_name = models.CharField(max_length=100, blank=True, null=True)
    l_code = models.CharField(max_length=10, blank=True, null=True)
    tax = models.CharField(max_length=20, blank=True, null=True)
    ceo_name = models.CharField(max_length=30, blank=True, null=True)
    mid_no = models.CharField(max_length=100, blank=True, null=True)
    mid_memo = models.TextField(blank=True, null=True)
    lor_no = models.CharField(max_length=100, blank=True, null=True)
    lor_memo = models.TextField(blank=True, null=True)
    business_number = models.CharField(max_length=20, blank=True, null=True)
    business_file_url = models.CharField(max_length=255, blank=True, null=True)
    cm_biz_default = models.ForeignKey(CommonBasicInfo, models.DO_NOTHING)
    status = models.IntegerField()
    terms_agree = models.IntegerField()
    del_flag = models.CharField(max_length=2, blank=True, null=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField(blank=True, null=True)
    terms_agree_final = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'user_company'


class UserCompanyAddress(models.Model):
    id = models.BigAutoField(primary_key=True)
    comp_info = models.ForeignKey(UserCompany, models.DO_NOTHING)
    country = models.ForeignKey(CommonBasicInfo, models.DO_NOTHING, blank=True, null=True)
    cm_biz_default = models.ForeignKey(CommonBasicInfo, models.DO_NOTHING, blank=True, null=True)
    work_place = models.CharField(max_length=150)
    representive = models.IntegerField()
    city_id = models.BigIntegerField(blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)
    etc = models.CharField(max_length=200, blank=True, null=True)
    zip_code = models.CharField(max_length=10, blank=True, null=True)
    status = models.CharField(max_length=30, blank=True, null=True)
    del_flag = models.CharField(max_length=2, blank=True, null=True)
    comp = models.ForeignKey(UserCompany, models.DO_NOTHING)
    dept = models.ForeignKey('UserDepartment', models.DO_NOTHING)
    user = models.ForeignKey('UserInfo', models.DO_NOTHING)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'user_company_address'


class UserCompanyAddressPending(models.Model):
    id = models.BigAutoField(primary_key=True)
    country = models.ForeignKey(CommonBasicInfo, models.DO_NOTHING, blank=True, null=True)
    cm_biz_default = models.ForeignKey(CommonBasicInfo, models.DO_NOTHING, blank=True, null=True)
    work_place = models.CharField(max_length=150)
    city = models.ForeignKey(CommonBasicInfo, models.DO_NOTHING, blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)
    etc = models.CharField(max_length=200, blank=True, null=True)
    zip_code = models.CharField(max_length=10, blank=True, null=True)
    status = models.IntegerField()
    comp_pending = models.ForeignKey('UserCompanyPending', models.DO_NOTHING)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField(blank=True, null=True)
    dept = models.ForeignKey('UserDepartment', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey('UserInfo', models.DO_NOTHING, blank=True, null=True)
    comp = models.ForeignKey(UserCompany, models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'user_company_address_pending'


class UserCompanyPending(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=100)
    nick_name = models.CharField(max_length=100, blank=True, null=True)
    terms_agree = models.IntegerField()
    business_number = models.CharField(max_length=20, blank=True, null=True)
    business_file_url = models.CharField(max_length=255, blank=True, null=True)
    cm_biz_default = models.ForeignKey(CommonBasicInfo, models.DO_NOTHING)
    status = models.IntegerField()
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField(blank=True, null=True)
    relation_type = models.CharField(max_length=100, blank=True, null=True)
    terms_agree_final = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'user_company_pending'


class UserDepartment(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(unique=True, max_length=50)

    class Meta:
        managed = False
        db_table = 'user_department'


class UserInfo(models.Model):
    id = models.BigAutoField(primary_key=True)
    email = models.CharField(unique=True, max_length=50)
    full_name = models.CharField(max_length=100, blank=True, null=True)
    password = models.CharField(max_length=255, blank=True, null=True)
    manager = models.IntegerField()
    level = models.ForeignKey('UserLevel', models.DO_NOTHING)
    office_phone = models.CharField(max_length=100, blank=True, null=True)
    mobile_phone = models.CharField(max_length=100, blank=True, null=True)
    memo = models.TextField(blank=True, null=True)
    terms_agree = models.IntegerField()
    comp = models.ForeignKey(UserCompany, models.DO_NOTHING)
    dept = models.ForeignKey(UserDepartment, models.DO_NOTHING)
    common_menu = models.ForeignKey(CommonBasicInfo, models.DO_NOTHING)
    status = models.CharField(max_length=2)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField(blank=True, null=True)
    secret_key = models.CharField(max_length=150, blank=True, null=True)
    user_type = models.CharField(max_length=10)

    class Meta:
        managed = False
        db_table = 'user_info'


class UserInfoPending(models.Model):
    id = models.BigAutoField(primary_key=True)
    email = models.CharField(unique=True, max_length=50)
    full_name = models.CharField(max_length=100, blank=True, null=True)
    comp_pending_id = models.BigIntegerField()
    common_menu_id = models.BigIntegerField()
    terms_agree = models.IntegerField()
    status = models.CharField(max_length=2)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'user_info_pending'


class UserLevel(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(unique=True, max_length=50)

    class Meta:
        managed = False
        db_table = 'user_level'


class UserMailSend(models.Model):
    id = models.BigAutoField(primary_key=True)
    email = models.CharField(max_length=50)
    send_type = models.IntegerField()
    type_idx = models.BigIntegerField(blank=True, null=True)
    status = models.IntegerField()
    send_date = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'user_mail_send'


class UserPersonalPending(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(UserInfo, models.DO_NOTHING)
    comp = models.ForeignKey(UserCompany, models.DO_NOTHING)
    status = models.CharField(max_length=2)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'user_personal_pending'
