import { BadGatewayException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { FlightsService } from './flights.service';
import { FlightStatus } from './dto/departure.dto';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockConfigService = { get: jest.fn().mockReturnValue('test-api-key') };

describe('FlightsService', () => {
  let service: FlightsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FlightsService,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<FlightsService>(FlightsService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('getDepartures()', () => {
    it('returns mapped departures on success', async () => {
      mockedAxios.get.mockResolvedValue({
        status: 200,
        data: {
          departures: [
            {
              number: 'QF401',
              airline: { name: 'Qantas' },
              departure: { scheduledTime: { utc: '2026-05-18T08:30:00.000Z' } },
              arrival: { airport: { iata: 'MEL' } },
              status: 'Active',
            },
          ],
        },
      });

      const result = await service.getDepartures('SYD');

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        flightNumber: 'QF401',
        airline: 'Qantas',
        scheduledDeparture: '2026-05-18T08:30:00.000Z',
        arrivalAirport: 'MEL',
        status: FlightStatus.ON_TIME,
      });
    });

    it('returns empty array when departures list is empty', async () => {
      mockedAxios.get.mockResolvedValue({ status: 200, data: { departures: [] } });
      const result = await service.getDepartures('SYD');
      expect(result).toEqual([]);
    });

    it('returns empty array when departures key is missing', async () => {
      mockedAxios.get.mockResolvedValue({ status: 200, data: {} });
      const result = await service.getDepartures('SYD');
      expect(result).toEqual([]);
    });

    it('throws NotFoundException when AeroDataBox returns 404', async () => {
      mockedAxios.get.mockRejectedValue({ response: { status: 404 }, message: 'Not Found' });
      await expect(service.getDepartures('ZZZ')).rejects.toThrow(NotFoundException);
    });

    it('throws BadGatewayException on upstream 5xx error', async () => {
      mockedAxios.get.mockRejectedValue({ response: { status: 500 }, message: 'Server Error' });
      await expect(service.getDepartures('SYD')).rejects.toThrow(BadGatewayException);
    });

    it('throws BadGatewayException on network error', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Network Error'));
      await expect(service.getDepartures('SYD')).rejects.toThrow(BadGatewayException);
    });
  });

  describe('normaliseStatus()', () => {
    it.each([
      ['Active', FlightStatus.ON_TIME],
      ['on time', FlightStatus.ON_TIME],
      ['on_time', FlightStatus.ON_TIME],
      ['Delayed', FlightStatus.DELAYED],
      ['Cancelled', FlightStatus.CANCELLED],
      ['Canceled', FlightStatus.CANCELLED],
      ['Unknown', FlightStatus.UNKNOWN],
      [undefined, FlightStatus.UNKNOWN],
      ['', FlightStatus.UNKNOWN],
    ])('maps %s → %s', (input, expected) => {
      expect(service.normaliseStatus(input)).toBe(expected);
    });
  });
});
