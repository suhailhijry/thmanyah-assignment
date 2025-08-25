import { DataSource } from 'typeorm';
import { DataSourceOptions } from 'typeorm/browser';

export const connectionSource = new DataSource({
  type: 'mariadb',
  host: process.env.DB_HOST ?? 'localhost',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
  username: process.env.DB_USERNAME ?? 'root',
  password: process.env.DB_PASSWORD ?? 'root',
  database: process.env.DB_NAME ?? 'thmanyah_assignment',
  entities: ['libs/contracts/src/**/*.entity{.ts,.js}'],
  migrations: ['db/migrations/*{.ts,.js}'],
} as DataSourceOptions);
