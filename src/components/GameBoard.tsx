"use client";

import React, { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { buildingTypes } from '@/data/buildings';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ZoomIn, ZoomOut, Map } from 'lucide-react';

interface TileProps {
  x: number;
  y: number;
  onClick: (x: number, y: number) => void;
  hasBuilding: boolean;
  buildingIcon?: string;
  isSelected?: boolean;
  zoomLevel: number;
}

const Tile: React.FC<TileProps> = ({ x, y, onClick, hasBuilding, buildingIcon, isSelected, zoomLevel }) => (
  <div
    className={cn(
      `w-${zoomLevel * 2} h-${zoomLevel * 2} border border-gray-300 flex items-center justify-center cursor-pointer transition-all duration-300 relative overflow-hidden shadow-sm`,
      hasBuilding ? 'bg-green-200 border-green-500 shadow-md' : 'bg-gradient-to-br from-green-100 to-emerald-100 hover:bg-green-200',
      isSelected && 'ring-4 ring-blue-500 bg-blue-100 shadow-lg scale-105',
      x === 0 || y === 0 || x === 11 || y === 11 ? 'border-gray-600 bg-yellow-100' : '', // Border tiles as 'roads'
      // Game-like texture
      'bg-[url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23f0f9ff\' fill-opacity=\'0.4\'%3E%3Ccircle cx=\'10\' cy=\'10\' r=\'1\'/%3E%3C/g%3E%3C/svg%3E")]'
    )}
    style={{ transform: `scale(${zoomLevel})` }}
    onClick={() => onClick(x, y)}
    title={hasBuilding ? `Building at (${x}, ${y})` : `Empty land - Click to build at (${x}, ${y})`}
  >
    <span className={`text-${zoomLevel > 1 ? '3xl' : '2xl'} drop-shadow-lg`}>{buildingIcon || '🌿'}</span>
    {/* Coordinate overlay for learning */}
    {!hasBuilding && !isSelected && (
      <div className="absolute bottom-0 right-0 text-xs text-gray-600 bg-white/80 px-1 rounded-tl">
        {x},{y}
      </div>
    )}
  </div>
);

const GameBoard: React.FC = () => {
  const { state, dispatch } = useGame();
  const { buildings, selectedBuildingType, gridSize, isDay } = state;
  const [hoveredTile, setHoveredTile] = useState<{x: number; y: number} | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1.2); // Start slightly zoomed for better visibility

  const handleTileClick = (x: number, y: number) => {
    if (selectedBuildingType) {
      const occupied = buildings.some(b => b.x === x && b.y === y);
      if (!occupied) {
        const type = buildingTypes.find(b => b.id === selectedBuildingType);
        if (type) {
          dispatch({ type: 'PLACE_BUILDING', buildingTypeId: selectedBuildingType, x, y });
          toast.success(`Built ${type.name} at (${x}, ${y})! 🎉`);
          dispatch({ type: 'SELECT_BUILDING', buildingTypeId: null });
        }
      } else {
        toast.warning(`(${x}, ${y}) is already built on! Try another spot.`);
      }
    } else {
      toast.info('First, select a building from the right menu! 🏗️');
    }
  };

  const handleMouseEnter = (x: number, y: number) => {
    if (selectedBuildingType) setHoveredTile({ x, y });
  };

  const handleMouseLeave = () => {
    setHoveredTile(null);
  };

  const placedBuildings = React.useMemo(() => {
    const map: { [key: string]: string } = {};
    buildings.forEach(b => {
      map[`${b.x}-${b.y}`] = b.type.icon;
    });
    return map;
  }, [buildings]);

  const selectedType = selectedBuildingType ? buildingTypes.find(b => b.id === selectedBuildingType) : null;

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.2, 2));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.2, 0.8));

  // Calculate grid dimensions with zoom
  const tileSize = 24 * zoomLevel; // Base 24px scaled
  const totalWidth = gridSize.width * tileSize + (gridSize.width * 2); // + gaps
  const totalHeight = gridSize.height * tileSize + (gridSize.height * 2);

  return (
    <Card className="w-full h-[700px] relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-900">
      <CardContent className="p-4 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Map className="h-6 w-6 text-green-600" />
            <h2 className="text-2xl font-bold text-gray-800">Your City Grid</h2>
            <span className="text-sm text-gray-500 bg-white/50 px-2 py-1 rounded">{gridSize.width}x{gridSize.height} tiles</span>
          </div>
          <div className="flex items-center space-x-2">
            {selectedType && (
              <div className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                {selectedType.name} ready!
              </div>
            )}
            <div className="flex space-x-1">
              <Button variant="outline" size="sm" onClick={handleZoomOut} disabled={zoomLevel <= 0.8}>
                <ZoomOut className="h-3 w-3" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleZoomIn} disabled={zoomLevel >= 2}>
                <ZoomIn className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
        <div 
          className={cn(
            'flex-1 grid gap-2 p-4 overflow-auto rounded-lg border-2 border-green-200',
            `grid-cols-${gridSize.width}`,
            isDay 
              ? 'bg-[url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'%3E%3Crect width=\'100\' height=\'100\' fill=\'%23f0fdf4\'/%3E%3Ccircle cx=\'50\' cy=\'50\' r=\'2\' fill=\'%23bef264\'/%3E%3C/svg%3E")]' 
              : 'bg-[url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'%3E%3Crect width=\'100\' height=\'100\' fill=\'%231a202c\'/%3E%3Ccircle cx=\'50\' cy=\'50\' r=\'3\' fill=\'%234a5568\'/%3E%3C/svg%3E")]'
          )}
          style={{ 
            backgroundSize: `${tileSize}px ${tileSize}px`,
            backgroundRepeat: 'repeat'
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
                className="relative flex justify-center items-center"
                onMouseEnter={() => handleMouseEnter(x, y)}
                onMouseLeave={handleMouseLeave}
              >
                <Tile
                  x={x}
                  y={y}
                  onClick={handleTileClick}
                  hasBuilding={!!placedBuildings[key]}
                  buildingIcon={placedBuildings[key]}
                  isSelected={isHovered && !!selectedBuildingType}
                  zoomLevel={zoomLevel}
                />
                {isHovered && selectedBuildingType && (
                  <div className="absolute inset-0 bg-blue-400/40 rounded-lg border-4 border-blue-600 pointer-events-none flex items-center justify-center shadow-2xl">
                    <span className="text-white text-lg font-bold">BUILD HERE!</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="p-4 border-t bg-white/80 backdrop-blur-sm mt-2 rounded-b-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
            <div className="text-sm text-gray-700 space-y-1">
              {selectedType ? (
                <div>
                  <strong>Place {selectedType.name}:</strong> Cost 💰{selectedType.cost.money} | 🛠️{selectedType.cost.materials} | Produces {Object.entries(selectedType.production).map(([k,v]) => `${k}+${v}`).join(', ')}
                </div>
              ) : (
                <div><strong>How to Play:</strong> 1️⃣ Pick a building from the right menu. 2️⃣ Hover grid for preview. 3️⃣ Click empty green tile to build! Watch resources grow every 5s.</div>
              )}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => toast.info('Guide: Select building → Hover → Click!')}
              className="flex-shrink-0"
            >
              Quick Tip
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameBoard;