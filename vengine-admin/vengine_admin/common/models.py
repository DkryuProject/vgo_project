from django.db import models

# Create your models here.
class CommonBasicInfo(models.Model):
    id = models.BigAutoField(primary_key=True)
    type = models.CharField(max_length=30)
    cm_name1 = models.CharField(max_length=255, blank=True, null=True)
    cm_name2 = models.CharField(max_length=255, blank=True, null=True)
    cm_name3 = models.CharField(max_length=255, blank=True, null=True)
    cm_name4 = models.CharField(max_length=2000, blank=True, null=True)
    cm_name5 = models.BigIntegerField(blank=True, null=True)
    cm_name6 = models.BigIntegerField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'common_basic_info'
        verbose_name = 'Common Basic Info'
        verbose_name_plural = 'Common'
