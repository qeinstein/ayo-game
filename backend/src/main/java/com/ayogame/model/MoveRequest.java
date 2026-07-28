package com.ayogame.model;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class MoveRequest {
    @NotNull(message = "Pit index is required")
    @Min(value = 0, message = "Pit index must be between 0 and 11")
    @Max(value = 11, message = "Pit index must be between 0 and 11")
    private Integer pitIndex;

    public MoveRequest() {
    }

    public MoveRequest(Integer pitIndex) {
        this.pitIndex = pitIndex;
    }

    public Integer getPitIndex() {
        return pitIndex;
    }

    public void setPitIndex(Integer pitIndex) {
        this.pitIndex = pitIndex;
    }
}
