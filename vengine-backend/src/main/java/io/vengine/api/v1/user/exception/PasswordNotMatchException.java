package io.vengine.api.v1.user.exception;

import io.vengine.api.error.InvalidValueException;
import io.vengine.api.error.errorCode.ErrorCode;

public class PasswordNotMatchException extends InvalidValueException {

    public PasswordNotMatchException(String value, ErrorCode errorCode) {
        super(value, errorCode);
    }
}
