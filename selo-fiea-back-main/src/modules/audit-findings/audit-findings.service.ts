import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditFinding } from './entities/audit-finding.entity';
import { CreateAuditFindingDto } from './dto/create-audit-finding.dto';
import { UpdateAuditFindingDto } from './dto/update-audit-finding.dto';
//import { AuditsService } from '../audits/audits.service';
import { CriteriaService } from '../criteria/criteria.service';
import { AuditoriasService } from '../auditorias/auditorias.service';

@Injectable()
export class AuditFindingsService {
  constructor(
    @InjectRepository(AuditFinding)
    private findingsRepository: Repository<AuditFinding>,
    //private auditsService: AuditsService,
    private auditoriasService: AuditoriasService,
    private criteriaService: CriteriaService,
  ) {}

  async create(createFindingDto: CreateAuditFindingDto): Promise<AuditFinding> {
    await this.auditoriasService.findOne(createFindingDto.auditId);
    await this.criteriaService.findOne(createFindingDto.criterionId);

    const finding = this.findingsRepository.create(createFindingDto);
    return this.findingsRepository.save(finding);
  }

  async findAll(): Promise<AuditFinding[]> {
    return this.findingsRepository.find({
      relations: ['audit', 'criterion'],
    });
  }

  async findByAuditId(auditId: string): Promise<AuditFinding[]> {
    return this.findingsRepository.find({
      where: { auditId },
      relations: ['audit', 'criterion'],
    });
  }

  async findOne(id: number): Promise<AuditFinding> {
    const finding = await this.findingsRepository.findOne({
      where: { id },
      relations: ['audit', 'criterion'],
    });

    if (!finding) {
      throw new NotFoundException(`Parecer com ID ${id} não encontrado`);
    }

    return finding;
  }

  async update(id: number, updateFindingDto: UpdateAuditFindingDto): Promise<AuditFinding> {
    const finding = await this.findOne(id);

    if (updateFindingDto.auditId && updateFindingDto.auditId !== finding.auditId) {
      await this.auditoriasService.findOne(updateFindingDto.auditId);
    }

    if (updateFindingDto.criterionId && updateFindingDto.criterionId !== finding.criterionId) {
      await this.criteriaService.findOne(updateFindingDto.criterionId);
    }

    Object.assign(finding, updateFindingDto);

    return this.findingsRepository.save(finding);
  }

  async remove(id: number): Promise<void> {
    const finding = await this.findOne(id);
    await this.findingsRepository.remove(finding);
  }
}
