import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { FlightsController } from './flights.controller';
import { FlightsService } from './flights.service';
import { FlightStatus } from './dto/departure.dto';

const mockDepartures = [
  {
    flightNumber: 'QF401',
    airline: 'Qantas',
    scheduledDeparture: '2026-05-18T08:30:00.000Z',
    arrivalAirport: 'MEL',
    status: FlightStatus.ON_TIME,
  },
];

const mockFlightsService = {
  getDepartures: jest.fn().mockResolvedValue(mockDepartures),
};

describe('FlightsController', () => {
  let controller: FlightsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FlightsController],
      providers: [{ provide: FlightsService, useValue: mockFlightsService }],
    }).compile();

    controller = module.get<FlightsController>(FlightsController);
  });

  afterEach(() => jest.clearAllMocks());

  describe('getDepartures()', () => {
    it('returns departures for a valid 3-letter IATA code', async () => {
      const result = await controller.getDepartures('SYD');
      expect(result).toEqual(mockDepartures);
      expect(mockFlightsService.getDepartures).toHaveBeenCalledWith('SYD');
    });

    it('uppercases the airport code before passing to service', async () => {
      await controller.getDepartures('syd');
      expect(mockFlightsService.getDepartures).toHaveBeenCalledWith('SYD');
    });

    it('throws BadRequestException when airport param is missing', async () => {
      await expect(controller.getDepartures(undefined)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('throws BadRequestException for a non-3-letter code', async () => {
      await expect(controller.getDepartures('SYDN')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('throws BadRequestException for a numeric string', async () => {
      await expect(controller.getDepartures('123')).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
