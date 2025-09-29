import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { buildingTypes, BuildingType } from '@/data/buildings';
import { achievements } from '@/data/achievements';
import type { Achievement } from '@/data/achievements';

interface PlacedBuilding {
  id: string;
  typeId: number;
  x: number;
  y: number;
  level: number;
  type: BuildingType;
}

interface GameState {
  resources: { money: number; population: number; materials: number };
  buildings: PlacedBuilding[];
  selectedBuildingType: number | null;
  gridSize: { width: number; height: number };
  isDay: boolean;
  achievements: Achievement[];
  score: number;
  cityName: string;
}

type GameAction =
  | { type: 'PLACE_BUILDING'; buildingTypeId: number; x: number; y: number }
  | { type: 'UPGRADE_BUILDING'; buildingId: string }
  | { type: 'UPDATE_RESOURCES'; delta: Partial<GameState['resources']> }
  | { type: 'SELECT_BUILDING'; buildingTypeId: number | null }
  | { type: 'TOGGLE_DAY_NIGHT' }
  | { type: 'UNLOCK_ACHIEVEMENT'; achievementId: number }
  | { type: 'SET_CITY_NAME'; name: string };

const initialState: GameState = {
  resources: { money: 500, population: 0, materials: 200 },
  buildings: [],
  selectedBuildingType: null,
  gridSize: { width: 20, height: 20 },
  isDay: true,
  achievements: achievements.map(a => ({ ...a, unlocked: false })),
  score: 0,
  cityName: 'My City'
};

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'PLACE_BUILDING': {
      const type = buildingTypes.find(b => b.id === action.buildingTypeId);
      if (!type || state.resources.money < type.cost.money || state.resources.materials < type.cost.materials) return state;

      const newBuilding: PlacedBuilding = {
        id: `b-${Date.now()}-${Math.random()}`,
        typeId: action.buildingTypeId,
        x: action.x,
        y: action.y,
        level: 1,
        type
      };

      return {
        ...state,
        buildings: [...state.buildings, newBuilding],
        resources: {
          ...state.resources,
          money: state.resources.money - type.cost.money,
          materials: state.resources.materials - type.cost.materials
        },
        score: state.score + (type.production.money || 0) + (type.production.materials || 0) + (type.production.population || 0)
      };
    }
    case 'UPGRADE_BUILDING': {
      const building = state.buildings.find(b => b.id === action.buildingId);
      if (!building || building.level >= 2) return state; // Max level 2 for simplicity

      const upgradeCost = building.type.upgradeLevels?.[building.level]?.cost || 0;
      if (state.resources.money < upgradeCost) return state;

      return {
        ...state,
        buildings: state.buildings.map(b =>
          b.id === action.buildingId ? { ...b, level: b.level + 1 } : b
        ),
        resources: {
          ...state.resources,
          money: state.resources.money - upgradeCost
        },
        score: state.score + 100 // Bonus for upgrade
      };
    }
    case 'UPDATE_RESOURCES': {
      return {
        ...state,
        resources: { ...state.resources, ...action.delta }
      };
    }
    case 'SELECT_BUILDING': {
      return { ...state, selectedBuildingType: action.buildingTypeId };
    }
    case 'TOGGLE_DAY_NIGHT': {
      return { ...state, isDay: !state.isDay };
    }
    case 'UNLOCK_ACHIEVEMENT': {
      return {
        ...state,
        achievements: state.achievements.map(a =>
          a.id === action.achievementId ? { ...a, unlocked: true } : a
        ),
        score: state.score + 200 // Bonus for achievement
      };
    }
    case 'SET_CITY_NAME': {
      return { ...state, cityName: action.name };
    }
    default:
      return state;
  }
};

const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
} | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Simulate resource production every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      let delta: Partial<GameState['resources']> = {};
      state.buildings.forEach(building => {
        const mult = building.type.upgradeLevels?.[building.level - 1]?.multiplier || 1;
        if (building.type.production.money) delta.money = (delta.money || 0) + (building.type.production.money * mult);
        if (building.type.production.materials) delta.materials = (delta.materials || 0) + (building.type.production.materials * mult);
        if (building.type.production.population) delta.population = (delta.population || 0) + (building.type.production.population * mult);
      });
      if (Object.keys(delta).length > 0) {
        dispatch({ type: 'UPDATE_RESOURCES', delta });
      }
    }, 5000);

    // Day/night cycle every 30 seconds
    const cycleInterval = setInterval(() => {
      dispatch({ type: 'TOGGLE_DAY_NIGHT' });
    }, 30000);

    // Load from localStorage
    const saved = localStorage.getItem('cityBuilderSave');
    if (saved) {
      const parsed = JSON.parse(saved);
      dispatch({ type: 'UPDATE_RESOURCES', delta: parsed.resources });
      // Note: For simplicity, not restoring full buildings/achievements here
    }

    return () => {
      clearInterval(interval);
      clearInterval(cycleInterval);
      // Save to localStorage
      localStorage.setItem('cityBuilderSave', JSON.stringify({ resources: state.resources }));
    };
  }, [state.resources]); // Re-run on resource change for save

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};