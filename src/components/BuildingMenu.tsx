"use client";

import React from 'react';
import { useGame } from '@/contexts/GameContext';
import { buildingTypes } from '@/data/buildings';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const BuildingMenu: React.FC = () => {
  const { state, dispatch } = useGame();
  const { selectedBuildingType, resources } = state;

  const handleSelect = (typeId: number) => {
    dispatch({ type: 'SELECT_BUILDING', buildingTypeId: typeId });
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>🏗️ Building Menu</span>
          {selectedBuildingType && (
            <Badge variant="secondary" className="ml-auto">
              Selected
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {buildingTypes.map(type => {
          const isSelected = selectedBuildingType === type.id;
          const canAfford = resources.money >= type.cost.money && resources.materials >= type.cost.materials;
          return (
            <Button
              key={type.id}
              variant={isSelected ? 'default' : 'outline'}
              className={cn(
                'w-full justify-start space-x-3 p-3',
                !canAfford && 'opacity-50 cursor-not-allowed'
              )}
              onClick={() => canAfford && handleSelect(type.id)}
              disabled={!canAfford}
            >
              <span className="text-lg">{type.icon}</span>
              <div className="flex-1 text-left">
                <div className="font-medium">{type.name}</div>
                <div className="text-sm text-gray-600">{type.description.substring(0, 60)}...</div>
                <div className="text-xs text-gray-500 mt-1">
                  💰 {type.cost.money} | 🛠️ {type.cost.materials}
                </div>
              </div>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default BuildingMenu;