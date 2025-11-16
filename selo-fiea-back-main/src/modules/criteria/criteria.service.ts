import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Criterion } from './entities/criterion.entity';
import { CreateCriterionDto } from './dto/create-criterion.dto';
import { UpdateCriterionDto } from './dto/update-criterion.dto';
import { SelosService } from '../selos/selos.service';

@Injectable()
export class CriteriaService {
  constructor(
    @InjectRepository(Criterion)
    private criteriaRepository: Repository<Criterion>,
    private selosService: SelosService,
  ) {}

  async create(createCriterionDto: CreateCriterionDto): Promise<Criterion> {
    // Verificar se o selo existe
    await this.selosService.findOne(createCriterionDto.seloId);

    const criterion = this.criteriaRepository.create(createCriterionDto);
    return this.criteriaRepository.save(criterion);
  }

  async findAll(): Promise<Criterion[]> {
    return this.criteriaRepository.find({
      relations: ['selo'],
    });
  }

  async findBySeloId(seloId: number): Promise<Criterion[]> {
    return this.criteriaRepository.find({
      where: { seloId },
      relations: ['selo'],
    });
  }

  async findOne(id: number): Promise<Criterion> {
    const criterion = await this.criteriaRepository.findOne({
      where: { id },
      relations: ['selo'],
    });

    if (!criterion) {
      throw new NotFoundException(`Critério com ID ${id} não encontrado`);
    }

    return criterion;
  }

  async update(id: number, updateCriterionDto: UpdateCriterionDto): Promise<Criterion> {
    const criterion = await this.findOne(id);

    // Se estiver mudando o seloId, verificar se o novo selo existe
    if (updateCriterionDto.seloId && updateCriterionDto.seloId !== criterion.seloId) {
      await this.selosService.findOne(updateCriterionDto.seloId);
    }

    Object.assign(criterion, updateCriterionDto);

    return this.criteriaRepository.save(criterion);
  }

  async remove(id: number): Promise<void> {
    const criterion = await this.criteriaRepository.findOne({
      where: { id },
    });

    if (!criterion) {
      throw new NotFoundException(`Critério com ID ${id} não encontrado`);
    }

    // Tenta com snake_case
    const questionsCount = await this.criteriaRepository.query(
      'SELECT COUNT(*) as count FROM questions WHERE criterion_id = ?',
      [id]
    );

    const count = questionsCount[0].count;
    
    if (count > 0) {
      throw new BadRequestException(
        `Não é possível excluir o critério pois existem ${count} pergunta(s) vinculada(s)`
      );
    }

    await this.criteriaRepository.remove(criterion);
  }
}