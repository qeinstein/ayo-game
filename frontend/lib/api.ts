export type GameMode = 'PASS_AND_PLAY' | 'VS_AI';
export type Player = 'PLAYER_1' | 'PLAYER_2';
export type GameStatus = 'IN_PROGRESS' | 'PLAYER_1_WON' | 'PLAYER_2_WON' | 'DRAW';

export interface AyoBoard {
  pits: number[];
  player1Captured: number;
  player2Captured: number;
}

export interface AyoGameSession {
  id: string;
  mode: GameMode;
  board: AyoBoard;
  currentTurn: Player;
  status: GameStatus;
  player1Name: string;
  player2Name: string;
  history: string[];
  createdAt: string;
}

export interface MoveResult {
  selectedPit: number;
  seedsSown: number;
  seedsCaptured: number;
  grandSlamDisallowed: boolean;
  gameOver: boolean;
  status: GameStatus;
  winner?: Player;
  nextTurn: Player;
  board: AyoBoard;
  history: string[];
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1/ayo/games';

export async function createGame(mode: GameMode, player1Name?: string, player2Name?: string): Promise<AyoGameSession> {
  try {
    const res = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode, player1Name, player2Name }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to create game session.');
    }
    return await res.json();
  } catch (err: unknown) {
    // If backend is not reached, provide fallback offline simulation
    console.warn('Backend REST API unavailable, using client-side fallback session mode.', err);
    return createLocalFallbackGame(mode, player1Name, player2Name);
  }
}

export async function getGame(id: string): Promise<AyoGameSession> {
  try {
    const res = await fetch(`${API_BASE_URL}/${id}`);
    if (!res.ok) {
      throw new Error('Game session not found.');
    }
    return await res.json();
  } catch (err) {
    const local = getLocalGame(id);
    if (local) return local;
    throw err;
  }
}

export async function makeMove(id: string, pitIndex: number): Promise<MoveResult> {
  try {
    const res = await fetch(`${API_BASE_URL}/${id}/move`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pitIndex }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || 'Invalid move execution.');
    }
    return await res.json();
  } catch (err: unknown) {
    const local = getLocalGame(id);
    if (local) {
      return executeLocalMove(local, pitIndex);
    }
    throw err;
  }
}

export async function resetGame(id: string): Promise<AyoGameSession> {
  try {
    const res = await fetch(`${API_BASE_URL}/${id}/reset`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to reset game.');
    return await res.json();
  } catch {
    const local = getLocalGame(id);
    if (local) {
      return createLocalFallbackGame(local.mode, local.player1Name, local.player2Name, id);
    }
    throw new Error('Reset failed.');
  }
}

// Client-side local fallback storage for offline play
const localGames = new Map<string, AyoGameSession>();

function getLocalGame(id: string): AyoGameSession | undefined {
  return localGames.get(id);
}

function createLocalFallbackGame(mode: GameMode, p1Name?: string, p2Name?: string, existingId?: string): AyoGameSession {
  const id = existingId || `local-${Date.now()}`;
  const session: AyoGameSession = {
    id,
    mode,
    board: {
      pits: [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
      player1Captured: 0,
      player2Captured: 0,
    },
    currentTurn: 'PLAYER_1',
    status: 'IN_PROGRESS',
    player1Name: p1Name?.trim() || 'Player 1',
    player2Name: mode === 'VS_AI' ? 'Ọ̀tá Bot (AI)' : (p2Name?.trim() || 'Player 2'),
    history: [],
    createdAt: new Date().toISOString(),
  };
  localGames.set(id, session);
  return session;
}

function executeLocalMove(session: AyoGameSession, pitIndex: number): MoveResult {
  const isP1 = session.currentTurn === 'PLAYER_1';
  if ((isP1 && (pitIndex < 0 || pitIndex > 5)) || (!isP1 && (pitIndex < 6 || pitIndex > 11))) {
    throw new Error(`Pit ${pitIndex + 1} does not belong to ${isP1 ? session.player1Name : session.player2Name}.`);
  }
  if (session.board.pits[pitIndex] === 0) {
    throw new Error('Selected pit is empty!');
  }

  const pits = [...session.board.pits];
  let seeds = pits[pitIndex];
  pits[pitIndex] = 0;
  let pos = pitIndex;

  for (let i = 0; i < seeds; i++) {
    pos = (pos + 1) % 12;
    if (seeds >= 12 && pos === pitIndex) {
      pos = (pos + 1) % 12;
    }
    pits[pos]++;
  }

  let captured = 0;
  let grandSlam = false;
  const isOpponentPit = isP1 ? pos >= 6 && pos <= 11 : pos >= 0 && pos <= 5;

  if (isOpponentPit && (pits[pos] === 2 || pits[pos] === 3)) {
    let candidateTotal = 0;
    const candidatePits: number[] = [];
    let check = pos;
    const opponentRange = isP1 ? [6, 11] : [0, 5];

    while (check >= opponentRange[0] && check <= opponentRange[1] && (pits[check] === 2 || pits[check] === 3)) {
      candidatePits.push(check);
      candidateTotal += pits[check];
      check = (check + 11) % 12;
    }

    const opponentTotalSeeds = pits.slice(opponentRange[0], opponentRange[1] + 1).reduce((a, b) => a + b, 0);
    if (candidateTotal === opponentTotalSeeds) {
      grandSlam = true;
    } else {
      captured = candidateTotal;
      candidatePits.forEach(p => pits[p] = 0);
    }
  }

  let p1Cap = session.board.player1Captured + (isP1 ? captured : 0);
  let p2Cap = session.board.player2Captured + (!isP1 ? captured : 0);

  let status: GameStatus = 'IN_PROGRESS';
  let winner: Player | undefined;

  if (p1Cap >= 25) {
    status = 'PLAYER_1_WON';
    winner = 'PLAYER_1';
  } else if (p2Cap >= 25) {
    status = 'PLAYER_2_WON';
    winner = 'PLAYER_2';
  }

  session.board.pits = pits;
  session.board.player1Captured = p1Cap;
  session.board.player2Captured = p2Cap;
  session.status = status;

  const activeName = isP1 ? session.player1Name : session.player2Name;
  let log = `${activeName} played Pit ${pitIndex + 1} (${seeds} sown`;
  if (grandSlam) log += ' - Grand Slam disallowed, 0 captured)';
  else if (captured > 0) log += ` & captured ${captured} seeds)`;
  else log += ', 0 captured)';

  session.history.push(log);

  if (status === 'IN_PROGRESS') {
    session.currentTurn = isP1 ? 'PLAYER_2' : 'PLAYER_1';

    // Fallback AI move if mode is VS_AI
    if (session.mode === 'VS_AI' && session.currentTurn === 'PLAYER_2') {
      const validAiPits = [6, 7, 8, 9, 10, 11].filter(p => pits[p] > 0);
      if (validAiPits.length > 0) {
        const aiChoice = validAiPits[Math.floor(Math.random() * validAiPits.length)];
        setTimeout(() => executeLocalMove(session, aiChoice), 400);
      }
    }
  }

  localGames.set(session.id, session);

  return {
    selectedPit: pitIndex,
    seedsSown: seeds,
    seedsCaptured: captured,
    grandSlamDisallowed: grandSlam,
    gameOver: status !== 'IN_PROGRESS',
    status,
    winner,
    nextTurn: session.currentTurn,
    board: session.board,
    history: session.history,
  };
}
