import React from 'react';
import { Header } from './Header';
import { Outlet } from 'react-router-dom';

export const OnboardingLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Outlet />
    </div>
  );
}; 