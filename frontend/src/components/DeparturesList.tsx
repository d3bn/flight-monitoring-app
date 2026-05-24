import { Link } from 'react-router-dom';
import { useDepartures } from '../hooks/useDepartures';
import StatusBadge from './StatusBadge';

interface DeparturesListProps {
  airport: string;
}

function SkeletonRows() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <tr key={i}>
          <td><div className="skeleton h-4 w-20" /></td>
          <td><div className="skeleton h-4 w-28" /></td>
          <td><div className="skeleton h-4 w-16" /></td>
          <td><div className="skeleton h-4 w-12" /></td>
          <td><div className="skeleton h-4 w-16" /></td>
        </tr>
      ))}
    </>
  );
}

export default function DeparturesList({ airport }: DeparturesListProps) {
  const { data, isLoading, isError, refetch, dataUpdatedAt } = useDepartures(airport);

  return (
    <div>
      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">
          Departures from <span className="text-primary">{airport}</span>
        </h2>
        {dataUpdatedAt > 0 && (
          <span className="text-xs text-base-content/50">
            Last updated {new Date(dataUpdatedAt).toLocaleTimeString()}
          </span>
        )}
      </div>

      {/* Error state */}
      {isError && (
        <div className="alert alert-error flex items-center justify-between">
          <span>We couldn&apos;t load flights right now.</span>
          <button className="btn btn-sm btn-ghost" onClick={() => refetch()}>
            Try again
          </button>
        </div>
      )}

      {/* Table */}
      {!isError && (
        <div className="overflow-x-auto rounded-box border border-base-300">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Flight</th>
                <th>Airline</th>
                <th>Departure</th>
                <th>To</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && <SkeletonRows />}

              {!isLoading && data?.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-base-content/50">
                    No upcoming departures found for {airport}
                  </td>
                </tr>
              )}

              {!isLoading &&
                data?.map((flight) => (
                  <tr
                    key={`${flight.flightNumber}-${flight.scheduledDeparture}`}
                    className="hover cursor-pointer"
                  >
                    <td>
                      <Link
                        to={`/flights/${flight.flightNumber}`}
                        className="font-mono font-semibold link link-hover"
                      >
                        {flight.flightNumber}
                      </Link>
                    </td>
                    <td>{flight.airline}</td>
                    <td className="tabular-nums">
                      {new Date(flight.scheduledDeparture).toLocaleTimeString(
                        [],
                        { hour: '2-digit', minute: '2-digit' },
                      )}
                    </td>
                    <td className="font-mono">{flight.arrivalAirport}</td>
                    <td>
                      <StatusBadge status={flight.status} />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
