import { useState, type FormEvent, type KeyboardEvent } from 'react';

interface AirportSearchProps {
  onSearch: (iata: string) => void;
  loading?: boolean;
}

const IATA_PATTERN = /^[A-Z]{3}$/;

export default function AirportSearch({ onSearch, loading = false }: AirportSearchProps) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const validate = (code: string): boolean => {
    if (!IATA_PATTERN.test(code)) {
      setError('Enter a 3-letter IATA airport code (e.g. SYD)');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validate(value)) onSearch(value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (validate(value)) onSearch(value);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto">
      <label className="label mb-1">
        <span className="label-text text-base font-semibold">Airport code</span>
      </label>

      <div className="join w-full">
        <input
          type="text"
          value={value}
          maxLength={3}
          placeholder="e.g. SYD, LAX, LHR"
          aria-label="Airport IATA code"
          aria-describedby={error ? 'airport-error' : undefined}
          className={`input input-bordered join-item w-full text-lg tracking-widest uppercase ${
            error ? 'input-error' : ''
          }`}
          onChange={(e) => {
            const upper = e.target.value.toUpperCase().replace(/[^A-Z]/g, '');
            setValue(upper);
            if (error) setError('');
          }}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
        <button
          type="submit"
          className="btn btn-primary join-item"
          disabled={loading}
        >
          {loading ? <span className="loading loading-spinner loading-sm" /> : 'Search'}
        </button>
      </div>

      {error && (
        <p id="airport-error" role="alert" className="text-error text-sm mt-1">
          {error}
        </p>
      )}
    </form>
  );
}
