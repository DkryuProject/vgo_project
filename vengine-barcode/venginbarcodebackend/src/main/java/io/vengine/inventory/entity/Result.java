package io.vengine.inventory.entity;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Result {
    private String resultCode;
    private boolean resultFlag;
    private String resultMessage;
    
	public Result(String resultCode, boolean resultFlag, String resultMessage) {
		this.resultCode = resultCode;
		this.resultFlag = resultFlag;
		this.resultMessage = resultMessage;
	}	
    
}
