package com.ayogame.model;

import java.util.Arrays;

public class AyoBoard {
    public static final int TOTAL_PITS = 12;
    public static final int PITS_PER_PLAYER = 6;
    public static final int INITIAL_SEEDS_PER_PIT = 4;
    public static final int TOTAL_SEEDS = 48;
    public static final int WINNING_SCORE = 25;

    private int[] pits;
    private int player1Captured;
    private int player2Captured;

    public AyoBoard() {
        this.pits = new int[TOTAL_PITS];
        Arrays.fill(this.pits, INITIAL_SEEDS_PER_PIT);
        this.player1Captured = 0;
        this.player2Captured = 0;
    }

    public AyoBoard(int[] pits, int player1Captured, int player2Captured) {
        this.pits = Arrays.copyOf(pits, TOTAL_PITS);
        this.player1Captured = player1Captured;
        this.player2Captured = player2Captured;
    }

    public int[] getPits() {
        return pits;
    }

    public void setPits(int[] pits) {
        this.pits = pits;
    }

    public int getPit(int index) {
        return pits[index];
    }

    public void setPit(int index, int count) {
        pits[index] = count;
    }

    public int getPlayer1Captured() {
        return player1Captured;
    }

    public void setPlayer1Captured(int player1Captured) {
        this.player1Captured = player1Captured;
    }

    public int getPlayer2Captured() {
        return player2Captured;
    }

    public void setPlayer2Captured(int player2Captured) {
        this.player2Captured = player2Captured;
    }

    public void addCaptured(Player player, int amount) {
        if (player == Player.PLAYER_1) {
            this.player1Captured += amount;
        } else {
            this.player2Captured += amount;
        }
    }

    public int getPlayerTotalSeedsOnBoard(Player player) {
        int start = (player == Player.PLAYER_1) ? 0 : PITS_PER_PLAYER;
        int end = start + PITS_PER_PLAYER;
        int count = 0;
        for (int i = start; i < end; i++) {
            count += pits[i];
        }
        return count;
    }

    public AyoBoard copy() {
        return new AyoBoard(this.pits, this.player1Captured, this.player2Captured);
    }
}
