export interface LeaderboardEntry {
  id: number;
  cityName: string;
  playerName: string;
  score: number;
  population: number;
  size: number;
  rank: number;
  avatar: string;
}

export const leaderboardData: LeaderboardEntry[] = [
  {
    id: 1,
    cityName: "Neo-Tokyo",
    playerName: "Alex Rivera",
    score: 12500,
    population: 1500,
    size: 150,
    rank: 1,
    avatar: "https://picsum.photos/64/64?random=1"
  },
  {
    id: 2,
    cityName: "Emerald City",
    playerName: "Jordan Lee",
    score: 11800,
    population: 1200,
    size: 120,
    rank: 2,
    avatar: "https://picsum.photos/64/64?random=2"
  },
  {
    id: 3,
    cityName: "Silicon Valleyburg",
    playerName: "Taylor Kim",
    score: 11200,
    population: 1100,
    size: 110,
    rank: 3,
    avatar: "https://picsum.photos/64/64?random=3"
  },
  {
    id: 4,
    cityName: "Riverdale Heights",
    playerName: "Casey Morgan",
    score: 9800,
    population: 900,
    size: 95,
    rank: 4,
    avatar: "https://picsum.photos/64/64?random=4"
  },
  {
    id: 5,
    cityName: "Sunset Metropolis",
    playerName: "Riley Patel",
    score: 9200,
    population: 850,
    size: 88,
    rank: 5,
    avatar: "https://picsum.photos/64/64?random=5"
  },
  {
    id: 6,
    cityName: "Ironforge",
    playerName: "Morgan Quinn",
    score: 8500,
    population: 750,
    size: 75,
    rank: 6,
    avatar: "https://picsum.photos/64/64?random=6"
  },
  {
    id: 7,
    cityName: "Greenhaven",
    playerName: "Drew Ellis",
    score: 7800,
    population: 700,
    size: 70,
    rank: 7,
    avatar: "https://picsum.photos/64/64?random=7"
  },
  {
    id: 8,
    cityName: "Skyline City",
    playerName: "Jamie Torres",
    score: 7200,
    population: 650,
    size: 65,
    rank: 8,
    avatar: "https://picsum.photos/64/64?random=8"
  },
  {
    id: 9,
    cityName: "Harbor Town",
    playerName: "Sam Novak",
    score: 6800,
    population: 600,
    size: 60,
    rank: 9,
    avatar: "https://picsum.photos/64/64?random=9"
  },
  {
    id: 10,
    cityName: "Mountain View",
    playerName: "Chris Lopez",
    score: 6500,
    population: 550,
    size: 55,
    rank: 10,
    avatar: "https://picsum.photos/64/64?random=10"
  },
  {
    id: 11,
    cityName: "Desert Oasis",
    playerName: "Pat Garcia",
    score: 6200,
    population: 500,
    size: 50,
    rank: 11,
    avatar: "https://picsum.photos/64/64?random=11"
  },
  {
    id: 12,
    cityName: "Coastal Breeze",
    playerName: "Lee Wong",
    score: 5800,
    population: 450,
    size: 45,
    rank: 12,
    avatar: "https://picsum.photos/64/64?random=12"
  }
];