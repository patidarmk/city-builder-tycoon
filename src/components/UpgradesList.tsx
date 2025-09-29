"use client";

import React from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const UpgradesList: React.FC = () => {
  const { state, dispatch } = useGame();
  const { buildings, resources } = state;

  const handleUpgrade = (buildingId: string) => {
    const building = buildings.find(b => b.id === buildingId);
    if (building) {
      const nextLevel = building.level + 1;
      const upgradeCost = building.type.upgradeLevels?.[nextLevel - 1]?.cost || 0;
      if (nextLevel <= 2 && resources.money >= upgradeCost) {
        dispatch({ type: 'UPGRADE_BUILDING', buildingId });
        toast.success(`${building.type.name} upgraded to level ${nextLevel}! Production increased.`);
      } else {
        toast.error('Cannot upgrade: Max level or insufficient money!');
      }
    }
  };

  if (buildings.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-gray-500">
          No buildings to upgrade yet. Place some buildings first!
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upgrades ({buildings.length} buildings)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 max-h-96 overflow-y-auto">
        {buildings.map(building => {
          const nextLevel = building.level + 1;
          const upgradeCost = building.type.upgradeLevels?.[nextLevel - 1]?.cost || 0;
          const currentMult = building.type.upgradeLevels?.[building.level - 1]?.multiplier || 1;
          const nextMult = building.type.upgradeLevels?.[nextLevel - 1]?.multiplier || currentMult;
          const canUpgrade = nextLevel <= 2 && resources.money >= upgradeCost;
          return (
            <div key={building.id} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
              <div className="flex items-center space-x-3 flex-1">
                <span className="text-xl">{building.type.icon}</span>
                <div className="min-w-0 flex-1">
                  <div className="font-medium truncate">{building.type.name}</div>
                  <div className="text-sm text-gray-600">Level {building.level} at ({building.x}, {building.y})</div>
                  <div className="text-xs text-gray-500">Production: x{currentMult}</div>
                </div>
              </div>
              <div className="text-right space-y-1">
                <Badge variant="outline" className="text-xs">Next: x{nextMult}</Badge>
                <Button
                  size="sm"
                  variant={canUpgrade ? 'default' : 'secondary'}
                  onClick={() => handleUpgrade(building.id)}
                  disabled={!canUpgrade}
                  className="w-full"
                >
                  Upgrade Lv.{nextLevel} - 💰{upgradeCost}
                </Button>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default UpgradesList;