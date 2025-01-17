import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-indigo-600">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <span className="text-white font-semibold text-lg">
              Grazioso Salvare
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;