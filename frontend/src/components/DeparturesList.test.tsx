import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import DeparturesList from './DeparturesList';
import * as useDeparturesModule from '../hooks/useDepartures';
import type { Departure } from '../types/flight';

vi.mock('../hooks/useDepartures');
const mockUseDepartures = vi.mocked(useDeparturesModule.useDepartures);

const mockFlight: Departure = {
  flightNumber: 'QF401',
  airline: 'Qantas',
  scheduledDeparture: '2026-05-18T08:30:00.000Z',
  arrivalAirport: 'MEL',
  status: 'on_time',
};

function wrapper({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
  );
}

function mockQuery(overrides: object) {
  mockUseDepartures.mockReturnValue({
    data: undefined,
    isLoading: false,
    isError: false,
    refetch: vi.fn(),
    dataUpdatedAt: 0,
    ...overrides,
  } as any);
}

describe('DeparturesList', () => {
  afterEach(() => vi.clearAllMocks());

  it('shows skeleton rows while loading', () => {
    mockQuery({ isLoading: true });
    render(<DeparturesList airport="SYD" />, { wrapper });
    // 6 skeleton rows — each cell has a skeleton div
    expect(document.querySelectorAll('.skeleton').length).toBeGreaterThanOrEqual(6);
  });

  it('shows empty state when no departures returned', () => {
    mockQuery({ data: [] });
    render(<DeparturesList airport="SYD" />, { wrapper });
    expect(screen.getByText(/No upcoming departures found for SYD/i)).toBeInTheDocument();
  });

  it('renders a flight row with all columns', () => {
    mockQuery({ data: [mockFlight], dataUpdatedAt: Date.now() });
    render(<DeparturesList airport="SYD" />, { wrapper });
    expect(screen.getByText('QF401')).toBeInTheDocument();
    expect(screen.getByText('Qantas')).toBeInTheDocument();
    expect(screen.getByText('MEL')).toBeInTheDocument();
    expect(screen.getByText('On Time')).toBeInTheDocument();
  });

  it('flight number is a link to /flights/:id', () => {
    mockQuery({ data: [mockFlight] });
    render(<DeparturesList airport="SYD" />, { wrapper });
    const link = screen.getByRole('link', { name: 'QF401' });
    expect(link).toHaveAttribute('href', '/flights/QF401');
  });

  it('shows last updated timestamp when data has been fetched', () => {
    mockQuery({ data: [mockFlight], dataUpdatedAt: Date.now() });
    render(<DeparturesList airport="SYD" />, { wrapper });
    expect(screen.getByText(/Last updated/i)).toBeInTheDocument();
  });

  it('shows error message on failure', () => {
    mockQuery({ isError: true });
    render(<DeparturesList airport="SYD" />, { wrapper });
    expect(screen.getByText(/couldn't load flights/i)).toBeInTheDocument();
  });

  it('retry button calls refetch', async () => {
    const refetch = vi.fn();
    mockQuery({ isError: true, refetch });
    render(<DeparturesList airport="SYD" />, { wrapper });
    await userEvent.click(screen.getByRole('button', { name: /try again/i }));
    expect(refetch).toHaveBeenCalledOnce();
  });
});
