import React from 'react';
import { Library as LibraryIcon, Sparkles, TrendingUp } from '../components/icons/index';
import type { TabName } from '../types';
import { useNavigationStore } from '../store';

interface TabProps {
  icon: React.ElementType;
  label: TabName;
  active?: boolean;
  onClick: () => void;
}

const Tab: React.FC<TabProps> = ({ icon: Icon, label, active = false, onClick }) => {
  const activeClasses = 'border-primary text-primary';
  const inactiveClasses = 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300';
  
  return (
    <button onClick={onClick} className={`flex items-center space-x-2 px-3 py-2 border-b-2 text-sm font-medium ${active ? activeClasses : inactiveClasses}`}>
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </button>
  );
};

const TABS: { label: TabName, icon: React.ElementType }[] = [
    { label: 'Trending', icon: TrendingUp },
    { label: 'Generation', icon: Sparkles },
    { label: 'Library', icon: LibraryIcon },
];

const Tabs: React.FC = () => {
  const activeTab = useNavigationStore((state) => state.activeTab);
  const setActiveTab = useNavigationStore((state) => state.setActiveTab);
  
  return (
    <div className="border-b border-slate-200">
      <nav className="-mb-px flex space-x-4" aria-label="Tabs">
        {TABS.map((tab) => (
            <Tab 
                key={tab.label}
                icon={tab.icon} 
                label={tab.label} 
                active={activeTab === tab.label}
                onClick={() => setActiveTab(tab.label)}
            />
        ))}
      </nav>
    </div>
  );
};

export default Tabs;