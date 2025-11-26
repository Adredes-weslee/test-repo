
import React from 'react';
import { Generation, Lesson, Goal, Rocket as Project } from '../../../components/icons';
import { Collapsible, Button } from '../../../components/ui';
import type { Curriculum } from '../../../types';
import { getDifficultyClasses, isDifficultyTag } from '../../../utils';

const Section: React.FC<{
  icon: React.ElementType;
  title: string;
  items: string[];
}> = ({ icon: Icon, title, items }) => {
    if (!items || items.length === 0) return null;
    const titleNode = (
        <div className="flex items-center space-x-3">
            <Icon className="w-5 h-5 text-primary" />
            <span className="font-semibold text-slate-700">{title}{items.length === 1 ? '' : ` (${items.length})`}</span>
        </div>
    );
    return (
        <Collapsible
            title={titleNode}
            containerClassName="border-b border-slate-200 last:border-b-0"
            headerClassName="w-full flex justify-between items-center py-3 text-left"
            contentClassName="pt-2 pb-4 text-sm text-slate-600"
            defaultOpen={true}
        >
            <ul className="space-y-1.5 list-disc list-outside marker:text-slate-400 pl-8">
                {items.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
        </Collapsible>
    );
};

export const CurriculumDetailView: React.FC<{ curriculum: Curriculum | undefined; onGenerate: (curriculum: Curriculum) => void; }> = ({ curriculum, onGenerate }) => {
    if (!curriculum) return null;

    const difficultyTag = curriculum.tags.find(isDifficultyTag);
    const otherTags = curriculum.tags.filter(tag => !isDifficultyTag(tag));
    const sortedTags = difficultyTag ? [difficultyTag, ...otherTags] : curriculum.tags;

    const regularLessons = curriculum.content.lessons;
    const capstoneProjects = curriculum.content.capstoneProjects || [];

    return (
        <div className="w-full lg:w-[420px] bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex-shrink-0 sticky top-24 animate-fadeIn">
            <h3 className="text-xl font-bold text-slate-800 mb-2">{curriculum.title}</h3>
            <p className="text-sm text-slate-600 mb-4">{curriculum.description}</p>
            <div className="flex flex-wrap gap-2 mb-6">
                {sortedTags.map((tag: string) => <span key={tag} className={`text-xs font-medium px-2.5 py-1 rounded-md ${isDifficultyTag(tag) ? getDifficultyClasses(tag) : 'bg-slate-100 text-slate-600'}`}>{tag}</span>)}
            </div>

            <Button onClick={() => onGenerate(curriculum)} icon={Generation} className="w-full mb-6">
                Use this Curriculum & Generate
            </Button>

            <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-450px)] pr-2">
                <Section title="Learning Outcomes" items={curriculum.learningOutcomes} icon={Goal} />
                <Section title="Lessons" items={regularLessons} icon={Lesson} />
                <Section title="Possible Capstone Projects" items={capstoneProjects} icon={Project} />
            </div>
        </div>
    );
};
