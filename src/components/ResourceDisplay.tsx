"use client";

import React from 'react';
import { useGame } from '@/contexts/GameContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RefreshCw } from 'lucide-react';

const ResourceDisplay: React.FC = () => {
  const { state } = useGame();
  const { resources, score, cityName, isDay, buildings, totalMoneyEarned, totalMaterialsProduced, totalBuildingsPlaced } = state;

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{cityName}</CardTitle>
          <div className="flex items-center space-x-2">
            <RefreshCw className={`h-4 w-4 animate-spin ${isDay ? 'text-yellow-500' : 'text-purple-500'}`} />
            <Badge variant={isDay ? 'default' : 'secondary'}>{isDay ? 'Day' : 'Night'}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <div className="text-2xl font-bold text-green-600">👥 {resources.population.toLocaleString()}</div>
            <div className="text-xs text-gray-500">Population</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-yellow-600">💰 ${resources.money.toLocaleString()}</div>
            <div className="text-xs text-gray-500">Money (Total: ${totalMoneyEarned.toLocaleString()})</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-blue-600">🛠️ {resources.materials.toLocaleString()}</div>
            <div className="text-xs text-gray-500">Materials (Total: {totalMaterialsProduced.toLocaleString()})</div>
          </div>
        </div>
        <div className="pt-4 border-t space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Score</span>
            <span className="text-lg font-bold text-purple-600">{score.toLocaleString()}</span>
          </div>
          <div className="text-sm text-gray-500">Buildings: {totalBuildingsPlaced} | Active: {buildings.length}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResourceDisplay;