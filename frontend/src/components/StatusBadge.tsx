import type { FlightStatus } from '../types/flight';

const STATUS_CONFIG: Record<
  FlightStatus,
  { label: string; className: string }
> = {
  on_time:   { label: 'On Time',   className: 'badge-success'  },
  delayed:   { label: 'Delayed',   className: 'badge-warning'  },
  cancelled: { label: 'Cancelled', className: 'badge-error'    },
  unknown:   { label: 'Unknown',   className: 'badge-ghost'    },
};

interface StatusBadgeProps {
  status: FlightStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const { label, className } = STATUS_CONFIG[status] ?? STATUS_CONFIG.unknown;
  return (
    <span className={`badge badge-sm font-semibold ${className}`}>
      {label}
    </span>
  );
}
