import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import { CriteriaModule } from '../criteria/criteria.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Question]),
    CriteriaModule,
  ],
  controllers: [QuestionsController],
  providers: [QuestionsService],
  exports: [QuestionsService],
})
export class QuestionsModule {}
