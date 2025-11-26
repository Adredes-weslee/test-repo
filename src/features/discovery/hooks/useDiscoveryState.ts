import { useState } from 'react';
import type { DiscoveryType } from '../../../types';
import { discoveryFilters, industries } from '../../../config';

export type ViewState = 'idle' | 'loading' | 'results';

const initialFilters = discoveryFilters.reduce((acc, filter) => {
  const defaultOption = filter.options.find(opt => opt.default) || filter.options[0];
  acc[filter.id] = defaultOption.value;
  return acc;
}, {} as { [key: string]: string });

const defaultIndustry = industries.find(i => i.default) || industries[0];

export const useDiscoveryState = () => {
  const [discoveryType, setDiscoveryType] = useState<DiscoveryType>('project');
  const [searchValue, setSearchValue] = useState('');
  const [view, setView] = useState<ViewState>('idle');
  const [progress, setProgress] = useState(0);
  const [filters, setFilters] = useState(initialFilters);
  const [selectedIndustry, setSelectedIndustry] = useState(defaultIndustry.value);

  const handleFilterChange = (filterId: string, value: string) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterId]: value,
    }));
  };

  const handleIndustryChange = (industry: string) => {
    setSelectedIndustry(industry);
  };

  const resetDiscoveryState = () => {
      setSearchValue('');
      setSelectedIndustry(defaultIndustry.value);
      setView('idle');
      setProgress(0);
  };

  return {
    discoveryType, setDiscoveryType,
    searchValue, setSearchValue,
    view, setView,
    progress, setProgress,
    filters, handleFilterChange,
    selectedIndustry, handleIndustryChange,
    resetDiscoveryState
  };
};
