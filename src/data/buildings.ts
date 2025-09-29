export interface BuildingType {
  id: number;
  name: string;
  description: string;
  cost: { money: number; materials: number };
  production: { population?: number; money?: number; materials?: number };
  size: { width: number; height: number };
  icon: string;
  category: 'residential' | 'commercial' | 'industrial' | 'utility';
  upgradeLevels?: Array<{ level: number; cost: number; multiplier: number }>;
}

export const buildingTypes: BuildingType[] = [
  {
    id: 1,
    name: "Basic House",
    description: "A cozy single-family home that provides housing for 5 residents, generating a steady population growth for your city.",
    cost: { money: 100, materials: 50 },
    production: { population: 5 },
    size: { width: 1, height: 1 },
    icon: "🏠",
    category: 'residential',
    upgradeLevels: [
      { level: 1, cost: 200, multiplier: 1.5 },
      { level: 2, cost: 500, multiplier: 2.0 }
    ]
  },
  {
    id: 2,
    name: "Apartment Building",
    description: "Multi-unit residential tower housing up to 20 families, ideal for dense urban areas with high population density.",
    cost: { money: 500, materials: 200 },
    production: { population: 20 },
    size: { width: 2, height: 2 },
    icon: "🏢",
    category: 'residential',
    upgradeLevels: [
      { level: 1, cost: 800, multiplier: 1.5 },
      { level: 2, cost: 1500, multiplier: 2.0 }
    ]
  },
  {
    id: 3,
    name: "Small Shop",
    description: "A neighborhood convenience store that sells daily essentials, providing a reliable income stream from local commerce.",
    cost: { money: 200, materials: 100 },
    production: { money: 10 },
    size: { width: 1, height: 1 },
    icon: "🏪",
    category: 'commercial',
    upgradeLevels: [
      { level: 1, cost: 300, multiplier: 1.5 },
      { level: 2, cost: 600, multiplier: 2.0 }
    ]
  },
  {
    id: 4,
    name: "Shopping Mall",
    description: "Large retail complex attracting shoppers from across the city, boosting economy with high-volume sales and jobs.",
    cost: { money: 1000, materials: 400 },
    production: { money: 50 },
    size: { width: 3, height: 2 },
    icon: "🛒",
    category: 'commercial',
    upgradeLevels: [
      { level: 1, cost: 1500, multiplier: 1.5 },
      { level: 2, cost: 2500, multiplier: 2.0 }
    ]
  },
  {
    id: 5,
    name: "Factory",
    description: "Industrial manufacturing plant producing construction materials essential for city expansion and building projects.",
    cost: { money: 300, materials: 150 },
    production: { materials: 15 },
    size: { width: 2, height: 2 },
    icon: "🏭",
    category: 'industrial',
    upgradeLevels: [
      { level: 1, cost: 500, multiplier: 1.5 },
      { level: 2, cost: 1000, multiplier: 2.0 }
    ]
  },
  {
    id: 6,
    name: "Steel Mill",
    description: "Advanced heavy industry facility specializing in steel production, enabling larger infrastructure developments.",
    cost: { money: 800, materials: 300 },
    production: { materials: 40 },
    size: { width: 3, height: 3 },
    icon: "🔥",
    category: 'industrial',
    upgradeLevels: [
      { level: 1, cost: 1200, multiplier: 1.5 },
      { level: 2, cost: 2000, multiplier: 2.0 }
    ]
  },
  {
    id: 7,
    name: "Power Plant",
    description: "Essential utility generating electricity to power all buildings, preventing blackouts and enabling growth.",
    cost: { money: 600, materials: 250 },
    production: { materials: 0 }, // Utility, no direct production but required
    size: { width: 2, height: 2 },
    icon: "⚡",
    category: 'utility',
    upgradeLevels: [
      { level: 1, cost: 900, multiplier: 1.5 },
      { level: 2, cost: 1800, multiplier: 2.0 }
    ]
  },
  {
    id: 8,
    name: "Park",
    description: "Green space for recreation, improving resident happiness and slightly boosting population retention.",
    cost: { money: 150, materials: 75 },
    production: { population: 2 },
    size: { width: 2, height: 1 },
    icon: "🌳",
    category: 'utility',
    upgradeLevels: [
      { level: 1, cost: 250, multiplier: 1.5 },
      { level: 2, cost: 500, multiplier: 2.0 }
    ]
  }
];