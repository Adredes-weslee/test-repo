
export type DiscoveryType = 'course' | 'project';

export interface FilterOption {
  value: string;
  label: string;
  promptValue?: string;
  default?: boolean;
}

export type FilterId = 'difficulty' | 'numLessons';

export interface DiscoveryFilter {
  id: FilterId;
  label: string;
  type: 'select';
  options: FilterOption[];
  promptTemplate: string;
}
