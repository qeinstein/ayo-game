package com.ayogame.service;

import com.ayogame.exception.InvalidMoveException;
import com.ayogame.model.AyoBoard;
import com.ayogame.model.GameStatus;
import com.ayogame.model.Player;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class AyoLogicServiceTest {

    private AyoLogicService logicService;
    private AyoBoard board;

    @BeforeEach
    void setUp() {
        logicService = new AyoLogicService();
        board = new AyoBoard();
    }

    @Test
    @DisplayName("Initial board state should have 4 seeds in each of the 12 pits")
    void testInitialBoardState() {
        for (int i = 0; i < AyoBoard.TOTAL_PITS; i++) {
            assertEquals(4, board.getPit(i), "Pit " + i + " should have 4 seeds");
        }
        assertEquals(0, board.getPlayer1Captured());
        assertEquals(0, board.getPlayer2Captured());
    }

    @Test
    @DisplayName("Executing a standard move sows seeds counter-clockwise")
    void testStandardMoveSowing() {
        // Player 1 plays pit 0 (contains 4 seeds)
        AyoLogicService.MoveExecutionResult result = logicService.executeMove(board, Player.PLAYER_1, 0);

        AyoBoard newBoard = result.getNewBoard();
        assertEquals(0, newBoard.getPit(0)); // Emptied
        assertEquals(5, newBoard.getPit(1));
        assertEquals(5, newBoard.getPit(2));
        assertEquals(5, newBoard.getPit(3));
        assertEquals(5, newBoard.getPit(4));
        assertEquals(4, newBoard.getPit(5));
        assertEquals(0, result.getSeedsCaptured());
    }

    @Test
    @DisplayName("Capturing occurs when last seed lands in opponent pit leaving 2 or 3 seeds")
    void testCaptureMechanic() {
        // Custom setup: P1 plays pit 5 (sowing to 6, 7, 8, 9)
        int[] pits = new int[]{4, 4, 4, 4, 4, 2, 1, 1, 4, 4, 4, 4};
        AyoBoard customBoard = new AyoBoard(pits, 0, 0);

        // P1 plays pit 5 (2 seeds -> lands in 6 [now 2 seeds] & 7 [now 2 seeds])
        AyoLogicService.MoveExecutionResult result = logicService.executeMove(customBoard, Player.PLAYER_1, 5);

        assertEquals(4, result.getSeedsCaptured(), "Should capture 2+2=4 seeds");
        assertEquals(4, result.getNewBoard().getPlayer1Captured());
        assertEquals(0, result.getNewBoard().getPit(6));
        assertEquals(0, result.getNewBoard().getPit(7));
    }

    @Test
    @DisplayName("12 or more seeds sowing skips the starting pit on a full lap")
    void testFullLapSkipStartingPit() {
        // Pit 0 has 12 seeds, other pits have 0
        int[] pits = new int[]{12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0};
        AyoBoard customBoard = new AyoBoard(pits, 0, 0);

        AyoLogicService.MoveExecutionResult result = logicService.executeMove(customBoard, Player.PLAYER_1, 0);

        // 12 seeds sown: pits 1..11 get 1 seed (11 seeds total), and the 12th seed goes to pit 1 (skipping 0)
        assertEquals(0, result.getNewBoard().getPit(0), "Starting pit 0 must be skipped on full lap");
        assertEquals(2, result.getNewBoard().getPit(1));
        assertEquals(1, result.getNewBoard().getPit(2));
    }

    @Test
    @DisplayName("Anti-Starvation Rule prevents moves that fail to feed an empty opponent")
    void testAntiStarvationRule() {
        // Player 2 has 0 seeds
        int[] pits = new int[]{4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0};
        AyoBoard customBoard = new AyoBoard(pits, 0, 0);

        // P1 pit 0 has 4 seeds (sows to 1,2,3,4 - does not reach opponent 6..11)
        // P1 pit 1 has 4 seeds (sows to 2,3,4,5 - does not reach opponent 6..11)
        // But pit 0 has 4 seeds and cannot feed. If a pit can feed, it must be chosen.
        // Let's set pit 1 to have 6 seeds (sows to 2,3,4,5,6,7 -> feeds P2)
        pits[1] = 6;
        AyoBoard feedingBoard = new AyoBoard(pits, 0, 0);

        // Trying to play pit 0 (which does NOT feed P2) should throw InvalidMoveException
        assertThrows(InvalidMoveException.class, () -> {
            logicService.executeMove(feedingBoard, Player.PLAYER_1, 0);
        });

        // Playing pit 1 (which feeds P2) should succeed
        assertDoesNotThrow(() -> {
            logicService.executeMove(feedingBoard, Player.PLAYER_1, 1);
        });
    }

    @Test
    @DisplayName("Grand Slam Rule disallows capture if it would empty all opponent pits")
    void testGrandSlamDisallowed() {
        // Player 2 has only 2 seeds in pit 6 and 0 in all other pits 7..11
        int[] pits = new int[]{0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0};
        AyoBoard customBoard = new AyoBoard(pits, 0, 0);

        // P1 plays pit 5 (1 seed -> lands in 6, making pit 6 equal 2 seeds).
        // Capturing pit 6 would take ALL seeds from P2 (Grand Slam).
        AyoLogicService.MoveExecutionResult result = logicService.executeMove(customBoard, Player.PLAYER_1, 5);

        assertTrue(result.isGrandSlamDisallowed());
        assertEquals(0, result.getSeedsCaptured(), "Capture should be cancelled");
        assertEquals(2, result.getNewBoard().getPit(6), "Opponent pit should retain seeds");
    }

    @Test
    @DisplayName("Winning condition is met when a player reaches 25 captured seeds")
    void testWinningCondition() {
        int[] pits = new int[]{4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4};
        AyoBoard winningBoard = new AyoBoard(pits, 24, 0); // P1 has 24 captured seeds already

        // P1 pit 5 (4 seeds) sows to 6, 7, 8, 9. Pit 6 has 5 seeds...
        // Let's set pit 6 to 1 seed so after sowing it has 2 seeds.
        pits[6] = 1;
        AyoBoard customBoard = new AyoBoard(pits, 24, 0);

        AyoLogicService.MoveExecutionResult result = logicService.executeMove(customBoard, Player.PLAYER_1, 5);

        assertTrue(result.getNewBoard().getPlayer1Captured() >= 25);
        assertEquals(GameStatus.PLAYER_1_WON, result.getStatus());
        assertEquals(Player.PLAYER_1, result.getWinner());
    }
}
