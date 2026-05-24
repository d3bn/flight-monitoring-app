import {
  BadGatewayException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { DepartureDto, FlightStatus } from './dto/departure.dto';

@Injectable()
export class FlightsService {
  private readonly logger = new Logger(FlightsService.name);
  private readonly baseUrl = 'https://aerodatabox.p.rapidapi.com';

  constructor(private readonly config: ConfigService) {}

  async getDepartures(iata: string): Promise<DepartureDto[]> {
    const apiKey = this.config.get<string>('AERODATABOX_API_KEY');
    const { from, to } = this.getTimeWindow();
    const url = `${this.baseUrl}/flights/airports/iata/${iata}/${from}/${to}`;
    const start = Date.now();

    try {
      const response = await axios.get(url, {
        headers: {
          'X-RapidAPI-Key': apiKey,
          'X-RapidAPI-Host': 'aerodatabox.p.rapidapi.com',
        },
        params: { direction: 'Departure', withCancelled: true },
      });

      this.logger.log(
        `AeroDataBox [${iata}] → ${response.status} (${Date.now() - start}ms)`,
      );

      return this.mapDepartures(response.data?.departures ?? []);
    } catch (err) {
      const elapsed = Date.now() - start;

      if (err.response?.status === 404) {
        this.logger.warn(`AeroDataBox [${iata}] → 404 (${elapsed}ms)`);
        throw new NotFoundException(`Airport '${iata}' was not found`);
      }

      this.logger.error(
        `AeroDataBox [${iata}] failed after ${elapsed}ms: ${err.message}`,
      );
      throw new BadGatewayException(
        'Unable to fetch departures from upstream provider',
      );
    }
  }

  private mapDepartures(raw: any[]): DepartureDto[] {
    return raw.map((item) => ({
      flightNumber: item.number ?? 'N/A',
      airline: item.airline?.name ?? 'Unknown',
      scheduledDeparture:
        item.departure?.scheduledTime?.utc ??
        item.departure?.scheduledTime?.local ??
        '',
      arrivalAirport: item.arrival?.airport?.iata ?? 'N/A',
      status: this.normaliseStatus(item.status),
    }));
  }

  normaliseStatus(raw?: string): FlightStatus {
    if (!raw) return FlightStatus.UNKNOWN;
    const s = raw.toLowerCase().trim();
    if (s === 'active' || s === 'on time' || s === 'on_time')
      return FlightStatus.ON_TIME;
    if (s === 'delayed') return FlightStatus.DELAYED;
    if (s === 'cancelled' || s === 'canceled') return FlightStatus.CANCELLED;
    return FlightStatus.UNKNOWN;
  }

  private getTimeWindow(): { from: string; to: string } {
    const pad = (n: number) => String(n).padStart(2, '0');
    const fmt = (d: Date) =>
      `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    const now = new Date();
    const later = new Date(now.getTime() + 12 * 60 * 60 * 1000);
    return { from: fmt(now), to: fmt(later) };
  }
}
