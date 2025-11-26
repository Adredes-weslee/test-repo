



import React, { useState, useEffect } from 'react';
import { RagInfoPanel } from './RagInfoPanel';
import { CurriculumCard } from './CurriculumCard';
import { CurriculumDetailView } from './CurriculumDetailView';
import { ProjectCard } from './ProjectCard';
import { ProjectDetailView } from './ProjectDetailView';
import { Search, Modification } from '../../../components/icons/index';
import { Button } from '../../../components/ui';
import type { Curriculum, CapstoneProject } from '../../../types';
import { useAppLogic } from '../../../hooks';

export const ResultsView: React.FC<{ 
  curriculumData: Curriculum[];
  projectData: CapstoneProject[];
  agentThoughts: string[]; 
  onNewSearch: () => void;
  onModifySearch: () => void;
}> = ({ curriculumData, projectData, agentThoughts, onNewSearch, onModifySearch }) => {
  const { selectCurriculumAndSwitchToGeneration, selectCapstoneProjectAndSwitchToGeneration } = useAppLogic();
  const [activeCurriculumTitle, setActiveCurriculumTitle] = useState('');
  const [activeProjectId, setActiveProjectId] = useState<number | null>(null);
  
  const isProjectResults = projectData && projectData.length > 0;

  useEffect(() => {
    if (isProjectResults) {
        const recommended = projectData.find(p => p.recommended);
        setActiveProjectId(recommended ? recommended.id : projectData[0].id);
        setActiveCurriculumTitle('');
    } else if (curriculumData && curriculumData.length > 0) {
        const recommended = curriculumData.find(c => c.recommended);
        setActiveCurriculumTitle(recommended ? recommended.title : curriculumData[0].title);
        setActiveProjectId(null);
    }
  }, [curriculumData, projectData, isProjectResults]);

  const activeCurriculum = curriculumData.find(c => c.title === activeCurriculumTitle);
  const activeProject = projectData.find(p => p.id === activeProjectId);

  const headerTitle = isProjectResults ? 'Generated Capstone Projects' : 'Discover the Content you want';
  const headerSubtitle = isProjectResults 
    ? 'Select a recommended project or explore other options to see details.'
    : 'Select a recommended curriculum or explore other options to see details.';

  if ((!curriculumData || curriculumData.length === 0) && (!projectData || projectData.length === 0)) {
    return (
      <div className="text-center p-8">
        <p className="text-slate-600">No results found. Please try a new search.</p>
        <Button onClick={onNewSearch} variant="secondary" icon={Search} className="mt-4 !py-2 !px-4 mx-auto">
          New Search
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      <div className="flex-1 w-full">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{headerTitle}</h2>
            <p className="text-slate-600 mt-1">{headerSubtitle}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={onModifySearch} variant="secondary" icon={Modification} className="flex-shrink-0 !py-2 !px-4">
              Modify Search
            </Button>
            <Button onClick={onNewSearch} variant="secondary" icon={Search} className="flex-shrink-0 !py-2 !px-4">
              New Search
            </Button>
          </div>
        </div>
        <RagInfoPanel agentThoughts={agentThoughts} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {isProjectResults ? (
            projectData.map((project) => (
              <ProjectCard 
                key={project.id}
                project={project}
                isActive={activeProjectId === project.id}
                onClick={() => setActiveProjectId(project.id)}
              />
            ))
          ) : (
            curriculumData.map((card) => (
              <CurriculumCard 
                key={card.title}
                {...card}
                active={activeCurriculumTitle === card.title}
                onClick={() => setActiveCurriculumTitle(card.title)}
              />
            ))
          )}
        </div>
      </div>
      
      {isProjectResults && activeProject && (
        <ProjectDetailView 
          project={activeProject} 
          onGenerate={() => selectCapstoneProjectAndSwitchToGeneration(activeProject)} 
        />
      )}
      
      {!isProjectResults && activeCurriculum && (
        <CurriculumDetailView 
          curriculum={activeCurriculum} 
          onGenerate={() => selectCurriculumAndSwitchToGeneration(activeCurriculum)} 
        />
      )}
    </div>
  );
};