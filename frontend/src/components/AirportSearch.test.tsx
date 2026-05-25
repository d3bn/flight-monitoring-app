import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AirportSearch from './AirportSearch';

describe('AirportSearch', () => {
  it('renders the search input and button', () => {
    render(<AirportSearch onSearch={vi.fn()} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
  });

  it('auto-uppercases typed characters', async () => {
    render(<AirportSearch onSearch={vi.fn()} />);
    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'syd');
    expect(input).toHaveValue('SYD');
  });

  it('calls onSearch with uppercased code on valid submit', async () => {
    const onSearch = vi.fn();
    render(<AirportSearch onSearch={onSearch} />);
    await userEvent.type(screen.getByRole('textbox'), 'SYD');
    await userEvent.click(screen.getByRole('button', { name: 'Search' }));
    expect(onSearch).toHaveBeenCalledWith('SYD');
  });

  it('calls onSearch on Enter key with valid code', async () => {
    const onSearch = vi.fn();
    render(<AirportSearch onSearch={onSearch} />);
    await userEvent.type(screen.getByRole('textbox'), 'LAX{Enter}');
    expect(onSearch).toHaveBeenCalledWith('LAX');
  });

  it('shows inline error for codes shorter than 3 letters', async () => {
    render(<AirportSearch onSearch={vi.fn()} />);
    await userEvent.type(screen.getByRole('textbox'), 'SY');
    await userEvent.click(screen.getByRole('button', { name: 'Search' }));
    expect(screen.getByRole('alert')).toHaveTextContent('3-letter IATA');
  });

  it('does not call onSearch when validation fails', async () => {
    const onSearch = vi.fn();
    render(<AirportSearch onSearch={onSearch} />);
    await userEvent.click(screen.getByRole('button', { name: 'Search' }));
    expect(onSearch).not.toHaveBeenCalled();
  });

  it('clears the error when the user starts typing again', async () => {
    render(<AirportSearch onSearch={vi.fn()} />);
    await userEvent.click(screen.getByRole('button', { name: 'Search' }));
    expect(screen.getByRole('alert')).toBeInTheDocument();
    await userEvent.type(screen.getByRole('textbox'), 'S');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
