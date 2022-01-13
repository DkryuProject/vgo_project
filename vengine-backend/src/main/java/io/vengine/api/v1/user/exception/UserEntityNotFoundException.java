package io.vengine.api.v1.user.exception;

import javax.persistence.EntityNotFoundException;

public class UserEntityNotFoundException extends EntityNotFoundException {
    public UserEntityNotFoundException(String target) {
        super(target + " is not found");
    }
}
