"use client";

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import GameBoard from '@/components/GameBoard';
import BuildingMenu from '@/components/BuildingMenu';
import ResourceDisplay from '@/components/ResourceDisplay';
import UpgradesList from '@/components/UpgradesList';
import { MadeWithApplaa } from '@/components/made-with-applaa';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGame } from '@/contexts/GameContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const Home: React.FC = () => {
  const { state, dispatch } = useGame();
  const [cityName, setCityName] = React.useState(state.cityName);
  const [showInstructions, setShowInstructions] = useState(true);

  useEffect(() => {
    setCityName(state.cityName);
  }, [state.cityName]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCityName(e.target.value);
  };

  const saveName = () => {
    if (cityName.trim()) {
      dispatch({ type: 'SET_CITY_NAME', name: cityName.trim() });
      toast.success(`City renamed to ${cityName.trim()}!`);
    } else {
      toast.error('City name cannot be empty!');
    }
  };

  const dismissInstructions = () => {
    setShowInstructions(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <Header />
      <main className="container max-w-7xl mx-auto px-4 py-8 space-y-8">
        {showInstructions && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">How to Play</h3>
                <Button variant="ghost" size="sm" onClick={dismissInstructions}>×</Button>
              </div>
              <ul className="space-y-2 text-sm text-gray-700 list-disc list-inside">
                <li>Select a building from the menu on the right.</li>
                <li>Click on an empty tile on the grid to place it (if you have enough resources).</li>
                <li>Buildings produce resources every 5 seconds. Upgrade them for better output.</li>
                <li>Day/night cycle affects visuals. Unlock achievements for bonuses!</li>
                <li>Check leaderboards and other pages via navigation.</li>
              </ul>
            </CardContent>
          </Card>
        )}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <Input
                value={cityName}
                onChange={handleNameChange}
                placeholder="Enter your city name"
                className="max-w-sm flex-1"
              />
              <Button onClick={saveName}>Save Name</Button>
            </div>
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <GameBoard />
            <UpgradesList />
          </div>
          <div className="space-y-6">
            <ResourceDisplay />
            <BuildingMenu />
          </div>
        </div>
      </main>
      <footer className="border-t bg-white/50 backdrop-blur-sm mt-8">
        <div className="container max-w-7xl mx-auto px-4 py-4">
          <MadeWithApplaa />
        </div>
      </footer>
    </div>
  );
};

export default Home;