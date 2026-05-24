import { useState } from 'react';
import AirportSearch from '../components/AirportSearch';
import DeparturesList from '../components/DeparturesList';

export default function Home() {
  const [airport, setAirport] = useState<string | null>(null);

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-2">
        Flight Disruption Monitor
      </h1>
      <p className="text-center text-base-content/60 mb-8">
        Enter an airport code to view upcoming departures
      </p>

      <AirportSearch onSearch={setAirport} />

      {airport && (
        <div className="mt-8">
          <DeparturesList airport={airport} />
        </div>
      )}
    </div>
  );
}
