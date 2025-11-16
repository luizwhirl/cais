import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SelfAssessment } from './entities/self-assessment.entity';
import { CreateSelfAssessmentDto } from './dto/create-self-assessment.dto';
import { UpdateSelfAssessmentDto } from './dto/update-self-assessment.dto';
import { CertificationCyclesService } from '../certification-cycles/certification-cycles.service';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class SelfAssessmentsService {
  constructor(
    @InjectRepository(SelfAssessment)
    private assessmentsRepository: Repository<SelfAssessment>,
    private cyclesService: CertificationCyclesService,
    private usersService: UsersService,
    private mailService: MailService,
  ) {}

  async create(createAssessmentDto: CreateSelfAssessmentDto): Promise<SelfAssessment> {
    await this.cyclesService.findOne(createAssessmentDto.cycleId);
    await this.usersService.findById(createAssessmentDto.createdBy);

    const assessment = this.assessmentsRepository.create(createAssessmentDto);
    return this.assessmentsRepository.save(assessment);
  }

  async findAll(): Promise<SelfAssessment[]> {
    return this.assessmentsRepository.find({
      relations: ['cycle', 'creator'],
    });
  }

  async findByCycleId(cycleId: number): Promise<SelfAssessment[]> {
    return this.assessmentsRepository.find({
      where: { cycleId },
      relations: ['cycle', 'creator'],
    });
  }

  async findByUserId(userId: string): Promise<SelfAssessment[]> {
    return this.assessmentsRepository.find({
      where: { createdBy: userId },
      relations: ['cycle', 'creator'],
    });
  }

  async findOne(id: number): Promise<SelfAssessment> {
    const assessment = await this.assessmentsRepository.findOne({
      where: { id },
      relations: ['cycle', 'creator'],
    });

    if (!assessment) {
      throw new NotFoundException(`Autoavaliação com ID ${id} não encontrada`);
    }

    return assessment;
  }

  async update(id: number, updateAssessmentDto: UpdateSelfAssessmentDto): Promise<SelfAssessment> {
    const assessment = await this.findOne(id);

    if (updateAssessmentDto.cycleId && updateAssessmentDto.cycleId !== assessment.cycleId) {
      await this.cyclesService.findOne(updateAssessmentDto.cycleId);
    }

    Object.assign(assessment, updateAssessmentDto);

    return this.assessmentsRepository.save(assessment);
  }

  async submit(id: number): Promise<SelfAssessment> {
    const assessment = await this.assessmentsRepository.findOne({
      where: { id },
      relations: ['cycle', 'creator'], // Garante que carrega
    });

    if (!assessment) {
      throw new NotFoundException(`Autoavaliação com ID ${id} não encontrada`);
    }

    if (assessment.dtSubmissao) {
      throw new BadRequestException('Autoavaliação já foi submetida');
    }

    assessment.dtSubmissao = new Date();
    const savedAssessment = await this.assessmentsRepository.save(assessment);

    // Enviar email de notificação
    try {
      await this.mailService.sendSelfAssessmentSubmitted(
        assessment.creator.email,
        assessment.creator.name,
        assessment.cycle.nome,
      );
    } catch (error) {
      console.error('Erro ao enviar email:', error);
    }

    return savedAssessment;
  }

  async remove(id: number): Promise<void> {
    const assessment = await this.findOne(id);

    // Verifica se existem auditorias vinculadas
    const auditsCount = await this.assessmentsRepository
      .createQueryBuilder('assessment')
      .leftJoin('audits', 'audit', 'audit.self_assessment_id = assessment.id')
      .where('assessment.id = :id', { id })
      .getCount();

    if (auditsCount > 0) {
      throw new BadRequestException(
        `Não é possível excluir pois existem ${auditsCount} auditoria(s) vinculada(s)`
      );
    }

    await this.assessmentsRepository.remove(assessment);
  }
}
