


import React from 'react';
import { IdleView } from './components/IdleView';
import { ResultsView } from './components/ResultsView';
import { LoadingSpinner, ConfirmationModal } from '../../components/ui';
import { useDiscovery } from './hooks/useDiscovery';

const DiscoveryFeature: React.FC = () => {
  const {
    view,
    discoveryType,
    setDiscoveryType,
    searchValue,
    setSearchValue,
    curriculumResults,
    projectResults,
    agentThoughts,
    trendingTopics,
    isFetchingTopics,
    progress,
    filters,
    handleFilterChange,
    selectedIndustry,
    handleIndustryChange,
    handleStartDiscovery,
    handleNewSearch,
    handleModifySearch,
    handleCancelDiscovery,
    isCancelModalOpen,
    confirmCancelDiscovery,
    closeCancelModal,
  } = useDiscovery();

  if (view === 'results') {
    return <ResultsView 
              curriculumData={curriculumResults} 
              projectData={projectResults}
              agentThoughts={agentThoughts} 
              onNewSearch={handleNewSearch}
              onModifySearch={handleModifySearch}
            />;
  }

  return (
    <>
      <div className="relative">
        {view === 'loading' && 
          <LoadingSpinner 
            title={discoveryType === 'course' ? 'Discovering Content' : 'Discovering Projects'}
            message={discoveryType === 'course' ? 'Our AI is discovering educational content...' : 'Our AI is generating capstone project ideas...'}
            progress={progress}
            onCancel={handleCancelDiscovery}
          />
        }
        <IdleView 
          discoveryType={discoveryType}
          setDiscoveryType={setDiscoveryType}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          onStartDiscovery={(files) => handleStartDiscovery(files)}
          trendingTopics={trendingTopics}
          isFetchingTopics={isFetchingTopics}
          filters={filters}
          onFilterChange={handleFilterChange}
          selectedIndustry={selectedIndustry}
          onIndustryChange={handleIndustryChange}
        />
      </div>
      <ConfirmationModal
        isOpen={isCancelModalOpen}
        onClose={closeCancelModal}
        onConfirm={confirmCancelDiscovery}
        title="Stop Generating"
        message="Are you sure you want to stop? All progress will be lost."
        cancelButtonText="Continue Generating"
        confirmButtonText="Stop"
      />
    </>
  );
};

export default DiscoveryFeature;