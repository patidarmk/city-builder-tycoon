"use client";

import React from 'react';
import Header from '@/components/Header';
import GameBoard from '@/components/GameBoard';
import BuildingMenu from '@/components/BuildingMenu';
import ResourceDisplay from '@/components/ResourceDisplay';
import UpgradesList from '@/components/UpgradesList';
import { MadeWithApplaa } from '@/components/made-with-applaa';
import { Card, CardContent } from '@/components/ui/card';
import { useGame } from '@/contexts/GameContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Home: React.FC = () => {
  const { state, dispatch } = useGame();
  const [cityName, setCityName] = React.useState(state.cityName);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCityName(e.target.value);
  };

  const saveName = () => {
    dispatch({ type: 'SET_CITY_NAME', name: cityName });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800">
      <Header />
      <main className="container max-w-7xl mx-auto px-4 py-8 space-y-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4 mb-4">
              <Input
                value={cityName}
                onChange={handleNameChange}
                placeholder="Enter your city name"
                className="max-w-sm"
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
      <footer className="border-t bg-white/50 mt-8">
        <div className="container max-w-7xl mx-auto px-4 py-4">
          <MadeWithApplaa />
        </div>
      </footer>
    </div>
  );
};

export default Home;