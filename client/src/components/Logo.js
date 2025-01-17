import React from 'react';

const Logo = () => {
  return (
    <div className="w-full flex justify-center items-center">
      <a 
        href="https://www.snhu.edu" 
        target="_blank" 
        rel="noopener noreferrer"
        className="block mb-6"
      >
        <img 
          src="/assets/grazioso-logo.png"
          alt="Grazioso Salvare Logo"
          className="h-[250px] object-contain"
        />
      </a>
    </div>
  );
};

export default Logo;
