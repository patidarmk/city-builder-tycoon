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
      'w-20 h-20 border border-gray-300 flex items-center justify-center cursor-pointer transition-all duration-200 relative overflow-hidden',
      hasBuilding ? 'bg-green-100 border-green-400 shadow-sm' : 'bg-white hover:bg-gray-50',
      isSelected && 'ring-4 ring-blue-500 bg-blue-50 shadow-md',
      x === 0 || y === 0 || x === 19 || y === 19 ? 'border-gray-500' : 'border-gray-200',
      // Subtle grid pattern to avoid solid color look
      'bg-gradient-to-r from-transparent via-white/50 to-transparent'
    )}
    onClick={() => onClick(x, y)}
    title={hasBuilding ? `Building placed at (${x}, ${y})` : `Empty tile - Click to place at (${x}, ${y})`}
  >
    <span className="text-2xl drop-shadow-sm">{buildingIcon || ''}</span>
    {/* Coordinate label for debugging/understanding */}
    {!hasBuilding && !isSelected && (
      <div className="absolute bottom-0 right-0 text-xs text-gray-400 bg-black/20 px-1">
        {x},{y}
      </div>
    )}
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
          toast.success(`${type.name} placed at (${x}, ${y})!`);
          // Deselect after placement
          dispatch({ type: 'SELECT_BUILDING', buildingTypeId: null });
        }
      } else {
        toast.error(`Tile (${x}, ${y}) already occupied!`);
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

  // Calculate total grid height for better scrolling
  const totalGridHeight = gridSize.height * 20; // 20px per tile height

  return (
    <Card className="w-full h-[800px] relative overflow-hidden"> {/* Increased height for better view */}
      <CardContent className="p-4 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">City Grid ({gridSize.width}x{gridSize.height})</h2>
          {selectedType && (
            <div className="text-sm text-blue-600 font-medium">
              Selected: {selectedType.name} 
              {hoveredTile && (
                <span className="ml-2 bg-blue-100 px-2 py-1 rounded text-xs">
                  Preview at ({hoveredTile.x}, {hoveredTile.y})
                </span>
              )}
            </div>
          )}
        </div>
        <div 
          className={cn(
            'flex-1 grid gap-1 overflow-auto p-2', // Added small gap and padding for visible separation
            `grid-cols-${gridSize.width}`,
            isDay 
              ? 'bg-gradient-to-br from-blue-50 via-green-50 to-indigo-50' 
              : 'bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-indigo-900/20'
          )}
          style={{ 
            // Ensure smooth scrolling and prevent solid color
            maxHeight: `${totalGridHeight + 20}px`, // + padding
            backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)',
            backgroundSize: '20px 20px' // Match tile size
          }}
        >
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
                  <div className="absolute inset-0 bg-blue-500/30 rounded-lg border-2 border-blue-500 pointer-events-none flex items-center justify-center shadow-lg">
                    <span className="text-blue-800 text-sm font-medium">Place Here</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="p-4 border-t bg-white/50 mt-2 text-sm">
          <p className="text-gray-600">
            {selectedType ? (
              <>
                <strong>Ready to place:</strong> {selectedType.name} 
                <br />
                <strong>Cost:</strong> 💰 {selectedType.cost.money} | 🛠️ {selectedType.cost.materials} 
                <br />
                <strong>Produces:</strong> {Object.entries(selectedType.production).map(([k, v]) => `${k}: ${v}`).join(', ')}
              </>
            ) : (
              '👆 Select a building from the right menu, then click an empty tile here to place it. Hover to preview!'
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameBoard;