package com.ayogame.service;

import com.ayogame.exception.InvalidMoveException;
import com.ayogame.model.AyoBoard;
import com.ayogame.model.GameStatus;
import com.ayogame.model.Player;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AyoLogicService {

    public static class MoveExecutionResult {
        private final AyoBoard newBoard;
        private final int selectedPit;
        private final int seedsSown;
        private final int seedsCaptured;
        private final boolean grandSlamDisallowed;
        private final GameStatus status;
        private final Player winner;

        public MoveExecutionResult(AyoBoard newBoard, int selectedPit, int seedsSown, int seedsCaptured,
                                   boolean grandSlamDisallowed, GameStatus status, Player winner) {
            this.newBoard = newBoard;
            this.selectedPit = selectedPit;
            this.seedsSown = seedsSown;
            this.seedsCaptured = seedsCaptured;
            this.grandSlamDisallowed = grandSlamDisallowed;
            this.status = status;
            this.winner = winner;
        }

        public AyoBoard getNewBoard() { return newBoard; }
        public int getSelectedPit() { return selectedPit; }
        public int getSeedsSown() { return seedsSown; }
        public int getSeedsCaptured() { return seedsCaptured; }
        public boolean isGrandSlamDisallowed() { return grandSlamDisallowed; }
        public GameStatus getStatus() { return status; }
        public Player getWinner() { return winner; }
    }

    public boolean isPlayerPit(Player player, int pitIndex) {
        if (pitIndex < 0 || pitIndex >= AyoBoard.TOTAL_PITS) return false;
        if (player == Player.PLAYER_1) {
            return pitIndex >= 0 && pitIndex < AyoBoard.PITS_PER_PLAYER;
        } else {
            return pitIndex >= AyoBoard.PITS_PER_PLAYER && pitIndex < AyoBoard.TOTAL_PITS;
        }
    }

    public boolean isOpponentPit(Player player, int pitIndex) {
        return isPlayerPit(getOpponent(player), pitIndex);
    }

    public Player getOpponent(Player player) {
        return (player == Player.PLAYER_1) ? Player.PLAYER_2 : Player.PLAYER_1;
    }

    public List<Integer> getValidMoves(AyoBoard board, Player player) {
        List<Integer> validMoves = new ArrayList<>();
        int start = (player == Player.PLAYER_1) ? 0 : AyoBoard.PITS_PER_PLAYER;
        int end = start + AyoBoard.PITS_PER_PLAYER;

        Player opponent = getOpponent(player);
        int opponentSeedsOnBoard = board.getPlayerTotalSeedsOnBoard(opponent);

        List<Integer> nonZeroPits = new ArrayList<>();
        List<Integer> feedingPits = new ArrayList<>();

        for (int i = start; i < end; i++) {
            if (board.getPit(i) > 0) {
                nonZeroPits.add(i);
                if (willFeedOpponent(board, i)) {
                    feedingPits.add(i);
                }
            }
        }

        // Anti-Starvation Rule: If opponent has 0 seeds, player MUST play a feeding move if available
        if (opponentSeedsOnBoard == 0) {
            if (!feedingPits.isEmpty()) {
                return feedingPits;
            }
        }

        return nonZeroPits;
    }

    public boolean willFeedOpponent(AyoBoard board, int pitIndex) {
        int seeds = board.getPit(pitIndex);
        int currentPos = pitIndex;

        for (int i = 0; i < seeds; i++) {
            currentPos = (currentPos + 1) % AyoBoard.TOTAL_PITS;
            if (seeds >= AyoBoard.TOTAL_PITS && currentPos == pitIndex) {
                currentPos = (currentPos + 1) % AyoBoard.TOTAL_PITS;
            }
            if (currentPos >= AyoBoard.PITS_PER_PLAYER && pitIndex < AyoBoard.PITS_PER_PLAYER) {
                return true; // Player 1 feeding Player 2
            }
            if (currentPos < AyoBoard.PITS_PER_PLAYER && pitIndex >= AyoBoard.PITS_PER_PLAYER) {
                return true; // Player 2 feeding Player 1
            }
        }
        return false;
    }

    public void validateMove(AyoBoard board, Player player, int pitIndex) {
        if (pitIndex < 0 || pitIndex >= AyoBoard.TOTAL_PITS) {
            throw new InvalidMoveException("Invalid pit index: " + pitIndex);
        }
        if (!isPlayerPit(player, pitIndex)) {
            throw new InvalidMoveException("Pit " + pitIndex + " does not belong to " + player);
        }
        if (board.getPit(pitIndex) == 0) {
            throw new InvalidMoveException("Pit " + pitIndex + " is empty.");
        }

        List<Integer> validMoves = getValidMoves(board, player);
        if (!validMoves.contains(pitIndex)) {
            Player opponent = getOpponent(player);
            if (board.getPlayerTotalSeedsOnBoard(opponent) == 0) {
                throw new InvalidMoveException("Anti-Starvation Rule: You must play a move that feeds seeds to your opponent.");
            } else {
                throw new InvalidMoveException("Illegal move for pit " + pitIndex);
            }
        }
    }

    public MoveExecutionResult executeMove(AyoBoard currentBoard, Player activePlayer, int pitIndex) {
        validateMove(currentBoard, activePlayer, pitIndex);

        AyoBoard newBoard = currentBoard.copy();
        int[] pits = newBoard.getPits();
        int seedsToSow = pits[pitIndex];
        pits[pitIndex] = 0;

        int currentPos = pitIndex;
        for (int i = 0; i < seedsToSow; i++) {
            currentPos = (currentPos + 1) % AyoBoard.TOTAL_PITS;
            // Full Lap Skip Rule: If sowing 12 or more seeds, skip the starting pit
            if (seedsToSow >= AyoBoard.TOTAL_PITS && currentPos == pitIndex) {
                currentPos = (currentPos + 1) % AyoBoard.TOTAL_PITS;
            }
            pits[currentPos]++;
        }

        // Capture Evaluation
        int capturedAmount = 0;
        boolean grandSlamDisallowed = false;

        if (isOpponentPit(activePlayer, currentPos) && (pits[currentPos] == 2 || pits[currentPos] == 3)) {
            List<Integer> candidateCapturedPits = new ArrayList<>();
            int candidateCaptureTotal = 0;
            int checkPos = currentPos;

            while (isOpponentPit(activePlayer, checkPos) && (pits[checkPos] == 2 || pits[checkPos] == 3)) {
                candidateCapturedPits.add(checkPos);
                candidateCaptureTotal += pits[checkPos];
                checkPos = (checkPos + 11) % AyoBoard.TOTAL_PITS; // Move clockwise / backward
            }

            // Check total seeds on opponent side prior to capture
            Player opponent = getOpponent(activePlayer);
            int opponentStart = (opponent == Player.PLAYER_1) ? 0 : AyoBoard.PITS_PER_PLAYER;
            int opponentEnd = opponentStart + AyoBoard.PITS_PER_PLAYER;
            int totalOpponentSeedsAfterSow = 0;
            for (int p = opponentStart; p < opponentEnd; p++) {
                totalOpponentSeedsAfterSow += pits[p];
            }

            // Grand Slam Rule: If capture takes ALL opponent seeds, disallow capture
            if (candidateCaptureTotal == totalOpponentSeedsAfterSow) {
                grandSlamDisallowed = true;
                capturedAmount = 0;
            } else {
                capturedAmount = candidateCaptureTotal;
                for (int pitToEmpty : candidateCapturedPits) {
                    pits[pitToEmpty] = 0;
                }
                newBoard.addCaptured(activePlayer, capturedAmount);
            }
        }

        // Determine Game Status & Winner
        GameStatus status = GameStatus.IN_PROGRESS;
        Player winner = null;

        if (newBoard.getPlayer1Captured() >= AyoBoard.WINNING_SCORE) {
            status = GameStatus.PLAYER_1_WON;
            winner = Player.PLAYER_1;
        } else if (newBoard.getPlayer2Captured() >= AyoBoard.WINNING_SCORE) {
            status = GameStatus.PLAYER_2_WON;
            winner = Player.PLAYER_2;
        } else {
            Player nextTurnPlayer = getOpponent(activePlayer);
            List<Integer> nextPlayerValidMoves = getValidMoves(newBoard, nextTurnPlayer);
            if (nextPlayerValidMoves.isEmpty()) {
                // Next player has no valid moves -> collect remaining seeds
                int p1BoardSeeds = newBoard.getPlayerTotalSeedsOnBoard(Player.PLAYER_1);
                int p2BoardSeeds = newBoard.getPlayerTotalSeedsOnBoard(Player.PLAYER_2);
                newBoard.addCaptured(Player.PLAYER_1, p1BoardSeeds);
                newBoard.addCaptured(Player.PLAYER_2, p2BoardSeeds);

                // Empty all board pits
                for (int i = 0; i < AyoBoard.TOTAL_PITS; i++) {
                    newBoard.setPit(i, 0);
                }

                if (newBoard.getPlayer1Captured() > newBoard.getPlayer2Captured()) {
                    status = GameStatus.PLAYER_1_WON;
                    winner = Player.PLAYER_1;
                } else if (newBoard.getPlayer2Captured() > newBoard.getPlayer1Captured()) {
                    status = GameStatus.PLAYER_2_WON;
                    winner = Player.PLAYER_2;
                } else {
                    status = GameStatus.DRAW;
                }
            }
        }

        return new MoveExecutionResult(newBoard, pitIndex, seedsToSow, capturedAmount, grandSlamDisallowed, status, winner);
    }
}
