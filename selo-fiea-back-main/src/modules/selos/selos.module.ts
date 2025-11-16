import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Selo } from './entities/selo.entity';
import { SelosService } from './selos.service';
import { SelosController } from './selos.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Selo])],
  controllers: [SelosController],
  providers: [SelosService],
  exports: [SelosService],
})
export class SelosModule {}