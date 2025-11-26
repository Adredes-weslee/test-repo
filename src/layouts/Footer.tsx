import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 fixed bottom-0 left-0 right-0 z-30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center text-sm text-slate-500">
          <p>&copy; 2023 Elice Creator AI. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:underline">Help</a>
            <a href="#" className="hover:underline">Privacy</a>
            <a href="#" className="hover:underline">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
