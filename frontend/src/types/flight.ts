export type FlightStatus = 'on_time' | 'delayed' | 'cancelled' | 'unknown';

export interface Departure {
  flightNumber: string;
  airline: string;
  scheduledDeparture: string;
  arrivalAirport: string;
  status: FlightStatus;
}
