# Ayò Ọlọ́pọ́n — Concurrent Strategy Game Service & Web Interface

## Java Concurrency, Game Engine & Multi-Session Web System

---

## Table of Contents

1. [Abstract](#abstract)
2. [Historical & Cultural Context](#historical--cultural-context)
3. [Problem Statement & Rules Specification](#problem-statement--rules-specification)
4. [System Architecture](#system-architecture)
5. [Concurrency Model](#concurrency-model)
6. [Game Rules Engine & Algorithm](#game-rules-engine--algorithm)
7. [AI Minimax Decision Engine](#ai-minimax-decision-engine)
8. [REST API Contract](#rest-api-contract)
9. [Data Model](#data-model)
10. [Frontend Client](#frontend-client)
11. [Build & Run Instructions](#build--run-instructions)
12. [Testing Strategy](#testing-strategy)
13. [Project Structure](#project-structure)

---

## Abstract

**Ayò Ọlọ́pọ́n** (commonly known as **Ayo**) is a traditional two-player count-and-capture strategy game belonging to the **Mancala** family. This project presents a full-stack, distributed web-based implementation of Ayò Ọlọ́pọ́n: a **Java 17 / Spring Boot 3** REST API backend managing concurrent game sessions with thread-safe data structures and an AI opponent, paired with a modern, responsive **Next.js 14 / TypeScript / Tailwind CSS** frontend styled with carved wood aesthetics, glassmorphism, and micro-animations.

The system strictly enforces authentic Yoruba game mechanics, including counter-clockwise sowing, 12-seed full lap pit skipping, chain captures, anti-starvation feeding move validation, grand slam capture disallowance, and match title awards (**Ọ̀tá** for the champion and **Òpe** for the loser).

---

## Historical & Cultural Context

Known historically as the *"Game of the Intellectual"* (*Ayo Ọlọ́pọ́n* translates literally to *"the game of the carved board"*), Ayò has been played for centuries among the Yoruba people of Southwestern Nigeria. It served both as communal entertainment on verandas under shade trees and as an informal educational tool for training young minds in rapid arithmetic, spatial pattern recognition, memory retention, and long-term tactical planning.

The game is deeply tied to Yoruba social life, where spectators gather around the board (*Ọpọ́n Ayò*) to banter, analyze moves, and celebrate players who attain the revered title of **Ọ̀tá** (Champion).

---

## Problem Statement & Rules Specification

The objective is to design a high-throughput, stateful web service capable of:

1. **Managing Concurrent Game Sessions**: Storing active sessions in memory using thread-safe primitives (`ConcurrentHashMap`) without state corruption or race conditions.
2. **Atomic Turn Execution**: Enforcing strict turn alternation and atomic state transitions using Java method-level synchronization.
3. **Authentic Game Engine Enforcement**:
   - **Board State**: 12 circular pits in 2 parallel rows of 6 pits. Player 1 (South) owns pits 0–5; Player 2 (North) owns pits 6–11. Total 48 seeds (4 seeds per pit initially).
   - **Counter-Clockwise Sowing**: Scooping all seeds from a chosen pit and dropping 1 seed per pit counter-clockwise.
   - **12+ Seed Lap Skip**: If a move contains $\ge 12$ seeds, sowing completes a full lap; the starting pit is skipped on distribution.
   - **Chain Captures**: Capturing seeds when the last seed lands in an opponent's pit containing 2 or 3 seeds, plus preceding pits in the opponent's row also containing 2 or 3 seeds.
   - **Anti-Starvation Feeding Rule**: A player cannot leave the opponent with 0 seeds if a legal move exists that delivers seeds to the opponent's row.
   - **Grand Slam Rule**: Captures that would clear all seeds from the opponent's side are disallowed; seeds are sown but no capture takes place.
   - **Victory Target**: First player to capture $\ge 25$ seeds wins.

---

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT TIER                          │
│         Next.js 14 (React 18) + TypeScript              │
│       Carved Wood UI & Animated Seeds (App Router)      │
└────────────────────────────┬────────────────────────────┘
                             │  HTTP / REST (JSON)
                             │  CORS-enabled
                             ▼
┌─────────────────────────────────────────────────────────┐
│                 APPLICATION TIER                        │
│             Spring Boot 3.3.4 (Java 17)                 │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │     GameController (REST API Endpoint Tier)       │  │
│  │   POST /api/v1/ayo/games                          │  │
│  │   GET  /api/v1/ayo/games/{id}                     │  │
│  │   POST /api/v1/ayo/games/{id}/move                │  │
│  │   POST /api/v1/ayo/games/{id}/reset               │  │
│  └─────────────────────────┬─────────────────────────┘  │
│                            │                            │
│  ┌─────────────────────────▼─────────────────────────┐  │
│  │         GameService (Session Concurrency)         │  │
│  │    Thread-safe ConcurrentHashMap & atomic lock    │  │
│  └────────────┬─────────────────────────┬────────────┘  │
│               │                         │               │
│  ┌────────────▼────────────┐  ┌─────────▼────────────┐  │
│  │   AyoLogicService       │  │    AyoAiService      │  │
│  │ Stateless engine (rules,│  │ Minimax / Alpha-Beta │  │
│  │ sowing, chain capture,  │  │ decision tree AI for │  │
│  │ anti-starvation feeding)│  │ Player vs AI mode    │  │
│  └─────────────────────────┘  └──────────────────────┘  │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│                      DATA TIER                          │
│     ConcurrentHashMap<String, AyoGameSession>          │
│          In-memory per JVM process instance             │
└─────────────────────────────────────────────────────────┘
```

---

## Concurrency Model

### Session Storage: `ConcurrentHashMap`
Active sessions are stored in a `ConcurrentHashMap<String, AyoGameSession>`. This provides lock-free read access for `GET /api/v1/ayo/games/{id}` requests while guaranteeing structural safety during concurrent creations and retrievals.

### Atomic State Transitions: Method Synchronization
State mutations (sowing seeds, evaluating chain captures, updating turn indicators, AI turn execution) are encapsulated within `synchronized` methods inside `GameService`:

```java
public synchronized MoveResult makeMove(String id, int pitIndex) {
    // 1. Fetch session from ConcurrentHashMap
    // 2. Validate active turn and game status
    // 3. Execute sowing, full lap skip, and capture checks atomically
    // 4. Update board state, captured counts, and history log
    // 5. Trigger AI move if VS_AI mode
    // 6. Return MoveResult
}
```

This guarantees serializability of moves per session and prevents race conditions under high concurrent HTTP request volume.

---

## Game Rules Engine & Algorithm

### Sowing & Pit Distribution Algorithm
Let $S$ be the chosen pit index ($0 \le S \le 11$) containing $N$ seeds.
1. Clear pit $S$: $\text{pits}[S] \leftarrow 0$.
2. Set $\text{pos} \leftarrow S$.
3. For $i = 1 \dots N$:
   - $\text{pos} \leftarrow (\text{pos} + 1) \pmod{12}$.
   - **Full Lap Skip**: If $N \ge 12$ and $\text{pos} = S$, then $\text{pos} \leftarrow (\text{pos} + 1) \pmod{12}$.
   - $\text{pits}[\text{pos}] \leftarrow \text{pits}[\text{pos}] + 1$.

### Capture Evaluation & Grand Slam Protection
If the final position $\text{pos}$ lands in the opponent's row ($\text{pos} \in [6, 11]$ for Player 1, or $\text{pos} \in [0, 5]$ for Player 2) and $\text{pits}[\text{pos}] \in \{2, 3\}$:
- Walk backwards clockwise ($\text{pos} \leftarrow (\text{pos} + 11) \pmod{12}$) collecting adjacent opponent pits with 2 or 3 seeds.
- Calculate candidate captured seeds $\sum C$.
- If $\sum C = \text{totalOpponentSeedsAfterSow}$, **Grand Slam detected**: disallow capture ($\text{captured} \leftarrow 0$).
- Otherwise, empty captured pits and award seeds to active player's score.

---

## AI Minimax Decision Engine

For `VS_AI` single player mode, `AyoAiService` employs a **Minimax algorithm with Alpha-Beta Pruning** evaluated to depth 4.

### Heuristic Evaluation Function
$$E(B) = 100 \times (C_{\text{AI}} - C_{\text{Opponent}}) + 5 \times (P_{\text{AI}} - P_{\text{Opponent}})$$
where:
- $C_{\text{AI}}, C_{\text{Opponent}}$ are captured seed counts.
- $P_{\text{AI}}, P_{\text{Opponent}}$ are total seeds remaining on respective board rows.

---

## REST API Contract

### 1. Create Game Session
- **`POST /api/v1/ayo/games`**
- **Request Body**:
  ```json
  {
    "mode": "VS_AI",
    "player1Name": "Ade",
    "player2Name": "Ọ̀tá Bot"
  }
  ```
- **Response**: `201 Created` with full `AyoGameSession` JSON object.

### 2. Get Game Session
- **`GET /api/v1/ayo/games/{id}`**
- **Response**: `200 OK` with `AyoGameSession`.

### 3. Make Move
- **`POST /api/v1/ayo/games/{id}/move`**
- **Request Body**:
  ```json
  {
    "pitIndex": 3
  }
  ```
- **Response**: `200 OK` with `MoveResult`.

### 4. Reset Game
- **`POST /api/v1/ayo/games/{id}/reset`**
- **Response**: `200 OK` with fresh `AyoGameSession`.

### 5. Health Check
- **`GET /api/v1/health`**
- **Response**: `200 OK` `{"status": "UP", "service": "ayo-game-backend"}`.

---

## Scheduled Task Execution (`PingScheduler`)

To prevent cloud container instances (such as Render free tiers) from spinning down after inactivity, the backend includes an automated `@Scheduled` background worker (`PingScheduler`).

- **Frequency**: Triggers every **30 seconds** (`fixedRate = 30000`, `initialDelay = 10000`).
- **Target URL**: Configurable via `PING_URL` environment variable (defaults to `https://ayo-game.onrender.com/api/v1/health`).
- **Execution**: Sends an asynchronous HTTP GET request using Java's native `HttpClient` to keep the JVM warm and responsive.

---

## Build & Run Instructions

### Prerequisites
- **Java 17+**
- **Node.js 18+** & `npm`

### 1. Backend Service (Spring Boot)
```bash
cd backend
./mvnw clean package
./mvnw spring-boot:run
```
The REST API will run on `http://localhost:8080`.

### 2. Frontend Client (Next.js)
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## Deployment Guide (Render & Vercel)

```
┌─────────────────────────┐          ┌──────────────────────────┐
│    Vercel (Frontend)    │  HTTPS   │     Render (Backend)     │
│                         │ ───────> │                          │
│  Next.js 14 App Router  │  REST    │  Spring Boot 3.3.4 (Java)│
│  Environment Variable:  │  API     │  Docker (JRE 17 Alpine)  │
│   NEXT_PUBLIC_API_URL   │          │  Port: ${PORT}           │
└─────────────────────────┘          └──────────────────────────┘
```

### 1. Deploy Backend to Render

1. **Push your repository to GitHub**.
2. Log into [Render Dashboard](https://dashboard.render.com/) and click **New +** -> **Web Service**.
3. Connect your GitHub repository (`ayo-game`).
4. Configure service settings:
   - **Name**: `ayo-game-backend`
   - **Root Directory**: `backend`
   - **Runtime**: `Docker` (Render will automatically detect `backend/Dockerfile`).
   - **Instance Type**: Free or Starter.
5. Click **Create Web Service**.
6. Once deployed, copy your service's HTTPS URL (e.g. `https://ayo-game-backend.onrender.com`).

---

### 2. Deploy Frontend to Vercel

1. Log into [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New...** -> **Project**.
2. Select and import your GitHub repository (`ayo-game`).
3. Configure project settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend` (Click *Edit* next to Root Directory and choose `frontend`).
4. Expand **Environment Variables** and add:
   - **Name**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://ayo-game-backend.onrender.com/api/v1/ayo/games` *(replace with your actual Render URL)*
5. Click **Deploy**.
6. Vercel will build and host your Next.js application live!

---

## Testing Strategy

Run the automated backend test suite with Maven:
```bash
cd backend
./mvnw test
```

### Verified Test Scenarios (`AyoLogicServiceTest`):
1. **Initial Board Setup**: Verifies 12 pits initialized with 4 seeds each (48 seeds total).
2. **Standard Sowing**: Validates counter-clockwise seed distribution across consecutive pits.
3. **Capture Mechanics**: Verifies 2 & 3 seed captures on opponent pits.
4. **Full-Lap Pit Skip**: Verifies that sowing $\ge 12$ seeds skips the origin pit.
5. **Anti-Starvation Rule**: Validates rejection of non-feeding moves when opponent has 0 seeds.
6. **Grand Slam Disallowance**: Verifies capture cancellation when move would empty opponent side.
7. **Win Condition**: Confirms 25+ captured seed victory trigger and **Ọ̀tá** champion status.

---

## Project Structure

```
ayo-game/
├── README.md
├── backend/
│   ├── pom.xml
│   └── src/
│       ├── main/java/com/ayogame/
│       │   ├── AyoApplication.java
│       │   ├── config/WebConfig.java
│       │   ├── controller/GameController.java
│       │   ├── exception/GlobalExceptionHandler.java
│       │   ├── model/ (AyoBoard, AyoGameSession, Player, GameMode, etc.)
│       │   └── service/ (AyoLogicService, AyoAiService, GameService)
│       └── test/java/com/ayogame/service/AyoLogicServiceTest.java
└── frontend/
    ├── package.json
    ├── tailwind.config.js
    ├── app/ (layout.tsx, page.tsx, globals.css)
    ├── components/ (AyoBoard, Navbar, GameSetup, ScoreCard, MoveHistory, RulesModal, WinModal)
    └── lib/ (api.ts)
```
