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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { HelpCircle, X } from 'lucide-react';
import { toast } from 'sonner';

const Home: React.FC = () => {
  const { state, dispatch } = useGame();
  const [cityName, setCityName] = React.useState(state.cityName);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  useEffect(() => {
    setCityName(state.cityName);
  }, [state.cityName]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCityName(e.target.value);
  };

  const saveName = () => {
    if (cityName.trim()) {
      dispatch({ type: 'SET_CITY_NAME', name: cityName.trim() });
      toast.success(`City renamed to "${cityName.trim()}"!`);
    } else {
      toast.error('City name cannot be empty!');
    }
  };

  const closeGuide = () => {
    setIsGuideOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <Header />
      <main className="container max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* City Name Input */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <Input
                value={cityName}
                onChange={handleNameChange}
                placeholder="Enter your city name (e.g., Neo-Tokyo)"
                className="max-w-sm flex-1"
              />
              <Button onClick={saveName}>Save City Name</Button>
            </div>
            <p className="text-sm text-gray-500 mt-2">Your city's name appears in the resources panel!</p>
          </CardContent>
        </Card>

        {/* Enhanced Guide Button */}
        <Card className="flex items-center justify-between p-6">
          <div className="flex items-center space-x-2">
            <HelpCircle className="h-5 w-5 text-blue-600" />
            <span className="font-medium">Need help? Click for a complete guide!</span>
          </div>
          <Dialog open={isGuideOpen} onOpenChange={setIsGuideOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">Open Guide</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span>🏙️ City Builder Guide - How to Play</span>
                  <Button variant="ghost" size="sm" onClick={closeGuide}>
                    <X className="h-4 w-4" />
                  </Button>
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-6 text-sm leading-relaxed">
                <div>
                  <h3 className="font-bold text-lg mb-2">1. Getting Started</h3>
                  <ul className="space-y-2 list-disc list-inside text-gray-700">
                    <li><strong>Resources:</strong> You start with $500 money and 200 materials. Watch the top-right panel for your current resources (👥 Population, 💰 Money, 🛠️ Materials).</li>
                    <li><strong>City Name:</strong> Enter and save a name for your city in the input above. It shows in your resources display!</li>
                    <li><strong>Grid:</strong> The large area in the center is your 20x20 city grid. Each white square (tile) is a buildable spot. Coordinates like (0,0) are shown in the bottom-right of empty tiles.</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">2. Building Your City</h3>
                  <ul className="space-y-2 list-disc list-inside text-gray-700">
                    <li><strong>Select a Building:</strong> On the right sidebar, click any building in the "Building Menu" (e.g., 🏠 Basic House). It shows cost (💰 Money + 🛠️ Materials) and what it produces.</li>
                    <li><strong>Preview & Place:</strong> Hover over the grid to see a blue preview. Click an empty white tile to place it. If you can't afford it, a toast message will explain why.</li>
                    <li><strong>Visual Feedback:</strong> Placed buildings turn green with their icon (e.g., 🏠). You can't place on occupied tiles.</li>
                    <li><strong>Tip:</strong> Start with cheap buildings like Basic House (🏠) to grow population, then add shops (🏪) for money.</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">3. Managing Resources</h3>
                  <ul className="space-y-2 list-disc list-inside text-gray-700">
                    <li><strong>Production:</strong> Every 5 seconds, your buildings automatically produce resources (e.g., houses add population, shops add money). A toast notification confirms each cycle!</li>
                    <li><strong>Upgrades:</strong> Below the grid, see your buildings in "Upgrades". Click "Upgrade" if you have enough money – it boosts production (e.g., x1.5 or x2 multiplier). Max level 2.</li>
                    <li><strong>Totals:</strong> The resources panel shows lifetime totals (e.g., Total Money Earned) for achievements.</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">4. Day/Night & Achievements</h3>
                  <ul className="space-y-2 list-disc list-inside text-gray-700">
                    <li><strong>Day/Night Cycle:</strong> Every 30 seconds, the grid changes color (Day: light/blue-green, Night: dark/purple-blue). It doesn't affect gameplay but adds atmosphere!</li>
                    <li><strong>Achievements:</strong> Unlock milestones automatically (e.g., "First Settlement" for your first building). They give bonus resources and boost your score. Check the Achievements page.</li>
                    <li><strong>Score:</strong> Earn points from buildings, upgrades, and achievements. Higher score = better leaderboard rank!</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">5. Navigation & More</h3>
                  <ul className="space-y-2 list-disc list-inside text-gray-700">
                    <li><strong>Pages:</strong> Use the top navigation: Leaderboards (see top cities), Achievements (track progress), Upgrades (manage buildings).</li>
                    <li><strong>Saving:</strong> Your progress auto-saves to browser storage. Refresh to continue where you left off!</li>
                    <li><strong>Tips for Success:</strong> Balance residential (population) → commercial (money) → industrial (materials). Build parks (🌳) for happiness bonuses. Avoid running out of power (⚡)!</li>
                    <li><strong>Grid View Fixed:</strong> Tiles are now larger (20x20px) with borders, subtle grid lines, and hover previews. Scroll if needed. No more 'one color box' – each tile is individual!</li>
                  </ul>
                </div>
                <div className="pt-4 border-t text-center text-blue-600">
                  <p>Build your dream city! If stuck, check toasts for feedback or reopen this guide. 🎮</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </Card>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <GameBoard />
            <UpgradesList />
          </div>
          <div className="space-y-6 sticky top-4 self-start">
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