import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SelfAssessment } from './entities/self-assessment.entity';
import { SelfAssessmentsService } from './self-assessments.service';
import { SelfAssessmentsController } from './self-assessments.controller';
import { CertificationCyclesModule } from '../certification-cycles/certification-cycles.module';
import { UsersModule } from '../users/users.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SelfAssessment]),
    CertificationCyclesModule,
    UsersModule,
    MailModule,
  ],
  controllers: [SelfAssessmentsController],
  providers: [SelfAssessmentsService],
  exports: [SelfAssessmentsService],
})
export class SelfAssessmentsModule {}
