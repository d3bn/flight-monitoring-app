import {
  BadRequestException,
  Controller,
  Get,
  Query,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DepartureDto } from './dto/departure.dto';
import { FlightsService } from './flights.service';

const IATA_PATTERN = /^[A-Z]{3}$/;

@ApiTags('Flights')
@Controller('flights')
export class FlightsController {
  constructor(private readonly flightsService: FlightsService) {}

  @Get('departures')
  @ApiOperation({ summary: 'Get upcoming departures for an airport' })
  @ApiQuery({
    name: 'airport',
    description: '3-letter IATA airport code',
    example: 'SYD',
  })
  @ApiResponse({ status: 200, type: [DepartureDto] })
  @ApiResponse({ status: 400, description: 'Invalid IATA code format' })
  @ApiResponse({ status: 404, description: 'Airport not found' })
  @ApiResponse({ status: 502, description: 'Upstream provider error' })
  async getDepartures(
    @Query('airport') airport: string,
  ): Promise<DepartureDto[]> {
    if (!airport) {
      throw new BadRequestException(
        'airport query parameter is required (e.g. ?airport=SYD)',
      );
    }

    const iata = airport.toUpperCase();

    if (!IATA_PATTERN.test(iata)) {
      throw new BadRequestException(
        'Enter a 3-letter IATA airport code (e.g. SYD)',
      );
    }

    return this.flightsService.getDepartures(iata);
  }
}
