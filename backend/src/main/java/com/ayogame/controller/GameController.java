package com.ayogame.controller;

import com.ayogame.model.AyoGameSession;
import com.ayogame.model.CreateGameRequest;
import com.ayogame.model.MoveRequest;
import com.ayogame.model.MoveResult;
import com.ayogame.service.GameService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/ayo/games")
public class GameController {

    private final GameService gameService;

    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    @PostMapping
    public ResponseEntity<AyoGameSession> createGame(@Valid @RequestBody CreateGameRequest request) {
        AyoGameSession session = gameService.createGame(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(session);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AyoGameSession> getGame(@PathVariable String id) {
        AyoGameSession session = gameService.getGame(id);
        return ResponseEntity.ok(session);
    }

    @PostMapping("/{id}/move")
    public ResponseEntity<MoveResult> makeMove(@PathVariable String id, @Valid @RequestBody MoveRequest request) {
        MoveResult result = gameService.makeMove(id, request.getPitIndex());
        return ResponseEntity.ok(result);
    }

    @PostMapping("/{id}/reset")
    public ResponseEntity<AyoGameSession> resetGame(@PathVariable String id) {
        AyoGameSession session = gameService.resetGame(id);
        return ResponseEntity.ok(session);
    }
}
