import React from 'react';
import { LandingNavbar } from '../components/landing/LandingNavbar';
import { ScrollytellingHome } from '../components/landing/ScrollytellingHome';
import { LandingFooter } from '../components/landing/LandingFooter';

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-primary flex flex-col transition-colors">
      <LandingNavbar />
      <main className="flex-1">
        <ScrollytellingHome />
      </main>
      <LandingFooter />
    </div>
  );
};
