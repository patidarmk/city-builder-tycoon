import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { buildingTypes, BuildingType } from '@/data/buildings';
import { achievements } from '@/data/achievements';
import type { Achievement } from '@/data/achievements';
import { toast } from 'sonner';

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
  totalMoneyEarned: number;
  totalMaterialsProduced: number;
  totalBuildingsPlaced: number;
  parksBuilt: number;
  powerPlantsBuilt: number;
}

type GameAction =
  | { type: 'PLACE_BUILDING'; buildingTypeId: number; x: number; y: number }
  | { type: 'UPGRADE_BUILDING'; buildingId: string }
  | { type: 'UPDATE_RESOURCES'; delta: Partial<GameState['resources']> }
  | { type: 'SELECT_BUILDING'; buildingTypeId: number | null }
  | { type: 'TOGGLE_DAY_NIGHT' }
  | { type: 'UNLOCK_ACHIEVEMENT'; achievementId: number }
  | { type: 'SET_CITY_NAME'; name: string }
  | { type: 'ADD_TO_TOTALS'; moneyEarned?: number; materialsProduced?: number; buildingsPlaced?: number; parks?: number; powerPlants?: number };

const initialState: GameState = {
  resources: { money: 500, population: 0, materials: 200 },
  buildings: [],
  selectedBuildingType: null,
  gridSize: { width: 20, height: 20 },
  isDay: true,
  achievements: achievements.map(a => ({ ...a, unlocked: false })),
  score: 0,
  cityName: 'My City',
  totalMoneyEarned: 0,
  totalMaterialsProduced: 0,
  totalBuildingsPlaced: 0,
  parksBuilt: 0,
  powerPlantsBuilt: 0
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

      const isPark = type.id === 8;
      const isPowerPlant = type.id === 7;

      return {
        ...state,
        buildings: [...state.buildings, newBuilding],
        resources: {
          ...state.resources,
          money: state.resources.money - type.cost.money,
          materials: state.resources.materials - type.cost.materials
        },
        totalBuildingsPlaced: state.totalBuildingsPlaced + 1,
        parksBuilt: isPark ? state.parksBuilt + 1 : state.parksBuilt,
        powerPlantsBuilt: isPowerPlant ? state.powerPlantsBuilt + 1 : state.powerPlantsBuilt,
        score: state.score + (type.production.money || 0) + (type.production.materials || 0) + (type.production.population || 0)
      };
    }
    case 'UPGRADE_BUILDING': {
      const building = state.buildings.find(b => b.id === action.buildingId);
      if (!building || building.level >= 2) return state;

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
        score: state.score + 100
      };
    }
    case 'UPDATE_RESOURCES': {
      const newResources = { ...state.resources, ...action.delta };
      return {
        ...state,
        resources: newResources,
        totalMoneyEarned: action.delta.money ? state.totalMoneyEarned + (action.delta.money > 0 ? action.delta.money : 0) : state.totalMoneyEarned,
        totalMaterialsProduced: action.delta.materials ? state.totalMaterialsProduced + (action.delta.materials > 0 ? action.delta.materials : 0) : state.totalMaterialsProduced
      };
    }
    case 'SELECT_BUILDING': {
      return { ...state, selectedBuildingType: action.buildingTypeId };
    }
    case 'TOGGLE_DAY_NIGHT': {
      return { ...state, isDay: !state.isDay };
    }
    case 'UNLOCK_ACHIEVEMENT': {
      if (state.achievements.find(a => a.id === action.achievementId)?.unlocked) return state;
      const achievement = state.achievements.find(a => a.id === action.achievementId);
      if (achievement?.reward) {
        toast.success(`Achievement Unlocked: ${achievement.name}! +${achievement.reward.money || achievement.reward.materials || achievement.reward.population || 0} bonus.`);
      }
      return {
        ...state,
        achievements: state.achievements.map(a =>
          a.id === action.achievementId ? { ...a, unlocked: true } : a
        ),
        score: state.score + 200,
        resources: {
          ...state.resources,
          ...(achievement?.reward?.money && { money: state.resources.money + achievement.reward.money }),
          ...(achievement?.reward?.materials && { materials: state.resources.materials + achievement.reward.materials }),
          ...(achievement?.reward?.population && { population: state.resources.population + achievement.reward.population })
        }
      };
    }
    case 'SET_CITY_NAME': {
      return { ...state, cityName: action.name };
    }
    case 'ADD_TO_TOTALS': {
      return {
        ...state,
        totalMoneyEarned: action.moneyEarned ? state.totalMoneyEarned + action.moneyEarned : state.totalMoneyEarned,
        totalMaterialsProduced: action.materialsProduced ? state.totalMaterialsProduced + action.materialsProduced : state.totalMaterialsProduced,
        totalBuildingsPlaced: action.buildingsPlaced ? state.totalBuildingsPlaced + action.buildingsPlaced : state.totalBuildingsPlaced,
        parksBuilt: action.parks ? state.parksBuilt + action.parks : state.parksBuilt,
        powerPlantsBuilt: action.powerPlants ? state.powerPlantsBuilt + action.powerPlants : state.powerPlantsBuilt
      };
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

  // Check achievements after state changes
  useEffect(() => {
    // First building
    if (state.totalBuildingsPlaced >= 1 && !state.achievements[0].unlocked) {
      dispatch({ type: 'UNLOCK_ACHIEVEMENT', achievementId: 1 });
    }
    // Population 50
    if (state.resources.population >= 50 && !state.achievements[1].unlocked) {
      dispatch({ type: 'UNLOCK_ACHIEVEMENT', achievementId: 2 });
    }
    // Money earned 1000
    if (state.totalMoneyEarned >= 1000 && !state.achievements[2].unlocked) {
      dispatch({ type: 'UNLOCK_ACHIEVEMENT', achievementId: 3 });
    }
    // Materials 500
    if (state.totalMaterialsProduced >= 500 && !state.achievements[3].unlocked) {
      dispatch({ type: 'UNLOCK_ACHIEVEMENT', achievementId: 4 });
    }
    // 20 buildings
    if (state.totalBuildingsPlaced >= 20 && !state.achievements[4].unlocked) {
      dispatch({ type: 'UNLOCK_ACHIEVEMENT', achievementId: 5 });
    }
    // 5 parks
    if (state.parksBuilt >= 5 && !state.achievements[5].unlocked) {
      dispatch({ type: 'UNLOCK_ACHIEVEMENT', achievementId: 6 });
    }
    // 1 power plant
    if (state.powerPlantsBuilt >= 1 && !state.achievements[6].unlocked) {
      dispatch({ type: 'UNLOCK_ACHIEVEMENT', achievementId: 7 });
    }
    // Money 5000
    if (state.resources.money >= 5000 && !state.achievements[7].unlocked) {
      dispatch({ type: 'UNLOCK_ACHIEVEMENT', achievementId: 8 });
    }
  }, [state.resources, state.totalBuildingsPlaced, state.totalMoneyEarned, state.totalMaterialsProduced, state.parksBuilt, state.powerPlantsBuilt]);

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
        toast.success('Production cycle complete! Resources updated.');
      }
    }, 5000);

    // Day/night cycle every 30 seconds
    const cycleInterval = setInterval(() => {
      dispatch({ type: 'TOGGLE_DAY_NIGHT' });
      toast.info(state.isDay ? 'Night falls...' : 'A new day begins!');
    }, 30000);

    return () => {
      clearInterval(interval);
      clearInterval(cycleInterval);
    };
  }, [state.buildings, state.isDay]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('cityBuilderSave');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        dispatch({ type: 'UPDATE_RESOURCES', delta: parsed.resources });
        if (parsed.buildings) {
          // Restore buildings (simplified)
          parsed.buildings.forEach((b: any) => {
            const type = buildingTypes.find(bt => bt.id === b.typeId);
            if (type) {
              dispatch({ type: 'PLACE_BUILDING', buildingTypeId: b.typeId, x: b.x, y: b.y });
            }
          });
        }
      } catch (e) {
        console.error('Failed to load save:', e);
      }
    }
  }, []);

  // Save to localStorage on state change
  useEffect(() => {
    localStorage.setItem('cityBuilderSave', JSON.stringify({
      resources: state.resources,
      buildings: state.buildings,
      achievements: state.achievements,
      score: state.score,
      cityName: state.cityName
    }));
  }, [state.resources, state.buildings, state.achievements, state.score, state.cityName]);

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