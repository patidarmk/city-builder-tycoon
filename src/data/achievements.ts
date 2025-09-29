export interface Achievement {
  id: number;
  name: string;
  description: string;
  condition: string;
  icon: string;
  reward: { money?: number; materials?: number; population?: number };
  unlocked: boolean;
}

export const achievements: Achievement[] = [
  {
    id: 1,
    name: "First Settlement",
    description: "Place your first building and establish the foundation of your city.",
    condition: "Place 1 building",
    icon: "🏗️",
    reward: { money: 50 },
    unlocked: false
  },
  {
    id: 2,
    name: "Growing Population",
    description: "Reach a population of 50 residents through housing developments.",
    condition: "Population >= 50",
    icon: "👥",
    reward: { materials: 100 },
    unlocked: false
  },
  {
    id: 3,
    name: "Economic Boom",
    description: "Generate 1000 in total money from commercial buildings.",
    condition: "Total money earned >= 1000",
    icon: "💰",
    reward: { money: 200 },
    unlocked: false
  },
  {
    id: 4,
    name: "Industrial Might",
    description: "Produce 500 materials to fuel your city's expansion.",
    condition: "Total materials produced >= 500",
    icon: "🔧",
    reward: { materials: 150 },
    unlocked: false
  },
  {
    id: 5,
    name: "Urban Sprawl",
    description: "Expand your city to cover 20 tiles with buildings.",
    condition: "Buildings placed >= 20",
    icon: "🏙️",
    reward: { money: 300 },
    unlocked: false
  },
  {
    id: 6,
    name: "Green City",
    description: "Build 5 parks to improve resident quality of life.",
    condition: "Parks built >= 5",
    icon: "🌿",
    reward: { population: 10 }, // Bonus population
    unlocked: false
  },
  {
    id: 7,
    name: "Power Surge",
    description: "Construct a power plant to energize your metropolis.",
    condition: "Power plants built >= 1",
    icon: "🔌",
    reward: { materials: 200 },
    unlocked: false
  },
  {
    id: 8,
    name: "Millionaire Mayor",
    description: "Accumulate 5000 in city funds through smart management.",
    condition: "Current money >= 5000",
    icon: "🏆",
    reward: { money: 1000 },
    unlocked: false
  }
];