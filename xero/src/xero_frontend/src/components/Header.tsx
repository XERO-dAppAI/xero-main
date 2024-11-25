import React from 'react';
import xeroLogo from '../assets/xero.png';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto p-4 flex items-center">
        <img src={xeroLogo} alt="Xero Logo" className="h-12 w-auto" />
        <p className="ml-4 text-xl font-semibold text-primary">
          Xero Platform
        </p>
      </div>
    </header>
  );
};

export default Header; 