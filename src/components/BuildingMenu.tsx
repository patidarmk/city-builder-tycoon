"use client";

import React from 'react';
import { useGame } from '@/contexts/GameContext';
import { buildingTypes } from '@/data/buildings';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const BuildingMenu: React.FC = () => {
  const { state, dispatch } = useGame();
  const { selectedBuildingType, resources } = state;

  const handleSelect = (typeId: number) => {
    const type = buildingTypes.find(b => b.id === typeId);
    if (type) {
      if (resources.money >= type.cost.money && resources.materials >= type.cost.materials) {
        dispatch({ type: 'SELECT_BUILDING', buildingTypeId: typeId });
        toast.info(`${type.name} selected! Click on the grid to place it.`);
      } else {
        toast.error(`Cannot select ${type.name}: Insufficient resources!`);
      }
    }
  };

  const handleClearSelection = () => {
    dispatch({ type: 'SELECT_BUILDING', buildingTypeId: null });
    toast.info('Building selection cleared.');
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <span>🏗️ Building Menu</span>
          </CardTitle>
          {selectedBuildingType && (
            <Button variant="outline" size="sm" onClick={handleClearSelection}>
              Clear
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {buildingTypes.map(type => {
          const isSelected = selectedBuildingType === type.id;
          const canAfford = resources.money >= type.cost.money && resources.materials >= type.cost.materials;
          return (
            <div key={type.id} className="space-y-2">
              <Button
                variant={isSelected ? 'default' : 'outline'}
                className={cn(
                  'w-full justify-start space-x-3 p-3',
                  !canAfford && 'opacity-50 cursor-not-allowed'
                )}
                onClick={() => handleSelect(type.id)}
                disabled={!canAfford}
              >
                <span className="text-xl">{type.icon}</span>
                <div className="flex-1 text-left">
                  <div className="font-medium">{type.name}</div>
                  <div className="text-xs text-gray-600">{type.category}</div>
                  <div className="text-xs text-gray-500">
                    💰 {type.cost.money} | 🛠️ {type.cost.materials}
                  </div>
                </div>
                {isSelected && <Badge variant="secondary" className="ml-auto">Selected</Badge>}
              </Button>
              {!canAfford && (
                <div className="text-xs text-red-500 text-center">
                  Need: 💰{type.cost.money - resources.money} more money, 🛠️{type.cost.materials - resources.materials} more materials
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default BuildingMenu;