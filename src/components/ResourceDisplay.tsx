"use client";

import React from 'react';
import { useGame } from '@/contexts/GameContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const ResourceDisplay: React.FC = () => {
  const { state } = useGame();
  const { resources, score, cityName, isDay, buildings } = state;

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span>{cityName}</span>
          <Badge variant={isDay ? 'default' : 'secondary'}>{isDay ? 'Day' : 'Night'}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-2xl font-bold text-green-600">👥 {resources.population}</div>
            <div className="text-xs text-gray-500">Population</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-600">💰 {resources.money}</div>
            <div className="text-xs text-gray-500">Money</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">🛠️ {resources.materials}</div>
            <div className="text-xs text-gray-500">Materials</div>
          </div>
        </div>
        <div className="pt-4 border-t">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Score</span>
            <span className="text-lg font-bold">{score}</span>
          </div>
          <div className="text-sm text-gray-500 mt-1">Buildings: {buildings.length}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResourceDisplay;