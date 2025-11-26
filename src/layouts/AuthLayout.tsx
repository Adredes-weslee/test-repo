import React from 'react';

const DotsPattern = () => (
    <svg width="80" height="80" className="absolute top-8 right-8 text-white/20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="pattern-circles" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse">
          <circle id="pattern-circle" cx="4" cy="4" r="1.5" fill="currentColor"/>
        </pattern>
      </defs>
      <rect width="80" height="80" fill="url(#pattern-circles)"/>
    </svg>
);
  
export const AuthLayout: React.FC<{ 
  children: React.ReactNode;
  title: string;
  subtitle: string;
}> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-full h-screen bg-white grid md:grid-cols-2 overflow-hidden">
        {/* Left Decorative Panel */}
        <div className="relative bg-primary p-12 text-white hidden md:flex flex-col justify-center overflow-hidden">
          {/* Abstract background shapes */}
          <div 
            className="absolute bottom-0 left-0 w-full h-1/2 bg-no-repeat bg-cover opacity-75"
            style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3e%3cpath fill='%23ffffff' fill-opacity='0.1' d='M0,224L48,229.3C96,235,192,245,288,218.7C384,192,480,128,576,133.3C672,139,768,213,864,213.3C960,213,1056,139,1152,122.7C1248,107,1344,149,1392,170.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3e%3c/path%3e%3c/svg%3e")` }}
          />
          <div 
            className="absolute top-0 right-0 w-full h-1/2 bg-no-repeat bg-cover opacity-75"
            style={{ transform: 'scaleX(-1) rotate(180deg)', backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3e%3cpath fill='%23ffffff' fill-opacity='0.1' d='M0,224L48,229.3C96,235,192,245,288,218.7C384,192,480,128,576,133.3C672,139,768,213,864,213.3C960,213,1056,139,1152,122.7C1248,107,1344,149,1392,170.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3e%3c/path%3e%3c/svg%3e")` }}
          />
          <DotsPattern />
          <div className="absolute top-12 left-12 w-8 h-8 border-2 border-white/50 rounded-full animate-pulse"></div>
          <div className="absolute bottom-12 left-1/4 w-4 h-4 bg-white/50 rounded-full animate-pulse delay-500"></div>

          <div className="z-10">
            <h2 className="text-4xl font-bold mb-3">{title}</h2>
            <p className="text-primary-lighter max-w-sm">{subtitle}</p>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
          {children}
        </div>
      </div>
    </div>
  );
};
