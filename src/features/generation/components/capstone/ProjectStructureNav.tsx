
import React from 'react';
import { Rocket, Terminal, Goal, File as FileIcon, SquareCheckBig, Lock, Sparkles, Check, Thinking, Eye } from '../../../../components/icons';
import { Button } from '../../../../components/ui';

const SECTIONS = [
    { id: 'project-description', label: 'Brief', icon: FileIcon },
    { id: 'project-learning-outcomes', label: 'Outcomes', icon: Goal },
    { id: 'project-tech-stack', label: 'Tech Stack', icon: Terminal },
    { id: 'project-requirements', label: 'Requirements', icon: SquareCheckBig },
    { id: 'project-deliverables', label: 'Deliverables', icon: Rocket },
    { id: 'project-evidence', label: 'Evidence', icon: Check },
    { id: 'project-constraints', label: 'Constraints', icon: Lock },
    { id: 'project-judgement', label: 'Judgement', icon: Eye },
    { id: 'project-assessment', label: 'Assessment', icon: Thinking },
    { id: 'project-participation', label: 'Participation', icon: Goal },
    { id: 'project-future-oriented', label: 'Future-Oriented', icon: Sparkles },
];

interface ProjectStructureNavProps {
    onGenerate: () => void;
    onStartOver: () => void;
    isEditing: boolean;
}

export const ProjectStructureNav: React.FC<ProjectStructureNavProps> = ({ onGenerate, onStartOver, isEditing }) => {
    
    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            const yOffset = -100; 
            const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };
    
    return (
        <div className="w-full md:w-64 flex-shrink-0 md:sticky top-24 self-start">
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                <nav>
                    <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-3">Project Details</h3>
                    <ul className="space-y-1">
                        {SECTIONS.map(({ id, label, icon: Icon }) => (
                            <li key={id}>
                                <a 
                                    href={`#${id}`}
                                    onClick={(e) => handleNavClick(e, id)}
                                    className="flex items-center space-x-3 p-2 rounded-md hover:bg-slate-100 hover:text-primary-text transition-colors text-slate-600"
                                >
                                    <Icon className="w-4 h-4 text-slate-400" />
                                    <span className="text-sm font-medium">{label}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className="mt-6 space-y-2 border-t border-slate-200 pt-6">
                    <Button onClick={onGenerate} className="w-full" disabled={isEditing}>
                        Generate Environment
                    </Button>
                    <Button onClick={onStartOver} variant="secondary" className="w-full" disabled={isEditing}>
                        Start Over
                    </Button>
                </div>
            </div>
        </div>
    );
};
