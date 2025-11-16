import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig = (): TypeOrmModuleOptions => {
  const nodeEnv = process.env.NODE_ENV || 'development';

  if (nodeEnv === 'development') {
    // SQLite para desenvolvimento
    return {
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [__dirname + '/../**/*.entity.{ts,js}'],
      synchronize: true, // Cria as tabelas automaticamente em desenvolvimento
      logging: false,
    };
  }

  // SQL Server para produção
  return {
    type: 'mssql',
    host: process.env.DB_HOST,
    schema: process.env.DB_SCHEMA,
    port: parseInt(process.env.DB_PORT) || 1433,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [__dirname + '/../**/*.entity.{ts,js}'],
    synchronize: false,
    options: {
      encrypt: false,
      trustServerCertificate: process.env.NODE_ENV !== 'production',
    },
  };
};