import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CertificationCycle } from './entities/certification-cycle.entity';
import { CertificationCyclesService } from './certification-cycles.service';
import { CertificationCyclesController } from './certification-cycles.controller';
import { SelosModule } from '../selos/selos.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CertificationCycle]),
    SelosModule,
  ],
  controllers: [CertificationCyclesController],
  providers: [CertificationCyclesService],
  exports: [CertificationCyclesService],
})
export class CertificationCyclesModule {}
