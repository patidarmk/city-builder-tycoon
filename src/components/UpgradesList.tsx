"use client";

import React from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const UpgradesList: React.FC = () => {
  const { state, dispatch } = useGame();
  const { buildings, resources } = state;

  const handleUpgrade = (buildingId: string) => {
    dispatch({ type: 'UPGRADE_BUILDING', buildingId });
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
        <CardTitle>Upgrades</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {buildings.map(building => {
          const nextLevel = building.level + 1;
          const upgradeCost = building.type.upgradeLevels?.[nextLevel - 1]?.cost || 0;
          const canUpgrade = nextLevel <= 2 && resources.money >= upgradeCost;
          return (
            <div key={building.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-xl">{building.type.icon}</span>
                <div>
                  <div className="font-medium">{building.type.name}</div>
                  <div className="text-sm text-gray-600">Level {building.level}</div>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="outline" className="mb-1">x{building.type.upgradeLevels?.[building.level - 1]?.multiplier || 1}</Badge>
                <Button
                  size="sm"
                  variant={canUpgrade ? 'default' : 'secondary'}
                  onClick={() => canUpgrade && handleUpgrade(building.id)}
                  disabled={!canUpgrade}
                >
                  Upgrade (Level {nextLevel}) - 💰{upgradeCost}
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