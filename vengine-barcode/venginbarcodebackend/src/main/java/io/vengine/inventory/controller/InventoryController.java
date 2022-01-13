package io.vengine.inventory.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import io.vengine.inventory.common.PageResult;
import io.vengine.inventory.common.SingleResult;
import io.vengine.inventory.entity.Barcode;
import io.vengine.inventory.entity.Delivery;
import io.vengine.inventory.entity.GoodsIssue;
import io.vengine.inventory.entity.GoodsReceipt;
import io.vengine.inventory.entity.Location;
import io.vengine.inventory.entity.Result;
import io.vengine.inventory.service.BarcodeService;
import io.vengine.inventory.service.FileService;
import io.vengine.inventory.service.GoodsIssueService;
import io.vengine.inventory.service.GoodsReceiptService;
import io.vengine.inventory.service.DeliveryService;
import io.vengine.inventory.service.LocationService;

@CrossOrigin
@RestController
@RequestMapping("/api/v1/inventory")
public class InventoryController {

	@Autowired
	DeliveryService deliveryService;

	@Autowired
	GoodsReceiptService goodsReceiptService;
	
	@Autowired
	GoodsIssueService goodsIssueService;
	
	@Autowired
	BarcodeService barcodeService;

	@Autowired
	LocationService locationService;

	@Autowired
	FileService fileService;


	@GetMapping("/getReceiveList")
	public PageResult<Delivery> getReceiveList(@RequestParam String searchKeyWord, int pageNum, String company) {
		return deliveryService.getDeliveryList("N", company, searchKeyWord, pageNum);
	}

	@GetMapping("/getDetail")
	public Delivery getList(@RequestParam String docNo) {
		return deliveryService.getItem(docNo);
	}

	@GetMapping("/getGoodsReceiptData")
	public SingleResult<GoodsReceipt> getGoodsReceiptData(@RequestParam String docNo, @RequestParam String type, @RequestParam String company) {
		return goodsReceiptService.getGoodsReceiptData(docNo, type, company);
	}
	
	@PostMapping("/getGoodsIssueData")
	public List<GoodsIssue> getGoodsIssueData(@RequestBody GoodsReceipt goodsReceipt) {
		return goodsIssueService.getGoodsIssueData(goodsReceipt);
	}
	
	@PostMapping("/insertBarcode")
	public Result insertBarcode(@RequestBody List<Barcode> barcodeData) {
		Result result = new Result("1000", true, "Register Success");		
		System.out.println("barcodeData: " + barcodeData);
		
		try {
			if(barcodeService.insertBarcode(barcodeData)) {
			}
		} catch (Exception e) {
			result.setResultCode("5000");
			result.setResultFlag(false);
			result.setResultMessage("Register Failed");
			e.printStackTrace();
		}
		
		return result;
	}

	@PostMapping("/insertGoodsReceipt")
	public GoodsReceipt insertGoodsReceipt(@RequestBody GoodsReceipt goodsReceiptData) {
		GoodsReceipt result = new GoodsReceipt();
		try {
			result = goodsReceiptService.insertGoodsReceipt(goodsReceiptData);
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return result;
	}
	
	@PostMapping("/insertGoodsIssue")
	public GoodsIssue insertGoodsIssue(@RequestBody GoodsIssue goodsIssueData) {
		GoodsIssue result = new GoodsIssue();
		try {
			result = goodsIssueService.insertGoodsIssue(goodsIssueData);
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return result;
	}
	
	@GetMapping("/getBarcodeList")
	public Page<Barcode> getBarcodeList(@RequestParam String searchKeyWord, int pageNum) {
		return barcodeService.getBarcodeList(searchKeyWord, pageNum);
	}

	@GetMapping("/getLocationList")
	public List<Location> getBarcodeList() {
		return locationService.getLocationList();
	}

	@GetMapping("/getBarcode")
	public List<Barcode> getBarcode(@RequestParam String inWareHousingNumber) {
		return barcodeService.getBarcode(inWareHousingNumber);
	}

	@GetMapping("/getBarcodeInfo")
	public Barcode getBarcodeInfo(@RequestParam String barcodeText) {
		return barcodeService.getBarcodeInfo(barcodeText);
	}

	@GetMapping("/checkBarcode")
	public Map<String, Object> checkBarcode(@RequestParam String barcode, @RequestParam String warehouse) {
		Map<String, Object> result = new HashMap<String, Object>();

		Barcode bacode = barcodeService.getBarcodeInfo(barcode);
		Location location = locationService.getLocationInfo(barcode);
				
		if (bacode != null && location == null) {
			result.put("type", "BY");
			result.put("barcode", bacode);
		} else if (bacode == null && location != null) {
			result.put("type", "LY");
			result.put("barcode", location);
		} else {
			result.put("type", "NN");
			result.put("barcode", "");
		}

		return result;
	}

	@GetMapping("/getLocationInfo")
	public Location getLocationInfo(@RequestParam String barcodeText) {
		return locationService.getLocationInfo(barcodeText);
	}

	@PostMapping("/insertLocation")
	public void insertLocation(@RequestBody List<Location> data) {
		locationService.insertLocation(data);
	}

	@PostMapping("/updateBarcodeInfo")
	public void updateBarcodeInfo(@RequestBody Barcode data) {
		barcodeService.updateBarcodeInfo(data);
	}

	@PostMapping("/upload")
	public boolean pictureupload(@RequestParam("file") MultipartFile file, @RequestParam("packingNumber") String packingNumber, @RequestParam("type") String type) {
		return fileService.fileUpload(file, packingNumber, type);
	}
	
	@PostMapping("/sendBarcode")
	public boolean receiveBarcode(@RequestParam("type") String type, @RequestParam("barcodeData") List<String> barcodeData) {
		System.out.println("type: "+ type);
		System.out.println("barcodeData: "+ barcodeData);
		return true;
	}
	
	@GetMapping("/getPackingList")
	public List<Map<String, String>> getPackingList(@RequestParam String searchKeyWord, int pageNum) {
		Map<String, String> map = null;
		List<Map<String, String>> listData = new ArrayList<Map<String, String>>(); 
		for(int i=0; i< 10; i++) {
			map = new HashMap<String, String>();
			map.put("packingNumber", "PACKING"+i);
			listData.add(map);
		}
		return listData;
	}
	
	@GetMapping("/getOutwarehousingList")
	public Page<GoodsIssue> getOutwarehousingList(@RequestParam String searchKeyWord, int pageNum, String company) {
		return goodsIssueService.getGoodsIssueList("N", searchKeyWord, pageNum, company);
	}
	
	@GetMapping("/getGoodsIssueDataByID")
	public GoodsIssue getGoodsIssueDataByID(@RequestParam("id") long goodIssueID) {		
		return goodsIssueService.getGoodsIssueDataByID(goodIssueID);
	}
}
