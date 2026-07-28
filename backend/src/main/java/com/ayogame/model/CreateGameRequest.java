package com.ayogame.model;

import jakarta.validation.constraints.NotNull;

public class CreateGameRequest {
    @NotNull(message = "Game mode is required")
    private GameMode mode;
    private String player1Name;
    private String player2Name;

    public CreateGameRequest() {
    }

    public CreateGameRequest(GameMode mode, String player1Name, String player2Name) {
        this.mode = mode;
        this.player1Name = player1Name;
        this.player2Name = player2Name;
    }

    public GameMode getMode() {
        return mode;
    }

    public void setMode(GameMode mode) {
        this.mode = mode;
    }

    public String getPlayer1Name() {
        return player1Name;
    }

    public void setPlayer1Name(String player1Name) {
        this.player1Name = player1Name;
    }

    public String getPlayer2Name() {
        return player2Name;
    }

    public void setPlayer2Name(String player2Name) {
        this.player2Name = player2Name;
    }
}
