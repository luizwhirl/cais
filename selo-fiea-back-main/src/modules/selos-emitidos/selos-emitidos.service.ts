import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { SeloEmitido } from './entities/selo-emitido.entity';
import { Auditoria } from '../auditorias/entities/auditoria.entity';
import { Selo } from '../selos/entities/selo.entity';
import { EmitirSeloDto } from './dto/emitir-selo.dto';
import { QRCodeService } from './services/qrcode.service';
import { CertificadoService } from './services/certificado.service';
import { AuditoriasService } from '../auditorias/auditorias.service';
//import { AuditsService } from '../audits/audits.service';

@Injectable()
export class SelosEmitidosService {
  constructor(
    @InjectRepository(SeloEmitido)
    private selosEmitidosRepository: Repository<SeloEmitido>,
    private auditoriasService: AuditoriasService,
    @InjectRepository(Auditoria)
    private auditoriasRepository: Repository<Auditoria>,
    @InjectRepository(Selo)
    private selosRepository: Repository<Selo>,
    private qrcodeService: QRCodeService,
    private certificadoService: CertificadoService,
  ) {}

  async emitirSelo(emitirSeloDto: EmitirSeloDto): Promise<SeloEmitido> {
    const { auditoriaId, seloId } = emitirSeloDto;

    const auditoria = await this.auditoriasRepository.findOne({
      where: { id: auditoriaId },
      relations: ['empresa'],
    });

    if (!auditoria) {
      throw new NotFoundException('Auditoria não encontrada');
    }

    if (auditoria.status !== 'conforme') {
      throw new BadRequestException(
        `Auditoria não está conforme. Percentual atingido: ${auditoria.percentualAtingido.toFixed(2)}% (mínimo: 75%)`,
      );
    }

    const selo = await this.selosRepository.findOne({
      where: { id: seloId },
    });

    if (!selo) {
      throw new NotFoundException('Selo não encontrado');
    }

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    if (selo.dtInicioEmissao) {
      const dataInicio = new Date(selo.dtInicioEmissao);
      dataInicio.setHours(0, 0, 0, 0);
      
      if (hoje < dataInicio) {
        throw new BadRequestException(
          `Selo ainda não pode ser emitido. Data de início: ${dataInicio.toLocaleDateString('pt-BR')}`,
        );
      }
    }

    if (selo.dtFimEmissao) {
      const dataFim = new Date(selo.dtFimEmissao);
      dataFim.setHours(23, 59, 59, 999);
      
      if (hoje > dataFim) {
        throw new BadRequestException(
          `Janela de emissão encerrada. Data limite: ${dataFim.toLocaleDateString('pt-BR')}`,
        );
      }
    }

    const seloExistente = await this.selosEmitidosRepository.findOne({
      where: {
        empresaId: auditoria.empresaId,
        seloId: seloId,
        status: 'ativo',
      },
    });

    if (seloExistente) {
      throw new BadRequestException('Empresa já possui este selo ativo');
    }

    const dataEmissao = new Date();
    const dataValidade = new Date();
    dataValidade.setMonth(dataValidade.getMonth() + selo.validadeMeses);

    const seloEmitido = this.selosEmitidosRepository.create({
      empresaId: auditoria.empresaId,
      seloId: seloId,
      auditoriaId: auditoriaId,
      dataEmissao,
      dataValidade,
      status: 'ativo',
      pontuacaoObtida: auditoria.pontuacaoTotal,
      percentualAtingido: auditoria.percentualAtingido,
    });

    const seloSalvo = await this.selosEmitidosRepository.save(seloEmitido);

    const seloCompleto = await this.findOne(seloSalvo.id);
    const seloData = this.qrcodeService.generateSeloData(seloCompleto);
    const qrCodeDataURL = await this.qrcodeService.generateQRCode(seloData);

    seloSalvo.qrCodeUrl = qrCodeDataURL;
    await this.selosEmitidosRepository.save(seloSalvo);

    return seloSalvo;
  }
/*
  async emitirSeloComAudit(auditId: number, seloId: number, empresaId: string): Promise<SeloEmitido> {
    const audit = await this.auditoriasService.findOne(String(auditId));

    if (!audit) {
      throw new NotFoundException('Audit não encontrada');
    }

    if (audit.status !== 'conforme') {
      throw new BadRequestException(
        `Auditoria não está conforme. Status: ${audit.status}`,
      );
    }

    const selo = await this.selosRepository.findOne({
      where: { id: seloId },
    });

    if (!selo) {
      throw new NotFoundException('Selo não encontrado');
    }

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    if (selo.dtInicioEmissao) {
      const dataInicio = new Date(selo.dtInicioEmissao);
      dataInicio.setHours(0, 0, 0, 0);
      if (hoje < dataInicio) {
        throw new BadRequestException(
          `Selo ainda não pode ser emitido. Data de início: ${dataInicio.toLocaleDateString('pt-BR')}`,
        );
      }
    }

    if (selo.dtFimEmissao) {
      const dataFim = new Date(selo.dtFimEmissao);
      dataFim.setHours(23, 59, 59, 999);
      if (hoje > dataFim) {
        throw new BadRequestException(
          `Janela de emissão encerrada. Data limite: ${dataFim.toLocaleDateString('pt-BR')}`,
        );
      }
    }

    const seloExistente = await this.selosEmitidosRepository.findOne({
      where: {
        empresaId: empresaId,
        seloId: seloId,
        status: 'ativo',
      },
    });

    if (seloExistente) {
      throw new BadRequestException('Empresa já possui este selo ativo');
    }

    const dataEmissao = new Date();
    const dataValidade = new Date();
    dataValidade.setMonth(dataValidade.getMonth() + selo.validadeMeses);

    const seloEmitido = this.selosEmitidosRepository.create({
      empresaId: empresaId,
      seloId: seloId,
      auditId: auditId,
      auditoriaId: null,
      dataEmissao,
      dataValidade,
      status: 'ativo',
      pontuacaoObtida: audit.pontuacaoTotal || 0,
      percentualAtingido: audit.percentualAtingido || 0,
    });

    const seloSalvo = await this.selosEmitidosRepository.save(seloEmitido);

    // Gerar QRCode
    const seloCompleto = await this.findOne(seloSalvo.id);
    const seloData = this.qrcodeService.generateSeloData(seloCompleto);
    const qrCodeDataURL = await this.qrcodeService.generateQRCode(seloData);

    seloSalvo.qrCodeUrl = qrCodeDataURL;
    await this.selosEmitidosRepository.save(seloSalvo);

    return seloSalvo;
  }
*/
  async findAll(): Promise<SeloEmitido[]> {
    return this.selosEmitidosRepository.find({
      relations: ['empresa', 'selo', 'auditoria'],
    });
  }

  async findByEmpresa(empresaId: string): Promise<SeloEmitido[]> {
    return this.selosEmitidosRepository.find({
      where: { empresaId },
      relations: ['empresa', 'selo', 'auditoria'],
    });
  }

  async findOne(id: string): Promise<SeloEmitido> {
    const seloEmitido = await this.selosEmitidosRepository.findOne({
      where: { id },
      relations: ['empresa', 'selo', 'auditoria'],
    });

    if (!seloEmitido) {
      throw new NotFoundException('Selo emitido não encontrado');
    }

    return seloEmitido;
  }

  async revogarSelo(id: string): Promise<SeloEmitido> {
    const seloEmitido = await this.findOne(id);

    if (seloEmitido.status !== 'ativo') {
      throw new BadRequestException('Selo não está ativo');
    }

    seloEmitido.status = 'revogado';
    return this.selosEmitidosRepository.save(seloEmitido);
  }

  async verificarSelosExpirados(): Promise<void> {
    const hoje = new Date();
    
    const selosExpirados = await this.selosEmitidosRepository.find({
      where: {
        status: 'ativo',
        dataValidade: LessThan(hoje),
      },
    });

    for (const selo of selosExpirados) {
      selo.status = 'expirado';
      await this.selosEmitidosRepository.save(selo);
    }
  }

  async gerarCertificadoDigital(id: string): Promise<string> {
    const seloEmitido = await this.findOne(id);
    return this.certificadoService.gerarSeloDigital(seloEmitido);
  }

  async validarSeloPublico(id: string): Promise<any> {
    const seloEmitido = await this.selosEmitidosRepository.findOne({
      where: { id },
      relations: ['empresa', 'selo'],
    });

    if (!seloEmitido) {
      throw new NotFoundException('Selo não encontrado');
    }

    return {
      id: seloEmitido.id,
      empresa: {
        razaoSocial: seloEmitido.empresa?.razaoSocial,
        nomeFantasia: seloEmitido.empresa?.nomeFantasia,
        cnpj: seloEmitido.empresa?.cnpj,
      },
      selo: {
        nome: seloEmitido.selo?.nome,
        descricao: seloEmitido.selo?.descricao,
      },
      dataEmissao: seloEmitido.dataEmissao,
      dataValidade: seloEmitido.dataValidade,
      status: seloEmitido.status,
      percentualAtingido: seloEmitido.percentualAtingido,
      qrCodeUrl: seloEmitido.qrCodeUrl,
      isValido: seloEmitido.status === 'ativo' && new Date() <= new Date(seloEmitido.dataValidade),
    };
  }
}