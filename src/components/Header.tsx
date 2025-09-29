"use client";

import * as React from 'react';
import { Link, useRouter } from '@tanstack/react-router';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Menu, Home, Trophy, Star, Settings } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const Header: React.FC = () => {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-xl border-b border-gray-200/50 shadow-lg">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4">
        <Link to="/" className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-lg">🏙️</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            City Builder
          </span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className={cn(
            "flex items-center space-x-2 text-sm font-medium transition-colors hover:text-blue-600",
            router.state.matches.some(m => m.route.path === '/') ? 'text-blue-600' : 'text-gray-700'
          )}>
            <Home className="h-4 w-4" />
            <span>Home</span>
          </Link>
          <Link to="/leaderboards" className={cn(
            "flex items-center space-x-2 text-sm font-medium transition-colors hover:text-blue-600",
            router.state.matches.some(m => m.route.path === '/leaderboards') ? 'text-blue-600' : 'text-gray-700'
          )}>
            <Trophy className="h-4 w-4" />
            <span>Leaderboards</span>
          </Link>
          <Link to="/achievements" className={cn(
            "flex items-center space-x-2 text-sm font-medium transition-colors hover:text-blue-600",
            router.state.matches.some(m => m.route.path === '/achievements') ? 'text-blue-600' : 'text-gray-700'
          )}>
            <Star className="h-4 w-4" />
            <span>Achievements</span>
          </Link>
          <Link to="/upgrades" className={cn(
            "flex items-center space-x-2 text-sm font-medium transition-colors hover:text-blue-600",
            router.state.matches.some(m => m.route.path === '/upgrades') ? 'text-blue-600' : 'text-gray-700'
          )}>
            <Settings className="h-4 w-4" />
            <span>Upgrades</span>
          </Link>
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="pr-0">
            <nav className="flex flex-col gap-4 mt-8">
              <Link to="/" className="flex items-center space-x-2 text-base font-medium text-gray-700 hover:text-blue-600">
                <Home className="h-5 w-5" />
                <span>Home</span>
              </Link>
              <Link to="/leaderboards" className="flex items-center space-x-2 text-base font-medium text-gray-700 hover:text-blue-600">
                <Trophy className="h-5 w-5" />
                <span>Leaderboards</span>
              </Link>
              <Link to="/achievements" className="flex items-center space-x-2 text-base font-medium text-gray-700 hover:text-blue-600">
                <Star className="h-5 w-5" />
                <span>Achievements</span>
              </Link>
              <Link to="/upgrades" className="flex items-center space-x-2 text-base font-medium text-gray-700 hover:text-blue-600">
                <Settings className="h-5 w-5" />
                <span>Upgrades</span>
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;