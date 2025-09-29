"use client";

import React from 'react';
import { useGame } from '@/contexts/GameContext';
import { buildingTypes } from '@/data/buildings';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface TileProps {
  x: number;
  y: number;
  onClick: (x: number, y: number) => void;
  hasBuilding: boolean;
  buildingIcon?: string;
}

const Tile: React.FC<TileProps> = ({ x, y, onClick, hasBuilding, buildingIcon }) => (
  <div
    className={cn(
      'w-8 h-8 border border-gray-300 flex items-center justify-center cursor-pointer transition-colors',
      hasBuilding ? 'bg-green-100' : 'bg-white hover:bg-gray-50',
      x === 0 || y === 0 || x === 19 || y === 19 ? 'border-gray-400' : ''
    )}
    onClick={() => onClick(x, y)}
  >
    {buildingIcon || ''}
  </div>
);

const GameBoard: React.FC = () => {
  const { state, dispatch } = useGame();
  const { buildings, selectedBuildingType, gridSize, isDay } = state;

  const handleTileClick = (x: number, y: number) => {
    if (selectedBuildingType) {
      // Check if tile is occupied
      const occupied = buildings.some(b => b.x === x && b.y === y);
      if (!occupied) {
        dispatch({ type: 'PLACE_BUILDING', buildingTypeId: selectedBuildingType, x, y });
      }
    }
  };

  const placedBuildings = React.useMemo(() => {
    const map = new Map<string, string>();
    buildings.forEach(b => {
      map.set(`${b.x}-${b.y}`, b.type.icon);
    });
    return map;
  }, [buildings]);

  return (
    <Card className="w-full h-[600px] relative overflow-hidden">
      <CardContent className="p-0 h-full flex flex-col">
        <div className={cn(
          'flex-1 grid gap-0',
          `grid-cols-${gridSize.width} grid-rows-${gridSize.height}`,
          isDay ? 'bg-gradient-to-br from-blue-200 to-green-200' : 'bg-gradient-to-br from-purple-900 to-blue-900'
        )}>
          {Array.from({ length: gridSize.width * gridSize.height }).map((_, i) => {
            const x = i % gridSize.width;
            const y = Math.floor(i / gridSize.width);
            const key = `${x}-${y}`;
            return (
              <Tile
                key={key}
                x={x}
                y={y}
                onClick={handleTileClick}
                hasBuilding={placedBuildings.has(key)}
                buildingIcon={placedBuildings.get(key)}
              />
            );
          })}
        </div>
        <div className="p-4 border-t bg-white/50">
          <p className="text-sm text-gray-600">
            Click on a tile to place the selected building. Grid: {gridSize.width}x{gridSize.height}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameBoard;