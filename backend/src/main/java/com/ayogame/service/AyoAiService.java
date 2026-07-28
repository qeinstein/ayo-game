package com.ayogame.service;

import com.ayogame.model.AyoBoard;
import com.ayogame.model.GameStatus;
import com.ayogame.model.Player;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;

@Service
public class AyoAiService {

    private final AyoLogicService logicService;
    private final Random random = new Random();

    public AyoAiService(AyoLogicService logicService) {
        this.logicService = logicService;
    }

    public int selectBestMove(AyoBoard board, Player aiPlayer) {
        List<Integer> validMoves = logicService.getValidMoves(board, aiPlayer);
        if (validMoves.isEmpty()) {
            throw new IllegalStateException("AI has no valid moves available.");
        }
        if (validMoves.size() == 1) {
            return validMoves.get(0);
        }

        int bestMove = validMoves.get(0);
        int bestScore = Integer.MIN_VALUE;

        for (int move : validMoves) {
            try {
                AyoLogicService.MoveExecutionResult result = logicService.executeMove(board, aiPlayer, move);
                int score = minimax(result.getNewBoard(), 4, false, aiPlayer, Integer.MIN_VALUE, Integer.MAX_VALUE);
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = move;
                }
            } catch (Exception e) {
                // Ignore invalid test moves
            }
        }

        return bestMove;
    }

    private int minimax(AyoBoard board, int depth, boolean isMaximizing, Player aiPlayer, int alpha, int beta) {
        Player opponent = logicService.getOpponent(aiPlayer);

        if (depth == 0 || board.getPlayer1Captured() >= AyoBoard.WINNING_SCORE || board.getPlayer2Captured() >= AyoBoard.WINNING_SCORE) {
            return evaluateBoard(board, aiPlayer);
        }

        Player currentTurn = isMaximizing ? aiPlayer : opponent;
        List<Integer> validMoves = logicService.getValidMoves(board, currentTurn);

        if (validMoves.isEmpty()) {
            return evaluateBoard(board, aiPlayer);
        }

        if (isMaximizing) {
            int maxEval = Integer.MIN_VALUE;
            for (int move : validMoves) {
                try {
                    AyoLogicService.MoveExecutionResult result = logicService.executeMove(board, aiPlayer, move);
                    int eval = minimax(result.getNewBoard(), depth - 1, false, aiPlayer, alpha, beta);
                    maxEval = Math.max(maxEval, eval);
                    alpha = Math.max(alpha, eval);
                    if (beta <= alpha) break;
                } catch (Exception e) {
                    // Ignore
                }
            }
            return maxEval;
        } else {
            int minEval = Integer.MAX_VALUE;
            for (int move : validMoves) {
                try {
                    AyoLogicService.MoveExecutionResult result = logicService.executeMove(board, opponent, move);
                    int eval = minimax(result.getNewBoard(), depth - 1, true, aiPlayer, alpha, beta);
                    minEval = Math.min(minEval, eval);
                    beta = Math.min(beta, eval);
                    if (beta <= alpha) break;
                } catch (Exception e) {
                    // Ignore
                }
            }
            return minEval;
        }
    }

    private int evaluateBoard(AyoBoard board, Player aiPlayer) {
        Player opponent = logicService.getOpponent(aiPlayer);
        int aiCaptured = (aiPlayer == Player.PLAYER_1) ? board.getPlayer1Captured() : board.getPlayer2Captured();
        int opponentCaptured = (opponent == Player.PLAYER_1) ? board.getPlayer1Captured() : board.getPlayer2Captured();

        int score = (aiCaptured - opponentCaptured) * 100;
        int aiBoardSeeds = board.getPlayerTotalSeedsOnBoard(aiPlayer);
        int opponentBoardSeeds = board.getPlayerTotalSeedsOnBoard(opponent);

        score += (aiBoardSeeds - opponentBoardSeeds) * 5;
        return score;
    }
}
