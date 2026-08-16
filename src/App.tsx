import { useRef } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Header } from '@/components/Header';
import { HomePage } from '@/pages/HomePage';
import { NuggetPage } from '@/pages/NuggetPage';
import { useGlobalShortcuts } from '@/hooks/useGlobalShortcuts';

function AppShell() {
  const searchRef = useRef<HTMLInputElement>(null);

  useGlobalShortcuts({
    onSearch: () => searchRef.current?.focus(),
  });

  return (
    <div className="min-h-screen bg-bg-primary">
      <Header searchRef={searchRef} />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/nuggets/:id" element={<NuggetPage />} />
        </Routes>
      </main>
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
