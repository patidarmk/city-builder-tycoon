"use client";

import React, { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { buildingTypes } from '@/data/buildings';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

interface TileProps {
  x: number;
  y: number;
  onClick: (x: number, y: number) => void;
  hasBuilding: boolean;
  buildingIcon?: string;
  isSelected?: boolean;
}

const Tile: React.FC<TileProps> = ({ x, y, onClick, hasBuilding, buildingIcon, isSelected }) => (
  <div
    className={cn(
      'w-10 h-10 border border-gray-300 flex items-center justify-center cursor-pointer transition-all duration-200',
      hasBuilding ? 'bg-green-100 border-green-400' : 'bg-white hover:bg-gray-50',
      isSelected && 'ring-2 ring-blue-500 bg-blue-50',
      x === 0 || y === 0 || x === 19 || y === 19 ? 'border-gray-400' : ''
    )}
    onClick={() => onClick(x, y)}
    title={hasBuilding ? 'Building placed' : 'Click to place'}
  >
    <span className="text-lg">{buildingIcon || ''}</span>
  </div>
);

const GameBoard: React.FC = () => {
  const { state, dispatch } = useGame();
  const { buildings, selectedBuildingType, gridSize, isDay } = state;
  const [hoveredTile, setHoveredTile] = useState<{x: number; y: number} | null>(null);

  const handleTileClick = (x: number, y: number) => {
    if (selectedBuildingType) {
      const occupied = buildings.some(b => b.x === x && b.y === y);
      if (!occupied) {
        const type = buildingTypes.find(b => b.id === selectedBuildingType);
        if (type) {
          dispatch({ type: 'PLACE_BUILDING', buildingTypeId: selectedBuildingType, x, y });
          toast.success(`${type.name} placed successfully!`);
          // Deselect after placement
          dispatch({ type: 'SELECT_BUILDING', buildingTypeId: null });
        }
      } else {
        toast.error('Tile already occupied!');
      }
    }
  };

  const handleMouseEnter = (x: number, y: number) => {
    if (selectedBuildingType) setHoveredTile({ x, y });
  };

  const handleMouseLeave = () => {
    setHoveredTile(null);
  };

  const placedBuildings = React.useMemo(() => {
    const map = new Map<string, string>();
    buildings.forEach(b => {
      map.set(`${b.x}-${b.y}`, b.type.icon);
    });
    return map;
  }, [buildings]);

  const selectedType = selectedBuildingType ? buildingTypes.find(b => b.id === selectedBuildingType) : null;

  return (
    <Card className="w-full h-[700px] relative overflow-hidden">
      <CardContent className="p-4 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">City Grid</h2>
          {selectedType && (
            <div className="text-sm text-blue-600">
              Selected: {selectedType.name} {hoveredTile && `at (${hoveredTile.x}, ${hoveredTile.y})`}
            </div>
          )}
        </div>
        <div className={cn(
          'flex-1 grid gap-0 overflow-auto',
          `grid-cols-${gridSize.width}`,
          isDay ? 'bg-gradient-to-br from-blue-100 to-green-100' : 'bg-gradient-to-br from-purple-800 to-blue-800'
        )}>
          {Array.from({ length: gridSize.width * gridSize.height }).map((_, i) => {
            const x = i % gridSize.width;
            const y = Math.floor(i / gridSize.width);
            const key = `${x}-${y}`;
            const isHovered = hoveredTile !== null && hoveredTile.x === x && hoveredTile.y === y;
            return (
              <div
                key={key}
                className="relative"
                onMouseEnter={() => handleMouseEnter(x, y)}
                onMouseLeave={handleMouseLeave}
              >
                <Tile
                  x={x}
                  y={y}
                  onClick={handleTileClick}
                  hasBuilding={placedBuildings.has(key)}
                  buildingIcon={placedBuildings.get(key)}
                  isSelected={isHovered && !!selectedBuildingType}
                />
                {isHovered && selectedBuildingType && (
                  <div className="absolute inset-0 bg-blue-500/20 rounded border-2 border-blue-500 pointer-events-none flex items-center justify-center">
                    <span className="text-blue-700 text-sm">Preview</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="p-4 border-t bg-white/50 mt-2">
          <p className="text-sm text-gray-600">
            {selectedType ? `Select a tile to place ${selectedType.name}. Cost: 💰${selectedType.cost.money} 🛠️${selectedType.cost.materials}` : 'Select a building from the menu to start building.'} Grid: {gridSize.width}x{gridSize.height}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameBoard;