import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import Home from './Home';
import * as useDeparturesModule from '../hooks/useDepartures';

vi.mock('../hooks/useDepartures');
const mockUseDepartures = vi.mocked(useDeparturesModule.useDepartures);

function wrapper({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
  );
}

describe('Home', () => {
  beforeEach(() => {
    mockUseDepartures.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
      dataUpdatedAt: 0,
    } as any);
  });

  afterEach(() => { vi.clearAllMocks(); });

  it('renders the page heading', () => {
    render(<Home />, { wrapper });
    expect(screen.getByText('Flight Disruption Monitor')).toBeInTheDocument();
  });

  it('renders the airport search input', () => {
    render(<Home />, { wrapper });
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('does not show departures list before a search is submitted', () => {
    render(<Home />, { wrapper });
    expect(screen.queryByText(/Departures from/i)).not.toBeInTheDocument();
  });

  it('shows the departures list after a valid airport code is searched', async () => {
    render(<Home />, { wrapper });
    await userEvent.type(screen.getByRole('textbox'), 'SYD');
    await userEvent.click(screen.getByRole('button', { name: /search/i }));
    expect(screen.getByText(/Departures from/i)).toBeInTheDocument();
  });
});
