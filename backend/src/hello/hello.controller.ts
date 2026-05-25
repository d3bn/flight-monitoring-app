import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Hello')
@Controller('hello')
export class HelloController {
  @Get()
  @ApiOperation({ summary: 'Hello World' })
  @ApiResponse({ status: 200, description: 'Returns a Hello World message.' })
  greet(): { message: string } {
    return { message: 'Hello World' };
  }
}
