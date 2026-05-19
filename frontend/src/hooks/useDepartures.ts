import { useQuery } from '@tanstack/react-query';
import apiClient from '../lib/axios';
import type { Departure } from '../types/flight';

async function fetchDepartures(airport: string): Promise<Departure[]> {
  const { data } = await apiClient.get<Departure[]>('/flights/departures', {
    params: { airport },
  });
  return data;
}

export function useDepartures(airport: string) {
  return useQuery({
    queryKey: ['departures', airport],
    queryFn: () => fetchDepartures(airport),
    enabled: Boolean(airport),
    staleTime: 60_000, // treat data as fresh for 1 min — no auto-polling in Inc 1
  });
}
