import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditFinding } from './entities/audit-finding.entity';
import { AuditFindingsService } from './audit-findings.service';
import { AuditFindingsController } from './audit-findings.controller';
//import { AuditsModule } from '../audits/audits.module';
import { CriteriaModule } from '../criteria/criteria.module';
import { AuditoriasModule } from '../auditorias/auditorias.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuditFinding]),
    //AuditsModule,
    CriteriaModule,
    AuditoriasModule,
  ],
  controllers: [AuditFindingsController],
  providers: [AuditFindingsService],
  exports: [AuditFindingsService],
})
export class AuditFindingsModule {}
