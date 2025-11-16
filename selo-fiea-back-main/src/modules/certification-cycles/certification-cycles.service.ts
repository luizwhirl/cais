import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CertificationCycle } from './entities/certification-cycle.entity';
import { CreateCertificationCycleDto } from './dto/create-certification-cycle.dto';
import { UpdateCertificationCycleDto } from './dto/update-certification-cycle.dto';
import { SelosService } from '../selos/selos.service';

@Injectable()
export class CertificationCyclesService {
  constructor(
    @InjectRepository(CertificationCycle)
    private cyclesRepository: Repository<CertificationCycle>,
    private selosService: SelosService,
  ) {}

  async create(createCycleDto: CreateCertificationCycleDto): Promise<CertificationCycle> {
    await this.selosService.findOne(createCycleDto.seloId);

    const cycle = this.cyclesRepository.create(createCycleDto);
    return this.cyclesRepository.save(cycle);
  }

  async findAll(): Promise<CertificationCycle[]> {
    return this.cyclesRepository.find({
      relations: ['selo'],
    });
  }

  async findBySeloId(seloId: number): Promise<CertificationCycle[]> {
    return this.cyclesRepository.find({
      where: { seloId },
      relations: ['selo'],
    });
  }

  async findOne(id: number): Promise<CertificationCycle> {
    const cycle = await this.cyclesRepository.findOne({
      where: { id },
      relations: ['selo'],
    });

    if (!cycle) {
      throw new NotFoundException(`Ciclo com ID ${id} não encontrado`);
    }

    return cycle;
  }

  async update(id: number, updateCycleDto: UpdateCertificationCycleDto): Promise<CertificationCycle> {
    const cycle = await this.findOne(id);

    if (updateCycleDto.seloId && updateCycleDto.seloId !== cycle.seloId) {
      await this.selosService.findOne(updateCycleDto.seloId);
    }

    Object.assign(cycle, updateCycleDto);

    return this.cyclesRepository.save(cycle);
  }

  async remove(id: number): Promise<void> {
    const cycle = await this.findOne(id);
    cycle.ativo = false;
    await this.cyclesRepository.save(cycle);
  }
}
