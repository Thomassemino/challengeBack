import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Note } from '../entities/note.entity';
import { Category } from '../entities/category.entity';
import { User } from '../entities/user.entity';

export const getDatabaseConfig = (configService?: ConfigService): DataSourceOptions => {
  if (process.env.DATABASE_URL) {
    return {
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [Note, Category, User],
      migrations: ['dist/migrations/*.js'],
      synchronize: false,
      logging: process.env.NODE_ENV !== 'production',
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    };
  }

  return {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME || 'admin',
    password: process.env.DB_PASSWORD || 'admin123',
    database: process.env.DB_NAME || 'notesdb',
    entities: [Note, Category, User],
    migrations: ['dist/migrations/*.js'],
    synchronize: process.env.NODE_ENV !== 'production',
    logging: process.env.NODE_ENV !== 'production',
  };
};

const dataSource = new DataSource(getDatabaseConfig());
export default dataSource;