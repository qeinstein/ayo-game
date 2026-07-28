package com.ayogame.model;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

public class AyoGameSession {
    private String id;
    private GameMode mode;
    private AyoBoard board;
    private Player currentTurn;
    private GameStatus status;
    private String player1Name;
    private String player2Name;
    private List<String> history;
    private String createdAt;

    public AyoGameSession() {
    }

    public AyoGameSession(String id, GameMode mode, String player1Name, String player2Name) {
        this.id = id;
        this.mode = mode;
        this.board = new AyoBoard();
        this.currentTurn = Player.PLAYER_1;
        this.status = GameStatus.IN_PROGRESS;
        this.player1Name = (player1Name != null && !player1Name.trim().isEmpty()) ? player1Name.trim() : "Player 1";
        this.player2Name = (mode == GameMode.VS_AI) ? "Ọ̀tá Bot (AI)" : 
            ((player2Name != null && !player2Name.trim().isEmpty()) ? player2Name.trim() : "Player 2");
        this.history = new ArrayList<>();
        this.createdAt = Instant.now().toString();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public GameMode getMode() {
        return mode;
    }

    public void setMode(GameMode mode) {
        this.mode = mode;
    }

    public AyoBoard getBoard() {
        return board;
    }

    public void setBoard(AyoBoard board) {
        this.board = board;
    }

    public Player getCurrentTurn() {
        return currentTurn;
    }

    public void setCurrentTurn(Player currentTurn) {
        this.currentTurn = currentTurn;
    }

    public GameStatus getStatus() {
        return status;
    }

    public void setStatus(GameStatus status) {
        this.status = status;
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

    public List<String> getHistory() {
        return history;
    }

    public void setHistory(List<String> history) {
        this.history = history;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }
}
