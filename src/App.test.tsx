import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

describe('App', () => {
  it('renders the header and the nugget catalog', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByText('Dev Nuggets')).toBeInTheDocument();
    expect(screen.getByText('Expand-Contract Pattern')).toBeInTheDocument();
  });
});
