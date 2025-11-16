import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from './modules/mail/mail.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { EmpresasModule } from './modules/empresas/empresas.module';
import { SelosModule } from './modules/selos/selos.module';
import { CriteriaModule } from './modules/criteria/criteria.module';
import { QuestionsModule } from './modules/questions/questions.module';
import { CertificationCyclesModule } from './modules/certification-cycles/certification-cycles.module';
import { SelfAssessmentsModule } from './modules/self-assessments/self-assessments.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { EvidencesModule } from './modules/evidences/evidences.module';
import { AuditoriasModule } from './modules/auditorias/auditorias.module';
import { SelosEmitidosModule } from './modules/selos-emitidos/selos-emitidos.module';
//import { AuditsModule } from './modules/audits/audits.module';
import { AuditFindingsModule } from './modules/audit-findings/audit-findings.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: typeOrmConfig,
    }),
    MailModule,
    AuthModule,
    UsersModule,
    EmpresasModule,
    SelosModule,
    CriteriaModule,
    QuestionsModule,
    CertificationCyclesModule,
    SelfAssessmentsModule,
    UploadsModule,
    EvidencesModule,
    AuditoriasModule,
    //AuditsModule,
    AuditFindingsModule,
    SelosEmitidosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}