import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { HubPage } from '@/pages/HubPage';
import { BrowsePage } from '@/pages/BrowsePage';
import { ContentPage } from '@/pages/ContentPage';
import { TrackPage } from '@/pages/TrackPage';
import { TracksIndexPage } from '@/pages/TracksIndexPage';
import { KeyboardShortcutsModal } from '@/components/KeyboardShortcutsModal';
import { useGlobalShortcuts } from '@/hooks/useGlobalShortcuts';

const InteractivePage = lazy(() => import('@/pages/InteractivePage'));

function AppShell() {
  const searchRef = useRef<HTMLInputElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { shortcutsOpen, closeShortcuts } = useGlobalShortcuts({
    onSearch: () => searchRef.current?.focus(),
  });

  useEffect(() => {
    if (!sidebarOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSidebarOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [sidebarOpen]);

  return (
    <div className="min-h-screen bg-bg-primary">
      <Header
        searchRef={searchRef}
        onToggleSidebar={() => setSidebarOpen((open) => !open)}
      />

      <div className="mx-auto flex max-w-6xl gap-8 px-4 py-8">
        <aside className="hidden shrink-0 self-start md:sticky md:top-16 md:block md:max-h-[calc(100vh-4rem)] md:w-64 md:overflow-y-auto">
          <Sidebar />
        </aside>

        <main className="min-w-0 flex-1">
          <div className="mx-auto max-w-3xl">
            <Routes>
              <Route path="/" element={<HubPage />} />
              <Route path="/browse" element={<BrowsePage />} />
              <Route path="/nuggets/:id" element={<ContentPage />} />
              <Route path="/guides/:id" element={<ContentPage />} />
              <Route path="/tracks" element={<TracksIndexPage />} />
              <Route path="/tracks/:id" element={<TrackPage />} />
              <Route
                path="/interactive"
                element={
                  <Suspense fallback={null}>
                    <InteractivePage />
                  </Suspense>
                }
              />
              <Route
                path="/interactive/:id"
                element={
                  <Suspense fallback={null}>
                    <InteractivePage />
                  </Suspense>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>
      </div>

      <KeyboardShortcutsModal open={shortcutsOpen} onClose={closeShortcuts} />

      {sidebarOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="All content"
          className="fixed inset-0 z-40 md:hidden"
        >
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-64 overflow-y-auto bg-bg-primary p-4 shadow-xl">
            <Sidebar onNavigate={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppShell />
    </ThemeProvider>
  );
}
