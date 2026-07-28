package com.ayogame.model;

import java.util.List;

public class MoveResult {
    private int selectedPit;
    private int seedsSown;
    private int seedsCaptured;
    private boolean isGrandSlamDisallowed;
    private boolean gameOver;
    private GameStatus status;
    private Player winner;
    private Player nextTurn;
    private AyoBoard board;
    private List<String> history;

    public MoveResult() {
    }

    public MoveResult(int selectedPit, int seedsSown, int seedsCaptured, boolean isGrandSlamDisallowed,
                      boolean gameOver, GameStatus status, Player winner, Player nextTurn,
                      AyoBoard board, List<String> history) {
        this.selectedPit = selectedPit;
        this.seedsSown = seedsSown;
        this.seedsCaptured = seedsCaptured;
        this.isGrandSlamDisallowed = isGrandSlamDisallowed;
        this.gameOver = gameOver;
        this.status = status;
        this.winner = winner;
        this.nextTurn = nextTurn;
        this.board = board;
        this.history = history;
    }

    public int getSelectedPit() {
        return selectedPit;
    }

    public void setSelectedPit(int selectedPit) {
        this.selectedPit = selectedPit;
    }

    public int getSeedsSown() {
        return seedsSown;
    }

    public void setSeedsSown(int seedsSown) {
        this.seedsSown = seedsSown;
    }

    public int getSeedsCaptured() {
        return seedsCaptured;
    }

    public void setSeedsCaptured(int seedsCaptured) {
        this.seedsCaptured = seedsCaptured;
    }

    public boolean isGrandSlamDisallowed() {
        return isGrandSlamDisallowed;
    }

    public void setGrandSlamDisallowed(boolean grandSlamDisallowed) {
        isGrandSlamDisallowed = grandSlamDisallowed;
    }

    public boolean isGameOver() {
        return gameOver;
    }

    public void setGameOver(boolean gameOver) {
        this.gameOver = gameOver;
    }

    public GameStatus getStatus() {
        return status;
    }

    public void setStatus(GameStatus status) {
        this.status = status;
    }

    public Player getWinner() {
        return winner;
    }

    public void setWinner(Player winner) {
        this.winner = winner;
    }

    public Player getNextTurn() {
        return nextTurn;
    }

    public void setNextTurn(Player nextTurn) {
        this.nextTurn = nextTurn;
    }

    public AyoBoard getBoard() {
        return board;
    }

    public void setBoard(AyoBoard board) {
        this.board = board;
    }

    public List<String> getHistory() {
        return history;
    }

    public void setHistory(List<String> history) {
        this.history = history;
    }
}
