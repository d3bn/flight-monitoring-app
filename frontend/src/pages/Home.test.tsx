import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import Home from './Home';

vi.mock('../lib/axios', () => ({
  default: { get: vi.fn() },
}));

import apiClient from '../lib/axios';

function wrapper({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
    >
      <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
  );
}

describe('Home', () => {
  it('renders the page heading', () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: { status: 'ok' } });
    render(<Home />, { wrapper });
    expect(screen.getByText('Flight Disruption Monitor')).toBeInTheDocument();
  });

  it('shows a loading spinner while the health request is in flight', () => {
    vi.mocked(apiClient.get).mockReturnValue(new Promise(() => {}));
    render(<Home />, { wrapper });
    expect(document.querySelector('.loading')).toBeInTheDocument();
  });

  it('shows the API status badge on success', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: { status: 'ok' } });
    render(<Home />, { wrapper });
    expect(await screen.findByText('ok')).toBeInTheDocument();
  });

  it('shows Unreachable badge when the API call fails', async () => {
    vi.mocked(apiClient.get).mockRejectedValue(new Error('Network error'));
    render(<Home />, { wrapper });
    expect(await screen.findByText('Unreachable')).toBeInTheDocument();
  });
});
