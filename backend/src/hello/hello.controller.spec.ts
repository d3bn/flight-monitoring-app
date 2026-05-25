import { Test, TestingModule } from '@nestjs/testing';
import { HelloController } from './hello.controller';

describe('HelloController', () => {
  let controller: HelloController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HelloController],
    }).compile();

    controller = module.get<HelloController>(HelloController);
  });

  it('should return a Hello World message', () => {
    expect(controller.greet()).toEqual({ message: 'Hello World' });
  });

  it('should return an object with a message property', () => {
    const result = controller.greet();
    expect(result).toHaveProperty('message');
    expect(typeof result.message).toBe('string');
  });
});
