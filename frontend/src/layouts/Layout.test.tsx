import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Layout from './Layout';

function renderLayout() {
  return render(
    <MemoryRouter>
      <Layout />
    </MemoryRouter>,
  );
}

describe('Layout', () => {
  it('renders the brand name', () => {
    renderLayout();
    expect(screen.getByText('Flight Monitor')).toBeInTheDocument();
  });

  it('renders the Departures nav link pointing to /', () => {
    renderLayout();
    const link = screen.getByRole('link', { name: 'Departures' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/');
  });

  it('renders the Watchlist nav link pointing to /watchlist', () => {
    renderLayout();
    const link = screen.getByRole('link', { name: 'Watchlist' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/watchlist');
  });
});
