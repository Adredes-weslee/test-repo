import React from 'react';
import type { Curriculum } from '../../../types';
import { getDifficultyClasses, isDifficultyTag } from '../../../utils';
import { Modification } from '../../../components/icons';

interface CurriculumConfigProps {
    curriculum: Curriculum;
    onNewGeneration: () => void;
}

export const CurriculumConfig: React.FC<CurriculumConfigProps> = ({ curriculum, onNewGeneration }) => {
    const difficulty = curriculum.tags.find(isDifficultyTag) || 'N/A';

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-800">Details</h2>
                <button 
                    onClick={onNewGeneration} 
                    className="text-slate-400 hover:text-slate-800 transition-colors p-1 rounded-full" 
                    aria-label="Start over and clear configuration"
                >
                    <Modification className="w-5 h-5" />
                </button>
            </div>
            <div className="space-y-5">
                <div>
                    <p className="font-semibold text-slate-800">{curriculum.title}</p>
                    <p className="text-xs text-slate-500 mt-1">
                        {curriculum.content.lessons.length > 1
                            ? `Generating for all ${curriculum.content.lessons.length} lessons.`
                            : `Generating for 1 lesson.`
                        }
                    </p>
                </div>
                <div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-md ${getDifficultyClasses(difficulty)}`}>
                        {difficulty}
                    </span>
                </div>
            </div>
        </div>
    );
};
