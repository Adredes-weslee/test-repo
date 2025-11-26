import React from 'react';
import { Rocket, Goal, Terminal, SquareCheckBig } from '../../../components/icons';
import { Collapsible, Button } from '../../../components/ui';
import { getDifficultyClasses, isDifficultyTag } from '../../../utils';
import type { CapstoneProject } from '../../../types';

const Section: React.FC<{
  icon: React.ElementType;
  title: string;
  items: string[];
}> = ({ icon: Icon, title, items }) => {
    if (!items || items.length === 0) return null;
    const titleNode = (
        <div className="flex items-center space-x-3">
            <Icon className="w-5 h-5 text-primary" />
            <span className="font-semibold text-slate-700">{title}</span>
        </div>
    );
    return (
        <Collapsible
            title={titleNode}
            containerClassName="border-b border-slate-200 last:border-b-0"
            headerClassName="w-full flex justify-between items-center py-3 text-left"
            contentClassName="pt-2 pb-4 pl-8 text-sm text-slate-600"
            defaultOpen={true}
        >
            <ul className="space-y-1.5 list-disc list-outside marker:text-slate-400">
                {items.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
        </Collapsible>
    );
};

export const ProjectDetailView: React.FC<{ project: CapstoneProject; onGenerate: () => void; }> = ({ project, onGenerate }) => {
    const difficultyTag = project.tags.find(isDifficultyTag) || 'Beginner';

    return (
        <div className="w-full lg:w-[420px] bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex-shrink-0 sticky top-24 animate-fadeIn">
            <h3 className="text-xl font-bold text-slate-800 mb-2">{project.title}</h3>
            <p className="text-sm text-slate-600 mb-4">{project.description}</p>
            <div className="flex flex-wrap gap-2 mb-6">
                 <span className={`text-xs font-medium px-2.5 py-1 rounded-md ${getDifficultyClasses(difficultyTag)}`}>{difficultyTag}</span>
                 {project.tags.filter(t => !isDifficultyTag(t)).map((tag: string) => <span key={tag} className={`text-xs font-medium px-2.5 py-1 rounded-md bg-slate-100 text-slate-600`}>{tag}</span>)}
            </div>

            <Button onClick={onGenerate} icon={Rocket} className="w-full mb-6">
                Use this Project & Generate Assets
            </Button>

            <div className="space-y-2">
                {project.techStack && project.techStack.length > 0 && (
                    <Section title="Tech Stack" items={project.techStack} icon={Terminal} />
                )}
                <Section title="Learning Outcomes" items={project.learningOutcomes} icon={Goal} />
                <Section title="Project Requirements" items={project.projectRequirements} icon={SquareCheckBig} />
                <Section title="Deliverables" items={project.deliverables} icon={Rocket} />
            </div>
        </div>
    );
};