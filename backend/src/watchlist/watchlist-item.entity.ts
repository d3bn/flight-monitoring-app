import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('watchlist_items')
export class WatchlistItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'flight_number', length: 16 })
  flightNumber: string;

  @Column({ name: 'departure_airport', length: 8 })
  departureAirport: string;

  @Column({ name: 'departure_date', type: 'date' })
  departureDate: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
