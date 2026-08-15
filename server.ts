import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

interface LeaderboardEntry {
  id: string;
  name: string;
  heroClass: string;
  level: number;
  score: number;
  zone: string;
  bossesDefeated: number;
  playTimeMinutes: number;
  date: string;
}

const PORT = 3000;
const DATA_DIR = path.join(process.cwd(), "data");
const LEADERBOARD_FILE = path.join(DATA_DIR, "leaderboard.json");

// Initial default hall of fame
const DEFAULT_LEADERBOARD: LeaderboardEntry[] = [
  {
    id: "leg-1",
    name: "Eldrin el sabio",
    heroClass: "Mago",
    level: 15,
    score: 12500,
    zone: "Castillo Maldito",
    bossesDefeated: 4,
    playTimeMinutes: 45,
    date: "2026-08-10",
  },
  {
    id: "leg-2",
    name: "Valeria la Brava",
    heroClass: "Guerrero",
    level: 14,
    score: 10800,
    zone: "Castillo Maldito",
    bossesDefeated: 4,
    playTimeMinutes: 52,
    date: "2026-08-11",
  },
  {
    id: "leg-3",
    name: "ShadowK",
    heroClass: "Pícaro",
    level: 11,
    score: 8200,
    zone: "Volcán Ancestral",
    bossesDefeated: 3,
    playTimeMinutes: 38,
    date: "2026-08-12",
  },
  {
    id: "leg-4",
    name: "Aria Shield",
    heroClass: "Guerrero",
    level: 8,
    score: 5400,
    zone: "Cueva de Sombras",
    bossesDefeated: 2,
    playTimeMinutes: 25,
    date: "2026-08-12",
  },
  {
    id: "leg-5",
    name: "Pip el Novato",
    heroClass: "Mago",
    level: 5,
    score: 2300,
    zone: "Bosque Verde",
    bossesDefeated: 1,
    playTimeMinutes: 15,
    date: "2026-08-13",
  },
];

function ensureDataFile() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(LEADERBOARD_FILE)) {
      fs.writeFileSync(LEADERBOARD_FILE, JSON.stringify(DEFAULT_LEADERBOARD, null, 2));
    }
  } catch (err) {
    console.error("Error setting up data file:", err);
  }
}

function getLeaderboard(): LeaderboardEntry[] {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(LEADERBOARD_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return DEFAULT_LEADERBOARD;
  }
}

function saveLeaderboard(entries: LeaderboardEntry[]) {
  ensureDataFile();
  try {
    // Keep top 100 entries sorted by score desc
    entries.sort((a, b) => b.score - a.score);
    const trimmed = entries.slice(0, 100);
    fs.writeFileSync(LEADERBOARD_FILE, JSON.stringify(trimmed, null, 2));
  } catch (err) {
    console.error("Error saving leaderboard:", err);
  }
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // Leaderboard API Endpoints
  app.get("/api/leaderboard", (_req, res) => {
    const data = getLeaderboard();
    res.json({ success: true, leaderboard: data });
  });

  app.post("/api/leaderboard", (req, res) => {
    const { name, heroClass, level, score, zone, bossesDefeated, playTimeMinutes } = req.body;

    if (!name || typeof name !== "string") {
      return res.status(400).json({ success: false, error: "Nombre de jugador requerido" });
    }

    const newEntry: LeaderboardEntry = {
      id: "lb-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
      name: name.trim().slice(0, 18) || "Héroe Anónimo",
      heroClass: heroClass || "Guerrero",
      level: Number(level) || 1,
      score: Number(score) || 0,
      zone: zone || "Bosque Verde",
      bossesDefeated: Number(bossesDefeated) || 0,
      playTimeMinutes: Number(playTimeMinutes) || 0,
      date: new Date().toISOString().split("T")[0],
    };

    const current = getLeaderboard();
    current.push(newEntry);
    saveLeaderboard(current);

    res.json({ success: true, entry: newEntry, leaderboard: getLeaderboard() });
  });

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", app: "Crónicas Pixel RPG" });
  });

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[RPG Server] Listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
