import { ApiProperty } from '@nestjs/swagger';

export enum FlightStatus {
  ON_TIME = 'on_time',
  DELAYED = 'delayed',
  CANCELLED = 'cancelled',
  UNKNOWN = 'unknown',
}

export class DepartureDto {
  @ApiProperty({ example: 'QF401' })
  flightNumber: string;

  @ApiProperty({ example: 'Qantas' })
  airline: string;

  @ApiProperty({ example: '2026-05-18T08:30:00.000Z' })
  scheduledDeparture: string;

  @ApiProperty({ example: 'MEL' })
  arrivalAirport: string;

  @ApiProperty({ enum: FlightStatus, example: FlightStatus.ON_TIME })
  status: FlightStatus;
}
