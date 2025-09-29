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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { HelpCircle, X, PlayCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const Home: React.FC = () => {
  const { state, dispatch } = useGame();
  const [cityName, setCityName] = React.useState(state.cityName);
  const [tutorialStep, setTutorialStep] = useState(0); // 0 = not started, 1-5 steps
  const [isTutorialActive, setIsTutorialActive] = useState(true); // Auto-start tutorial
  const steps = [
    { title: "Welcome! Name Your City", icon: "🏙️", description: "Enter a name for your growing metropolis. This shows in your resources!", complete: false },
    { title: "Pick Your First Building", icon: "🏗️", description: "Click 'Basic House' in the right menu. It's cheap and adds people to your city!", complete: false },
    { title: "Build on the Grid", icon: "🟩", description: "With house selected, hover the green tiles (your land). Click an empty one to place it! See the blue preview?", complete: false },
    { title: "Watch Resources Grow", icon: "💰", description: "Wait 5 seconds – your house will add population! Check the top-right panel. Buildings work automatically.", complete: false },
    { title: "You're Building! 🎉", icon: "🏆", description: "Great job! Now explore: Upgrade buildings, unlock achievements, or check leaderboards. Click 'Next' for more tips.", complete: false }
  ];

  useEffect(() => {
    setCityName(state.cityName);
  }, [state.cityName]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCityName(e.target.value);
  };

  const saveName = () => {
    if (cityName.trim()) {
      dispatch({ type: 'SET_CITY_NAME', name: cityName.trim() });
      toast.success(`Welcome to ${cityName.trim()}! Let's build!`);
      if (tutorialStep === 0) setTutorialStep(1); // Advance tutorial
    } else {
      toast.error('Give your city a cool name first!');
    }
  };

  const completeStep = (step: number) => {
    steps[step].complete = true;
    setTutorialStep(step + 1);
    toast.success(`Step ${step + 1} complete! 👏`);
    if (step + 1 >= steps.length) {
      setIsTutorialActive(false);
      toast(`Tutorial done! Your city is ready. Build away! 🚀`);
    }
  };

  // Simulate step completion based on game state (e.g., first building placed)
  useEffect(() => {
    if (state.totalBuildingsPlaced >= 1 && tutorialStep < 3) {
      completeStep(2);
    }
  }, [state.totalBuildingsPlaced]);

  const skipTutorial = () => {
    setIsTutorialActive(false);
    setTutorialStep(steps.length);
  };

  if (isTutorialActive && tutorialStep < steps.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-green-50">
        <Header />
        <main className="container max-w-6xl mx-auto px-4 py-8">
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-8 text-center">
              <PlayCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-4">{steps[tutorialStep].title}</h2>
              <p className="text-lg text-gray-700 mb-6">{steps[tutorialStep].description}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                {tutorialStep === 0 && (
                  <Input
                    value={cityName}
                    onChange={handleNameChange}
                    placeholder="e.g., Neo-City"
                    className="max-w-sm"
                  />
                )}
                <Button size="lg" onClick={tutorialStep === 0 ? saveName : () => completeStep(tutorialStep)} className="flex items-center space-x-2">
                  {tutorialStep === 0 ? 'Save & Next' : 'Got It! Next'}
                </Button>
                <Button variant="ghost" onClick={skipTutorial} size="sm">
                  Skip Tutorial
                </Button>
              </div>
              {tutorialStep > 0 && (
                <div className="mt-6 text-sm text-gray-500">
                  Progress: {tutorialStep + 1} / {steps.length} steps
                </div>
              )}
            </CardContent>
          </Card>
          {/* Show game partially during tutorial */}
          {tutorialStep >= 1 && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-8 opacity-50">
              <div className="lg:col-span-3"><GameBoard /></div>
              <div className="space-y-6"><ResourceDisplay /><BuildingMenu /></div>
            </div>
          )}
        </main>
      </div>
    );
  }

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

        {/* Tutorial Complete Banner */}
        {!isTutorialActive && (
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-800">Tutorial Complete! Your city is ready to grow. 🌆</span>
              </div>
              <Button variant="outline" size="sm" onClick={() => setIsTutorialActive(true)}>
                Review Guide
              </Button>
            </CardContent>
          </Card>
        )}

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