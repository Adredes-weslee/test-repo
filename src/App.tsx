
import React, { useEffect } from 'react';
import { MainLayout } from './layouts';
import GenerationFeature from './features/generation/GenerationFeature';
import ContentLibraryFeature from './features/content-library/ContentLibraryFeature';
import TrendingFeature from './features/trending/TrendingFeature';
import type { TabName } from './types';
import { ToastManager } from './components/ui';
import { useNavigationStore, useAuthStore, useContentLibraryStore } from './store';
import { authService } from './services';
import AuthFeature from './features/auth/AuthFeature';

const PANELS: Record<TabName, React.ComponentType> = {
  'Generation': GenerationFeature,
  'Trending': TrendingFeature,
  'Library': ContentLibraryFeature,
};

const ActivePanel: React.FC = () => {
  const activeTab = useNavigationStore((state) => state.activeTab);

  return (
    <>
      {Object.entries(PANELS).map(([tabName, Component]) => (
        <div key={tabName} className={activeTab === tabName ? 'animate-fadeIn' : 'hidden'}>
          <Component />
        </div>
      ))}
    </>
  );
};

const App: React.FC = () => {
  const { session, isInitialized, setSession, setUser, setInitialized } = useAuthStore();
  const { initialize: initializeLibrary, reset: resetLibrary } = useContentLibraryStore();

  useEffect(() => {
    const subscription = authService.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session) {
        initializeLibrary();
      } else {
        resetLibrary();
      }
      if (!isInitialized) {
        setInitialized(true);
      }
    });

    if (!isInitialized) {
      authService.getSession().then(({ session }) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session) {
          initializeLibrary();
        }
        setInitialized(true);
      });
    }

    return () => {
      subscription?.unsubscribe();
    };
  }, [setSession, setUser, setInitialized, isInitialized, initializeLibrary, resetLibrary]);

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div>Loading Application...</div>
      </div>
    );
  }

  return (
    <>
      {session ? (
        <MainLayout>
          <ActivePanel />
        </MainLayout>
      ) : (
        <AuthFeature />
      )}
      <ToastManager />
    </>
  );
};

export default App;
