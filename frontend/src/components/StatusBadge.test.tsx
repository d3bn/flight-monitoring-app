import { render, screen } from '@testing-library/react';
import StatusBadge from './StatusBadge';

describe('StatusBadge', () => {
  it.each([
    ['on_time',   'On Time',   'badge-success'],
    ['delayed',   'Delayed',   'badge-warning'],
    ['cancelled', 'Cancelled', 'badge-error'],
    ['unknown',   'Unknown',   'badge-ghost'],
  ] as const)('renders correct label and class for %s', (status, label, cls) => {
    render(<StatusBadge status={status} />);
    const badge = screen.getByText(label);
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass(cls);
  });
});
