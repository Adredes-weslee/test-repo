import React from 'react';
import { ContentList } from './components/ContentList';
import { ContentViewer } from './components/content-viewer';
import { useContentLibraryLogic } from './hooks/useContentLibraryLogic';

const ContentLibraryFeature: React.FC = () => {
  const {
    filteredContent,
    activeContentItem,
    searchTerm,
    setSearchTerm,
    inProgressItems,
    isLoading,
    handleSelectContent,
    handleDeleteItem,
    handleRegeneratePart,
    handleGenerateNewPart,
    regeneratingPart,
    handleUpdateNotes,
    handleUpdateLessonPlan,
    handleUpdateLessonTitle,
    handleUpdateCurriculumTitle,
    lastRegeneratedCurriculumTitle,
    lastRegeneratedLessonTitle,
    generateAndSaveVariedCourse,
  } = useContentLibraryLogic();

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        <ContentList
          contentItems={filteredContent}
          inProgressItems={inProgressItems}
          selectedContent={activeContentItem}
          onSelectContent={handleSelectContent}
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          isLoading={isLoading}
        />
        <ContentViewer
          selectedContent={activeContentItem}
          onDeleteRequest={handleDeleteItem}
          onRegenerate={handleRegeneratePart}
          onGenerateNewPart={handleGenerateNewPart}
          regeneratingPart={regeneratingPart}
          onUpdateNotes={handleUpdateNotes}
          onUpdateLessonPlan={handleUpdateLessonPlan}
          onUpdateLessonTitle={handleUpdateLessonTitle}
          onUpdateCurriculumTitle={handleUpdateCurriculumTitle}
          lastRegeneratedCurriculumTitle={lastRegeneratedCurriculumTitle}
          lastRegeneratedLessonTitle={lastRegeneratedLessonTitle}
          onDuplicateAndVary={generateAndSaveVariedCourse}
        />
      </div>
    </div>
  );
};

export default ContentLibraryFeature;