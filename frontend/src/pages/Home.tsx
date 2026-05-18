import { useQuery } from '@tanstack/react-query';
import apiClient from '../lib/axios';

function useHealthCheck() {
  return useQuery({
    queryKey: ['health'],
    queryFn: () => apiClient.get('/health').then((r) => r.data),
  });
}

export default function Home() {
  const { data, isLoading, isError } = useHealthCheck();

  return (
    <div className="flex flex-col items-center gap-6 mt-16">
      <h1 className="text-3xl font-bold">Flight Disruption Monitor</h1>
      <div className="card bg-base-200 w-80 shadow">
        <div className="card-body items-center text-center">
          <h2 className="card-title">API Status</h2>
          {isLoading && <span className="loading loading-spinner" />}
          {isError && <span className="badge badge-error">Unreachable</span>}
          {data && <span className="badge badge-success">{data.status}</span>}
        </div>
      </div>
    </div>
  );
}
