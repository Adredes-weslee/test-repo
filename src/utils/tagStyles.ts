export const getDifficultyClasses = (difficulty: string): string => {
  switch (difficulty?.toLowerCase()) {
    case 'beginner':
      return 'bg-green-100 text-green-800';
    case 'intermediate':
      return 'bg-sky-100 text-sky-800';
    case 'advanced':
      return 'bg-primary-lighter text-primary-text';
    default:
      return 'bg-slate-100 text-slate-600';
  }
};

export const isDifficultyTag = (tag: string) => ['beginner', 'intermediate', 'advanced'].includes(tag.toLowerCase());