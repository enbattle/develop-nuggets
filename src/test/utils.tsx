import type { ReactElement, ReactNode } from 'react';
import {
  render as rtlRender,
  screen,
  waitFor,
  within,
  fireEvent,
  cleanup,
  type RenderOptions,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';

function AllProviders({ children }: { children: ReactNode }) {
  return (
    <MemoryRouter>
      <ThemeProvider>{children}</ThemeProvider>
    </MemoryRouter>
  );
}

export function render(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) {
  return rtlRender(ui, { wrapper: AllProviders, ...options });
}

export { screen, waitFor, within, fireEvent, cleanup };
