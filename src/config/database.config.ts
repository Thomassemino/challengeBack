import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Note } from '../entities/note.entity';
import { Category } from '../entities/category.entity';
import { User } from '../entities/user.entity';

export const getDatabaseConfig = (
  configService?: ConfigService,
): DataSourceOptions => {
  const isDevelopment = process.env.NODE_ENV !== 'production';

  if (process.env.DATABASE_URL) {
    return {
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [Note, Category, User],
      migrations: ['dist/migrations/*.js'],
      synchronize: isDevelopment,
      logging: isDevelopment,
      extra: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
    };
  }

  return {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'admin',
    password: process.env.DB_PASSWORD || 'admin123',
    database: process.env.DB_NAME || 'notesdb',
    entities: [Note, Category, User],
    migrations: ['dist/migrations/*.js'],
    synchronize: isDevelopment,
    logging: isDevelopment,
  };
};

const dataSource = new DataSource(getDatabaseConfig());
export default dataSource;
