import { Test } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Repository } from 'typeorm';
import { WatchlistItem } from '../watchlist/watchlist-item.entity';

describe('Database smoke test', () => {
  let repo: Repository<WatchlistItem>;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot({
          type: 'postgres',
          url: process.env.DATABASE_URL,
          entities: [WatchlistItem],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([WatchlistItem]),
      ],
    }).compile();

    repo = module.get<Repository<WatchlistItem>>(getRepositoryToken(WatchlistItem));
  });

  it('writes and reads a watchlist item', async () => {
    const item = repo.create({
      flightNumber: 'QF001',
      departureAirport: 'SYD',
      departureDate: '2026-05-18',
    });
    const saved = await repo.save(item);
    const found = await repo.findOneBy({ id: saved.id });

    expect(found).toBeDefined();
    expect(found.flightNumber).toBe('QF001');

    await repo.delete({ id: saved.id });
  });
});
