import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  describe('check()', () => {
    it('returns status ok', () => {
      const result = controller.check();
      expect(result.status).toBe('ok');
    });

    it('returns a valid ISO timestamp', () => {
      const result = controller.check();
      expect(result.timestamp).toBeDefined();
      expect(new Date(result.timestamp).toISOString()).toBe(result.timestamp);
    });

    it('returns a fresh timestamp on each call', () => {
      const first = controller.check();
      const second = controller.check();
      expect(new Date(second.timestamp).getTime()).toBeGreaterThanOrEqual(
        new Date(first.timestamp).getTime(),
      );
    });
  });
});
