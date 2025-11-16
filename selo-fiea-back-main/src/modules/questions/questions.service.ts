import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from './entities/question.entity';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { CriteriaService } from '../criteria/criteria.service';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private questionsRepository: Repository<Question>,
    private criteriaService: CriteriaService,
  ) {}

  async create(createQuestionDto: CreateQuestionDto): Promise<Question> {
    await this.criteriaService.findOne(createQuestionDto.criterionId);

    const question = this.questionsRepository.create(createQuestionDto);
    return this.questionsRepository.save(question);
  }

  async findAll(): Promise<Question[]> {
    return this.questionsRepository.find({
      relations: ['criterion'],
    });
  }

  async findByCriterionId(criterionId: number): Promise<Question[]> {
    return this.questionsRepository.find({
      where: { criterionId },
      relations: ['criterion'],
    });
  }

  async findOne(id: number): Promise<Question> {
    const question = await this.questionsRepository.findOne({
      where: { id },
      relations: ['criterion'],
    });

    if (!question) {
      throw new NotFoundException(`Pergunta com ID ${id} não encontrada`);
    }

    return question;
  }

  async update(id: number, updateQuestionDto: UpdateQuestionDto): Promise<Question> {
    const question = await this.findOne(id);

    if (updateQuestionDto.criterionId && updateQuestionDto.criterionId !== question.criterionId) {
      await this.criteriaService.findOne(updateQuestionDto.criterionId);
    }

    Object.assign(question, updateQuestionDto);

    return this.questionsRepository.save(question);
  }

  async remove(id: number): Promise<void> {
    const question = await this.findOne(id);
    await this.questionsRepository.remove(question);
  }
}
