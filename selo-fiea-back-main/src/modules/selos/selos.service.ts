import { Injectable, NotFoundException, BadRequestException  } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Selo } from './entities/selo.entity';
import { CreateSeloDto } from './dto/create-selo.dto';
import { UpdateSeloDto } from './dto/update-selo.dto';

@Injectable()
export class SelosService {
  constructor(
    @InjectRepository(Selo)
    private selosRepository: Repository<Selo>,
  ) {}

  async create(createSeloDto: CreateSeloDto): Promise<Selo> {
    const selo = this.selosRepository.create(createSeloDto);
    return this.selosRepository.save(selo);
  }

  async findAll(): Promise<Selo[]> {
    return this.selosRepository.find({
      relations: ['criteria'],
    });
  }

  async findOne(id: number): Promise<Selo> {
    const selo = await this.selosRepository.findOne({
      where: { id },
      relations: ['criteria'],
    });

    if (!selo) {
      throw new NotFoundException(`Selo com ID ${id} não encontrado`);
    }

    return selo;
  }

  async update(id: number, updateSeloDto: UpdateSeloDto): Promise<Selo> {
    const selo = await this.findOne(id);
    
    Object.assign(selo, updateSeloDto);
    
    return this.selosRepository.save(selo);
  }

  async remove(id: number): Promise<void> {
    const selo = await this.selosRepository.findOne({
      where: { id },
      relations: ['criteria'], // Carrega os critérios
    });

    if (!selo) {
      throw new NotFoundException('Selo não encontrado');
    }

    // Verifica se tem critérios vinculados
    if (selo.criteria && selo.criteria.length > 0) {
      throw new BadRequestException(
        `Não é possível excluir o selo pois existem ${selo.criteria.length} critério(s) vinculado(s)`
      );
    }

    await this.selosRepository.remove(selo);
  }
}