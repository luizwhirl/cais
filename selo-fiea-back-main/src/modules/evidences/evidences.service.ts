import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Evidence } from './entities/evidence.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class EvidencesService {
  constructor(
    @InjectRepository(Evidence)
    private evidencesRepository: Repository<Evidence>,
  ) {}

  async create(
    file: Express.Multer.File,
    questionId?: number,
    selfAssessmentId?: number,
  ): Promise<Evidence> {
    if (!file) {
      throw new BadRequestException('Arquivo é obrigatório');
    }

    if (!questionId && !selfAssessmentId) {
      throw new BadRequestException('questionId ou selfAssessmentId é obrigatório');
    }

    const evidence = this.evidencesRepository.create({
      questionId,
      selfAssessmentId,
      originalName: file.originalname,
      fileName: file.filename,
      filePath: file.path,
      mimeType: file.mimetype,
      fileSize: file.size,
    });

    return this.evidencesRepository.save(evidence);
  }

  async findAll(): Promise<Evidence[]> {
    return this.evidencesRepository.find({
      relations: ['question', 'selfAssessment'],
    });
  }

  async findByQuestionId(questionId: number): Promise<Evidence[]> {
    return this.evidencesRepository.find({
      where: { questionId },
      relations: ['question'],
    });
  }

  async findBySelfAssessmentId(selfAssessmentId: number): Promise<Evidence[]> {
    return this.evidencesRepository.find({
      where: { selfAssessmentId },
      relations: ['selfAssessment'],
    });
  }

  async findOne(id: number): Promise<Evidence> {
    const evidence = await this.evidencesRepository.findOne({
      where: { id },
      relations: ['question', 'selfAssessment'],
    });

    if (!evidence) {
      throw new NotFoundException(`Evidência com ID ${id} não encontrada`);
    }

    return evidence;
  }

  async remove(id: number): Promise<void> {
    const evidence = await this.findOne(id);

    // Remover arquivo físico
    try {
      if (fs.existsSync(evidence.filePath)) {
        fs.unlinkSync(evidence.filePath);
      }
    } catch (error) {
      console.error('Erro ao remover arquivo:', error);
    }

    await this.evidencesRepository.remove(evidence);
  }

  async getFilePath(id: number): Promise<string> {
    const evidence = await this.findOne(id);

    if (!fs.existsSync(evidence.filePath)) {
      throw new NotFoundException('Arquivo não encontrado no servidor');
    }

    return evidence.filePath;
  }
}
