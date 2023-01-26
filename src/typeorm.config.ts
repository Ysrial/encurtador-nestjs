import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 3000,
  username: 'nomedousuario',
  password: 'postgres',
  database: 'nestcrud',
  entities: [__dirname, '/../**/*.entity{.ts,.js}'],
  synchronize: true,
};
