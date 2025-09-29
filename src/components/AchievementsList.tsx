"use client";

import React from 'react';
import { achievements } from '@/data/achievements';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useGame } from '@/contexts/GameContext';

const AchievementsList: React.FC = () => {
  const { state } = useGame();
  const { achievements: gameAchievements } = state;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Achievements</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {gameAchievements.map(ach => (
          <div key={ach.id} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center space-x-3">
              <span className="text-xl">{ach.icon}</span>
              <div>
                <div className="font-medium">{ach.name}</div>
                <div className="text-sm text-gray-600">{ach.description}</div>
                <div className="text-xs text-gray-500 mt-1">{ach.condition}</div>
              </div>
            </div>
            <Badge variant={ach.unlocked ? 'default' : 'secondary'}>
              {ach.unlocked ? 'Unlocked' : 'Locked'}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default AchievementsList;