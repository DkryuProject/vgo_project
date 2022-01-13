package io.vengine.api.v1.etc.service;

import com.google.gson.Gson;
import io.vengine.api.common.dto.ExcelDto;
import io.vengine.api.common.dto.ExcelReaderErrorField;
import io.vengine.api.common.dto.ExcelResponse;
import io.vengine.api.common.enums.ExcelReaderFieldError;
import io.vengine.api.common.service.ExcelReader;
import io.vengine.api.common.service.ExcelWriter;
import io.vengine.api.common.utils.S3Uploader;
import io.vengine.api.error.BusinessException;
import io.vengine.api.error.errorCode.ErrorCode;
import io.vengine.api.v1.commonInfo.entity.CommonBasicInfo;
import io.vengine.api.v1.commonInfo.entity.CommonMaterialType;
import io.vengine.api.v1.commonInfo.repository.CommonMaterialTypeRepository;
import io.vengine.api.v1.commonInfo.service.CommonService;
import io.vengine.api.v1.companyInfo.service.CompanyInfoService;
import io.vengine.api.v1.etc.dto.excel.Accessories;
import io.vengine.api.v1.etc.dto.excel.Fabric;
import io.vengine.api.v1.etc.dto.excel.Port;
import io.vengine.api.v1.etc.dto.excel.Trim;
import io.vengine.api.v1.etc.mapper.ExcelMapper;
import io.vengine.api.v1.user.entity.Company;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ExcelService {
    @Autowired
    private S3Uploader s3Uploader;

    @Autowired
    CommonService commonService;

    @Autowired
    CompanyInfoService companyInfoService;

    @Autowired
    CommonMaterialTypeRepository commonMaterialTypeRepository;

    public Map<String, Object> excelDownload(HttpServletRequest request, String type) {
        // 데이터 가져오기
        List<? extends ExcelDto> data = ExcelMapper.INSTANCE.toPortExcel(commonService.findCommonBasicInfoByType("port"));
        Map<String, Object> excelData = ExcelWriter.createExcelData(data, Port.class);
        return excelData;
    }

    public Map<String, Object> materialExcelDownload(HttpServletRequest request, String type, Company company) {
        List<Map<String, Object>> selectBoxData = new ArrayList<>();
        List data = new ArrayList<>();
        Map<String, Object> result = new HashMap<>();

        if(type.equals("fabric")){
            for (int i=0 ; i < 100; i++){
                data.add(new Fabric());
            }
            selectBoxData = createSelectBox(company);
            result = ExcelWriter.createExcelData(data, selectBoxData, Fabric.class);
        }else if(type.equals("trim")){
            for (int i=0 ; i < 100; i++){
                data.add(new Trim());
            }
            selectBoxData = createSelectBox(company);
            result = ExcelWriter.createExcelData(data, selectBoxData, Trim.class);
        }else if(type.equals("accessories")){
            for (int i=0 ; i < 100; i++){
                data.add(new Accessories());
            }
            selectBoxData = createSelectBox(company);
            result = ExcelWriter.createExcelData(data, selectBoxData, Accessories.class);
        }

        if(data.isEmpty()){
            throw new BusinessException("Excel Creat Error (data is empty!!!)", ErrorCode.INTERNAL_SERVER_ERROR);
        }

        return result;
    }

    public ExcelResponse materialExcelUpload(MultipartFile file, String type, Company company) throws Exception {
        ExcelResponse excelResponse = new ExcelResponse();
        ExcelReader excelReader=null;
        String fileName = null;

        if("fabric".equals(type)){
            excelReader = new ExcelReader(file, Fabric::from);
            List<Fabric> fabricExcelList = excelReader.getExcelList();

            if(fabricExcelList.size() == 0){
                throw new BusinessException(ErrorCode.NO_ITEMS);
            }
            Fabric fabricExcelResult = fabricExcelList.get(0);
            List<Fabric> fabricExcelResultList = new ArrayList<>();
            fabricExcelResultList.add(fabricExcelResult);

            for(int i =1; i < fabricExcelList.size(); i++){
                if(fabricExcelResult.getNo().equals(fabricExcelList.get(i).getNo())){
                    fabricExcelResultList.add(ExcelMapper.INSTANCE.toFabricMaterial(fabricExcelResult,fabricExcelList.get(i)));
                }else{
                    fabricExcelResult = fabricExcelList.get(i);
                    fabricExcelResultList.add(fabricExcelResult);
                }
            }

            excelResponse.setExcelList(fabricExcelResultList.stream().limit(20).collect(Collectors.toList()));
            if(excelReader.getErrorFieldList().size() == 0) {
                fileName = s3Uploader.excelDataUpload(new Gson().toJson(fabricExcelResultList));
            }
        }else if("trim".equals(type)){
            excelReader = new ExcelReader(file, Trim::from);
            List<Trim> trimExcelList = excelReader.getExcelList();

            if(trimExcelList.size() == 0){
                throw new BusinessException(ErrorCode.NO_ITEMS);
            }

            Trim trimExcelResult = trimExcelList.get(0);
            List<Trim> trimExcelResultList = new ArrayList<>();
            trimExcelResultList.add(trimExcelResult);

            for(int i =1; i < trimExcelList.size(); i++){
                if(trimExcelResult.getNo().equals(trimExcelList.get(i).getNo())){
                    trimExcelResultList.add(ExcelMapper.INSTANCE.toTrimMaterial(trimExcelResult,trimExcelList.get(i)));
                }else{
                    trimExcelResult = trimExcelList.get(i);
                    trimExcelResultList.add(trimExcelResult);
                }
            }

            excelResponse.setExcelList(trimExcelResultList.stream().limit(20).collect(Collectors.toList()));
            if(excelReader.getErrorFieldList().size() == 0) {
                fileName = s3Uploader.excelDataUpload(new Gson().toJson(trimExcelResultList));
            }
        }else if("accessories".equals(type)){
            excelReader = new ExcelReader(file, Accessories::from);
            List<Accessories> accessoriesExcelList = excelReader.getExcelList();

            if(accessoriesExcelList.size() == 0){
                throw new BusinessException(ErrorCode.NO_ITEMS);
            }
            Accessories accessoriesExcelResult = accessoriesExcelList.get(0);
            List<Accessories> accessoriesExcelResultList = new ArrayList<>();
            accessoriesExcelResultList.add(accessoriesExcelResult);

            for(int i =1; i < accessoriesExcelList.size(); i++){
                if(accessoriesExcelResult.getNo().equals(accessoriesExcelList.get(i).getNo())){
                    accessoriesExcelResultList.add(ExcelMapper.INSTANCE.toAccessoriesMaterial(accessoriesExcelResult,accessoriesExcelList.get(i)));
                }else{
                    accessoriesExcelResult = accessoriesExcelList.get(i);
                    accessoriesExcelResultList.add(accessoriesExcelResult);
                }
            }

            excelResponse.setExcelList(accessoriesExcelResultList.stream().limit(20).collect(Collectors.toList()));
            if(excelReader.getErrorFieldList().size() == 0) {
                fileName = s3Uploader.excelDataUpload(new Gson().toJson(accessoriesExcelResultList));
            }
        }else{
            throw new BusinessException(ErrorCode.INVALID_TYPE_VALUE);
        }
        excelResponse.setErrorList(excelReader.getErrorFieldList());
        excelResponse.setFileName(fileName);
        return excelResponse;
    }

    public  List<Map<String, Object>> createSelectBox(Company company) {
        List<Map<String, Object>> selectBoxList = new ArrayList<>();
        Map<String, Object> selectBox;

        //Supplier
        List<String> suppliers = companyInfoService.findCompanyByRelationType("SUPPLIER", company)
                .stream()
                .map(item -> item.getBizCompany().getName())
                .collect(Collectors.toList());
        suppliers.add(company.getName());
        selectBox = new HashMap<>();
        selectBox.put("no", "1");
        selectBox.put("cellIndex", "A");
        selectBox.put("data", suppliers);
        selectBox.put("size", suppliers.size());
        selectBoxList.add(selectBox);

        //Buyer
        List<String> buyers = companyInfoService.findCompanyByRelationType("BUYER", company)
                .stream()
                .map(item -> item.getBizCompany().getName())
                .collect(Collectors.toList());
        buyers.add(company.getName());
        selectBox = new HashMap<>();
        selectBox.put("no", "2");
        selectBox.put("cellIndex", "B");
        selectBox.put("data", buyers);
        selectBox.put("size", buyers.size());
        selectBoxList.add(selectBox);

        //CURRENCY
        List<String> currencies = commonService.findCommonBasicInfoByType("currency")
                .stream()
                .map(CommonBasicInfo::getCmName2)
                .collect(Collectors.toList());
        selectBox = new HashMap<>();
        selectBox.put("no", "3");
        selectBox.put("cellIndex", "C");
        selectBox.put("data", currencies);
        selectBox.put("size", currencies.size());
        selectBoxList.add(selectBox);

        //FABRIC UOM
        List<String> fabricUomList = Arrays.asList("feet", "yard", "cm", "meter", "inch");
        selectBox = new HashMap<>();
        selectBox.put("no", "4");
        selectBox.put("cellIndex", "D");
        selectBox.put("data", fabricUomList);
        selectBox.put("size", fabricUomList.size());
        selectBoxList.add(selectBox);

        //UOM(TRIM, ACCESSORIES, SIZE)
        List<CommonBasicInfo> uomList = commonService.findCommonBasicInfoByType("uom");
        List<String> trimUomList = uomList
                .stream()
                .filter(v-> (v.getCmName2().equals("counting")||v.getCmName2().equals("length")||v.getCmName2().equals("mass")))
                .map(CommonBasicInfo::getCmName3)
                .collect(Collectors.toList());
        selectBox = new HashMap<>();
        selectBox.put("no", "5");
        selectBox.put("cellIndex", "E");
        selectBox.put("data", trimUomList);
        selectBox.put("size", trimUomList.size());
        selectBoxList.add(selectBox);

        //WEIGHT UOM
        List<String> weightUomList = Arrays.asList("g/m2", "oz/m2");
        selectBox = new HashMap<>();
        selectBox.put("no", "6");
        selectBox.put("cellIndex", "F");
        selectBox.put("data", weightUomList);
        selectBox.put("size", weightUomList.size());
        selectBoxList.add(selectBox);

        //FABRIC YARN
        List<String> yarnList =  commonService.findCommonBasicInfoByType("yarn")
                .stream()
                .map(CommonBasicInfo::getCmName1)
                .collect(Collectors.toList());
        selectBox = new HashMap<>();
        selectBox.put("no", "7");
        selectBox.put("cellIndex", "G");
        selectBox.put("data", yarnList);
        selectBox.put("size", yarnList.size());
        selectBoxList.add(selectBox);

        //MATERIAL TYPE
        List<CommonMaterialType> commonMaterialTypes = commonMaterialTypeRepository.findAll();
        List<String > fabricTypes = commonMaterialTypes
                .stream()
                .filter(v->v.getCategoryA().equals("Fabric"))
                .map(CommonMaterialType::getCategoryB)
                .distinct()
                .collect(Collectors.toList());
        List<String > trimTypes = commonMaterialTypes
                .stream()
                .filter(v->v.getCategoryA().equals("Trim"))
                .map(CommonMaterialType::getCategoryB)
                .distinct()
                .collect(Collectors.toList());
        List<String > accessoriesTypes = commonMaterialTypes
                .stream()
                .filter(v->v.getCategoryA().equals("Accessories"))
                .map(CommonMaterialType::getCategoryB)
                .distinct()
                .collect(Collectors.toList());
        List<String > accessoriesCategories= commonMaterialTypes
                .stream()
                .filter(v->v.getCategoryA().equals("Accessories"))
                .map(CommonMaterialType::getCategoryC)
                .collect(Collectors.toList());

        //FABRIC TYPE
        selectBox = new HashMap<>();
        selectBox.put("no", "8");
        selectBox.put("cellIndex", "H");
        selectBox.put("data", fabricTypes);
        selectBox.put("size", fabricTypes.size());
        selectBoxList.add(selectBox);

        //TRIM TYPE
        selectBox = new HashMap<>();
        selectBox.put("no", "9");
        selectBox.put("cellIndex", "I");
        selectBox.put("data", trimTypes);
        selectBox.put("size", trimTypes.size());
        selectBoxList.add(selectBox);

        //ACCESSORIES TYPE
        selectBox = new HashMap<>();
        selectBox.put("no", "10");
        selectBox.put("cellIndex", "J");
        selectBox.put("data", accessoriesTypes);
        selectBox.put("size", accessoriesTypes.size());
        selectBoxList.add(selectBox);

        //ACCESSORIES CATEGORY
        selectBox = new HashMap<>();
        selectBox.put("no", "11");
        selectBox.put("cellIndex", "K");
        selectBox.put("data", accessoriesCategories);
        selectBox.put("size", accessoriesCategories.size());
        selectBoxList.add(selectBox);

        //WIDTH UOM
        List<String> widthUomList = Arrays.asList("inch");
        selectBox = new HashMap<>();
        selectBox.put("no", "6");
        selectBox.put("cellIndex", "L");
        selectBox.put("data", widthUomList);
        selectBox.put("size", widthUomList.size());
        selectBoxList.add(selectBox);

        return selectBoxList;
    }
}
