import { Outlet, Link } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="min-h-screen bg-base-100">
      <nav className="navbar bg-base-200 px-6 shadow-sm">
        <div className="flex-1">
          <Link to="/" className="text-xl font-bold">Flight Monitor</Link>
        </div>
        <div className="flex gap-4">
          <Link to="/" className="btn btn-ghost btn-sm">Departures</Link>
          <Link to="/watchlist" className="btn btn-ghost btn-sm">Watchlist</Link>
        </div>
      </nav>
      <main className="container mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
