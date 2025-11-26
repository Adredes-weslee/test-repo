import React from 'react';
import Header from './Header';
import Tabs from './Tabs';
import Footer from './Footer';

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9FA]">
      <Header />
      <div className="flex-grow pt-16 flex flex-col"> {/* Offset for fixed header */}
        <div className="sticky top-16 z-20 bg-[#F8F9FA]">
          <div className="container mx-auto px-4 pt-4 sm:px-6 lg:px-8">
            <Tabs />
          </div>
        </div>
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 ">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};
