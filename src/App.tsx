import { useEffect, useRef, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { HomePage } from '@/pages/HomePage';
import { ContentPage } from '@/pages/ContentPage';
import { useGlobalShortcuts } from '@/hooks/useGlobalShortcuts';

function AppShell() {
  const searchRef = useRef<HTMLInputElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useGlobalShortcuts({
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
        <aside className="hidden shrink-0 md:block md:w-56">
          <Sidebar />
        </aside>

        <main className="min-w-0 flex-1">
          <div className="mx-auto max-w-3xl">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/nuggets/:id" element={<ContentPage />} />
              <Route path="/guides/:id" element={<ContentPage />} />
            </Routes>
          </div>
        </main>
      </div>

      {sidebarOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="All nuggets"
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
