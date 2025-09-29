"use client";

import React from 'react';
import { useGame } from '@/contexts/GameContext';
import { buildingTypes } from '@/data/buildings';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Info } from 'lucide-react';

const BuildingMenu: React.FC = () => {
  const { state, dispatch } = useGame();
  const { selectedBuildingType, resources } = state;

  const handleSelect = (typeId: number) => {
    const type = buildingTypes.find(b => b.id === typeId);
    if (type) {
      if (resources.money >= type.cost.money && resources.materials >= type.cost.materials) {
        dispatch({ type: 'SELECT_BUILDING', buildingTypeId: typeId });
        toast.success(`${type.name} selected! Now click a green tile on the grid to build. 🟩`);
      } else {
        toast.error(`Need more resources for ${type.name}! 💰$${type.cost.money - resources.money} | 🛠️${type.cost.materials - resources.materials}`);
      }
    }
  };

  const handleClearSelection = () => {
    dispatch({ type: 'SELECT_BUILDING', buildingTypeId: null });
    toast.info('Ready to select a new building!');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <span>🏗️ Build Your City</span>
          </CardTitle>
          {selectedBuildingType && (
            <Button variant="outline" size="sm" onClick={handleClearSelection}>
              Clear Selection
            </Button>
          )}
        </div>
        <p className="text-sm text-gray-600">Click a building below. It shows what it costs and produces!</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {buildingTypes.map(type => {
          const isSelected = selectedBuildingType === type.id;
          const canAfford = resources.money >= type.cost.money && resources.materials >= type.cost.materials;
          const productionText = Object.entries(type.production).map(([k, v]) => `${k}: +${v}`).join(', ');
          return (
            <div key={type.id} className="space-y-2 border rounded-lg p-3 bg-white/50">
              <Button
                variant={isSelected ? 'default' : canAfford ? 'outline' : 'secondary'}
                className={cn(
                  'w-full justify-start space-x-4 p-4 text-left transition-all',
                  isSelected && 'shadow-lg ring-2 ring-blue-500',
                  !canAfford && 'opacity-60 cursor-not-allowed'
                )}
                onClick={() => handleSelect(type.id)}
                disabled={!canAfford}
                size="lg"
              >
                <span className="text-3xl">{type.icon}</span>
                <div className="flex-1">
                  <div className="font-bold text-lg">{type.name}</div>
                  <div className="text-sm text-gray-600">{type.description.split(' - ')[0]}</div> {/* Short desc */}
                  <div className="text-xs text-green-600 mt-1">Produces: {productionText}</div>
                  <div className="text-xs text-gray-500 mt-1">Cost: 💰{type.cost.money} 🛠️{type.cost.materials}</div>
                </div>
                {isSelected && <Badge variant="destructive" className="ml-auto">Ready to Build!</Badge>}
                {!canAfford && <Badge variant="secondary" className="ml-auto">Can't Afford Yet</Badge>}
              </Button>
              {!canAfford && (
                <div className="text-xs text-red-500 text-center p-2 bg-red-50 rounded">
                  Earn more: Build shops for money, factories for materials!
                </div>
              )}
              <Button variant="ghost" size="sm" className="w-full justify-start text-xs" onClick={() => toast.info(type.description)}>
                <Info className="h-3 w-3 mr-1" /> More Info
              </Button>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default BuildingMenu;