package com.ayogame.service;

import com.ayogame.exception.GameNotFoundException;
import com.ayogame.exception.InvalidMoveException;
import com.ayogame.model.*;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class GameService {

    private final Map<String, AyoGameSession> games = new ConcurrentHashMap<>();
    private final AyoLogicService logicService;
    private final AyoAiService aiService;

    public GameService(AyoLogicService logicService, AyoAiService aiService) {
        this.logicService = logicService;
        this.aiService = aiService;
    }

    public AyoGameSession createGame(CreateGameRequest request) {
        if (request.getMode() == null) {
            throw new IllegalArgumentException("Game mode must be specified.");
        }
        String id = UUID.randomUUID().toString();
        AyoGameSession session = new AyoGameSession(id, request.getMode(), request.getPlayer1Name(), request.getPlayer2Name());
        games.put(id, session);
        return session;
    }

    public AyoGameSession getGame(String id) {
        AyoGameSession session = games.get(id);
        if (session == null) {
            throw new GameNotFoundException("Game session not found with ID: " + id);
        }
        return session;
    }

    public synchronized MoveResult makeMove(String id, int pitIndex) {
        AyoGameSession session = getGame(id);

        if (session.getStatus() != GameStatus.IN_PROGRESS) {
            throw new InvalidMoveException("Game is already completed.");
        }

        Player currentTurn = session.getCurrentTurn();
        AyoLogicService.MoveExecutionResult result = logicService.executeMove(session.getBoard(), currentTurn, pitIndex);

        // Update Board & Status
        session.setBoard(result.getNewBoard());
        session.setStatus(result.getStatus());

        String playerName = (currentTurn == Player.PLAYER_1) ? session.getPlayer1Name() : session.getPlayer2Name();
        String logEntry = String.format("%s played Pit %d (%d seeds sown", playerName, pitIndex + 1, result.getSeedsSown());

        if (result.isGrandSlamDisallowed()) {
            logEntry += " - Grand Slam disallowed, 0 captured)";
        } else if (result.getSeedsCaptured() > 0) {
            logEntry += String.format(" & captured %d seeds)", result.getSeedsCaptured());
        } else {
            logEntry += ", 0 captured)";
        }

        session.getHistory().add(logEntry);

        Player winner = result.getWinner();
        Player nextTurn = currentTurn;

        if (result.getStatus() == GameStatus.IN_PROGRESS) {
            nextTurn = logicService.getOpponent(currentTurn);
            session.setCurrentTurn(nextTurn);

            // Automatic CPU Turn if VS_AI and next turn is PLAYER_2
            if (session.getMode() == GameMode.VS_AI && nextTurn == Player.PLAYER_2) {
                try {
                    int aiBestPit = aiService.selectBestMove(session.getBoard(), Player.PLAYER_2);
                    AyoLogicService.MoveExecutionResult aiResult = logicService.executeMove(session.getBoard(), Player.PLAYER_2, aiBestPit);
                    
                    session.setBoard(aiResult.getNewBoard());
                    session.setStatus(aiResult.getStatus());

                    String aiLog = String.format("%s (AI) played Pit %d (%d seeds sown", session.getPlayer2Name(), aiBestPit + 1, aiResult.getSeedsSown());
                    if (aiResult.isGrandSlamDisallowed()) {
                        aiLog += " - Grand Slam disallowed, 0 captured)";
                    } else if (aiResult.getSeedsCaptured() > 0) {
                        aiLog += String.format(" & captured %d seeds)", aiResult.getSeedsCaptured());
                    } else {
                        aiLog += ", 0 captured)";
                    }
                    session.getHistory().add(aiLog);

                    if (aiResult.getStatus() == GameStatus.IN_PROGRESS) {
                        nextTurn = Player.PLAYER_1;
                        session.setCurrentTurn(Player.PLAYER_1);
                    } else {
                        winner = aiResult.getWinner();
                    }
                } catch (Exception e) {
                    // Fallback
                }
            }
        }

        return new MoveResult(
                pitIndex,
                result.getSeedsSown(),
                result.getSeedsCaptured(),
                result.isGrandSlamDisallowed(),
                session.getStatus() != GameStatus.IN_PROGRESS,
                session.getStatus(),
                winner,
                session.getCurrentTurn(),
                session.getBoard(),
                session.getHistory()
        );
    }

    public synchronized AyoGameSession resetGame(String id) {
        AyoGameSession session = getGame(id);
        AyoGameSession newSession = new AyoGameSession(id, session.getMode(), session.getPlayer1Name(), session.getPlayer2Name());
        games.put(id, newSession);
        return newSession;
    }
}
