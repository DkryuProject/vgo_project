from django.contrib import admin
from common.models import CommonBasicInfo

# Register your models here.
class CommonBasicInfoAdmin(admin.ModelAdmin):
    list_per_page = 10
    search_fields = ('cm_name1' , 'cm_name2','cm_name3', 'cm_name4')

class Uom(CommonBasicInfo):
    class Meta:
        proxy = True
        
class UomAdmin(CommonBasicInfoAdmin):
    list_display = ['cm_name1' , 'cm_name2','cm_name3', 'cm_name4']
    fields = ('cm_name1' , 'cm_name2','cm_name3', 'cm_name4')
    
    def get_queryset(self, request):
        return self.model.objects.using('external').filter(type = 'uom')

    def save_model(self, request, obj, form, change):
        obj.type = 'uom'
        obj.save(using='external')
    
class Yarn(CommonBasicInfo):
    class Meta:
        proxy = True
        
class YarnAdmin(CommonBasicInfoAdmin):
    list_display = ['cm_name1' , 'cm_name3']
    fields = ('cm_name1' ,'cm_name3')
    
    def get_queryset(self, request):
        return self.model.objects.using('external').filter(type = 'yarn')
    
    def save_model(self, request, obj, form, change):
        obj.type = 'yarn'
        obj.save(using='external')

class Currency(CommonBasicInfo):
    class Meta:
        proxy = True
        
class CurrencyAdmin(CommonBasicInfoAdmin):
    list_display = ['cm_name1' , 'cm_name2', 'cm_name3']
    fields = ('cm_name1' , 'cm_name2', 'cm_name3')
    
    def get_queryset(self, request):
        return self.model.objects.using('external').filter(type = 'currency')
    
    def save_model(self, request, obj, form, change):
        obj.type = 'currency'
        obj.save(using='external')

admin.site.register(Uom, UomAdmin)    
admin.site.register(Yarn, YarnAdmin)
admin.site.register(Currency, CurrencyAdmin)