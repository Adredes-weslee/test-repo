import type { DiscoveryFilter } from '../../types';

export const discoveryFilters: DiscoveryFilter[] = [
  {
    id: 'difficulty',
    label: 'Difficulty Level',
    type: 'select',
    promptTemplate: 'Each curriculum must be specifically designed for a "{value}" level.',
    options: [
      { value: 'any', label: 'Any Difficulty', default: true },
      { value: 'Beginner', label: 'Beginner' },
      { value: 'Intermediate', label: 'Intermediate' },
      { value: 'Advanced', label: 'Advanced' },
    ],
  },
  {
    id: 'numLessons',
    label: 'Number of Lessons',
    type: 'select',
    promptTemplate: 'The curriculum must contain {value} lessons.',
    options: [
      { value: 'any', label: 'Any Number', default: true },
      { value: 'small', label: '3 - 5 lessons', promptValue: 'between 3 and 5' },
      { value: 'medium', label: '6 - 8 lessons', promptValue: 'between 6 and 8' },
      { value: 'large', label: '9+ lessons', promptValue: '9 or more' },
    ],
  },
];
