import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Criterion } from './entities/criterion.entity';
import { CriteriaService } from './criteria.service';
import { CriteriaController } from './criteria.controller';
import { SelosModule } from '../selos/selos.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Criterion]),
    SelosModule,
  ],
  controllers: [CriteriaController],
  providers: [CriteriaService],
  exports: [CriteriaService],
})
export class CriteriaModule {}