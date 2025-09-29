"use client";

import React from 'react';
import Header from '@/components/Header';
import UpgradesList from '@/components/UpgradesList';
import BuildingMenu from '@/components/BuildingMenu';
import { MadeWithApplaa } from '@/components/made-with-applaa';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { Link, useNavigate } from '@tanstack/react-router';

const Upgrades: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800">
      <Header />
      <main className="container max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate({ to: '/' })} className="mb-4">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Game
          </Button>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink>Upgrades</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-3xl font-bold mb-6">Manage Upgrades</h1>
            <p className="text-gray-600 mb-6">Upgrade your buildings to increase efficiency and production.</p>
            <UpgradesList />
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Available Buildings</h2>
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

export default Upgrades;