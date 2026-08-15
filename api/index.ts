type ApiRequest = any;
type ApiResponse = any;

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

let inMemoryLeaderboard: LeaderboardEntry[] = [
  {
    id: "leg-1",
    name: "Eldrin el sabio",
    heroClass: "Mago",
    level: 75,
    score: 95500,
    zone: "Sagrario de los Antiguos",
    bossesDefeated: 8,
    playTimeMinutes: 520,
    date: "2026-08-15",
  },
  {
    id: "leg-2",
    name: "Valeria la Brava",
    heroClass: "Guerrero",
    level: 68,
    score: 78000,
    zone: "El Vórtice del Vacío",
    bossesDefeated: 7,
    playTimeMinutes: 440,
    date: "2026-08-14",
  },
  {
    id: "leg-3",
    name: "ShadowK",
    heroClass: "Pícaro",
    level: 56,
    score: 52000,
    zone: "Ciudadela Imperial",
    bossesDefeated: 6,
    playTimeMinutes: 320,
    date: "2026-08-13",
  },
  {
    id: "leg-4",
    name: "Aria Shield",
    heroClass: "Paladín",
    level: 46,
    score: 38000,
    zone: "Picos Helados Frostfall",
    bossesDefeated: 5,
    playTimeMinutes: 240,
    date: "2026-08-12",
  },
  {
    id: "leg-5",
    name: "Ignis Slayer",
    heroClass: "Berserker",
    level: 38,
    score: 24000,
    zone: "Volcán Ancestral",
    bossesDefeated: 4,
    playTimeMinutes: 180,
    date: "2026-08-11",
  },
];

export default function handler(req: ApiRequest, res: ApiResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    const sorted = [...inMemoryLeaderboard].sort((a, b) => b.score - a.score).slice(0, 50);
    return res.status(200).json({
      success: true,
      leaderboard: sorted,
      totalEntries: inMemoryLeaderboard.length,
    });
  }

  if (req.method === 'POST') {
    const { name, heroClass, level, score, zone, bossesDefeated, playTimeMinutes } = req.body || {};

    if (!name || score === undefined) {
      return res.status(400).json({ success: false, error: 'Faltan campos requeridos.' });
    }

    const newEntry: LeaderboardEntry = {
      id: `entry-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: String(name).slice(0, 20),
      heroClass: String(heroClass || 'Guerrero'),
      level: Number(level) || 1,
      score: Number(score) || 0,
      zone: String(zone || 'Bosque Verde'),
      bossesDefeated: Number(bossesDefeated) || 0,
      playTimeMinutes: Number(playTimeMinutes) || 1,
      date: new Date().toISOString().split('T')[0],
    };

    inMemoryLeaderboard.push(newEntry);
    const sorted = [...inMemoryLeaderboard].sort((a, b) => b.score - a.score).slice(0, 50);

    return res.status(200).json({
      success: true,
      message: 'Puntuación registrada con éxito.',
      newEntry,
      leaderboard: sorted,
    });
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
