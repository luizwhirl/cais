import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auditoria } from './entities/auditoria.entity';
import { AvaliacaoTopico } from './entities/avaliacao-topico.entity';
import { TopicoPontuacao } from './entities/topico-pontuacao.entity';
import { CreateAuditoriaDto } from './dto/create-auditoria.dto';
import { AvaliarTopicoDto } from './dto/avaliar-topico.dto';
import { UpdateAuditoriaDto } from './dto/update-auditoria.dto';

@Injectable()
export class AuditoriasService {
  constructor(
    @InjectRepository(Auditoria)
    private auditoriasRepository: Repository<Auditoria>,
    @InjectRepository(AvaliacaoTopico)
    private avaliacoesRepository: Repository<AvaliacaoTopico>,
    @InjectRepository(TopicoPontuacao)
    private topicosRepository: Repository<TopicoPontuacao>,
  ) {}

  async create(createAuditoriaDto: CreateAuditoriaDto): Promise<Auditoria> {
    // Calcular pontuação máxima possível baseada nos tópicos ativos
    const topicos = await this.topicosRepository.find({ where: { isActive: true } });
    const pontuacaoMaxima = topicos.reduce((sum, topico) => {
      return sum + topico.pontosNivel1 + topico.pontosNivel2 + topico.pontosNivel3 + topico.pontosNivel4;
    }, 0);

    const auditoria = this.auditoriasRepository.create({
      ...createAuditoriaDto,
      pontuacaoMaxima,
      status: 'em_analise',
    });

    return this.auditoriasRepository.save(auditoria);
  }

  async avaliarTopico(auditoriaId: string, avaliarTopicoDto: AvaliarTopicoDto, userId: string): Promise<AvaliacaoTopico> {
    const auditoria = await this.findOne(auditoriaId);

    if (auditoria.auditorResponsavelId && auditoria.auditorResponsavelId !== userId) {
      throw new BadRequestException(
        'Somente o auditor responsável pode avaliar tópicos desta auditoria'
      );
    }

    const topico = await this.topicosRepository.findOne({ where: { id: avaliarTopicoDto.topicoId } });

    if (!topico) {
      throw new NotFoundException('Tópico não encontrado');
    }

    // Calcular pontuação obtida (soma dos níveis até o nível atingido)
    const pontuacaoObtida = this.calcularPontuacaoTopico(topico, avaliarTopicoDto.nivelAtingido);

    // Verificar se já existe avaliação para este tópico
    let avaliacao = await this.avaliacoesRepository.findOne({
      where: {
        auditoriaId,
        topicoId: avaliarTopicoDto.topicoId,
      },
    });

    if (avaliacao) {
      // Atualizar avaliação existente
      avaliacao.nivelAtingido = avaliarTopicoDto.nivelAtingido;
      avaliacao.pontuacaoObtida = pontuacaoObtida;
      avaliacao.observacoes = avaliarTopicoDto.observacoes;
      avaliacao.avaliadoPorId = userId;
    } else {
      // Criar nova avaliação
      avaliacao = this.avaliacoesRepository.create({
        auditoriaId,
        topicoId: avaliarTopicoDto.topicoId,
        nivelAtingido: avaliarTopicoDto.nivelAtingido,
        pontuacaoObtida,
        observacoes: avaliarTopicoDto.observacoes,
        avaliadoPorId: userId,
      });
    }

    await this.avaliacoesRepository.save(avaliacao);

    // Recalcular pontuação total da auditoria
    await this.recalcularPontuacao(auditoriaId);

    return avaliacao;
  }

  private calcularPontuacaoTopico(topico: TopicoPontuacao, nivelAtingido: number): number {
    let pontuacao = 0;

    // Soma os pontos de todos os níveis até o nível atingido
    if (nivelAtingido >= 1) pontuacao += topico.pontosNivel1;
    if (nivelAtingido >= 2) pontuacao += topico.pontosNivel2;
    if (nivelAtingido >= 3) pontuacao += topico.pontosNivel3;
    if (nivelAtingido >= 4) pontuacao += topico.pontosNivel4;

    return pontuacao;
  }

  async recalcularPontuacao(auditoriaId: string): Promise<void> {
    const avaliacoes = await this.avaliacoesRepository.find({
      where: { auditoriaId },
    });

    const pontuacaoTotal = avaliacoes.reduce((sum, avaliacao) => sum + avaliacao.pontuacaoObtida, 0);

    const auditoria = await this.findOne(auditoriaId);
    const percentualAtingido = auditoria.pontuacaoMaxima > 0 
      ? (pontuacaoTotal / auditoria.pontuacaoMaxima) * 100 
      : 0;

    // Determinar status baseado no percentual (≥ 75% = Conforme)
    let status = 'em_analise';
    if (avaliacoes.length > 0) {
      status = percentualAtingido >= 75 ? 'conforme' : 'nao_conforme';
    }

    await this.auditoriasRepository.update(auditoriaId, {
      pontuacaoTotal,
      percentualAtingido,
      status,
    });
  }

  async findAll(): Promise<Auditoria[]> {
    return this.auditoriasRepository.find({
      relations: ['empresa', 'auditorResponsavel', 'avaliacoes', 'avaliacoes.topico'],
    });
  }

  async findOne(id: string): Promise<Auditoria> {
    const auditoria = await this.auditoriasRepository.findOne({
      where: { id },
      relations: ['empresa', 'auditorResponsavel', 'avaliacoes', 'avaliacoes.topico'],
    });

    if (!auditoria) {
      throw new NotFoundException('Auditoria não encontrada');
    }

    return auditoria;
  }

  async update(id: string, updateAuditoriaDto: UpdateAuditoriaDto): Promise<Auditoria> {
    const auditoria = await this.findOne(id);
    Object.assign(auditoria, updateAuditoriaDto);
    return this.auditoriasRepository.save(auditoria);
  }

  async remove(id: string): Promise<void> {
    const auditoria = await this.auditoriasRepository.findOne({
      where: { id },
      relations: ['avaliacoes'],
    });

    if (!auditoria) {
      throw new NotFoundException('Auditoria não encontrada');
    }

    // Verifica se tem avaliações vinculadas
    if (auditoria.avaliacoes && auditoria.avaliacoes.length > 0) {
      throw new BadRequestException(
        `Não é possível excluir pois existem ${auditoria.avaliacoes.length} avaliação(ões) de tópico vinculada(s)`
      );
    }

    await this.auditoriasRepository.remove(auditoria);
  }

  async criarTopico(createTopicoDto: any): Promise<any> {
    const topico = this.topicosRepository.create({
      ...createTopicoDto,
      isActive: true,
    });
    
    return this.topicosRepository.save(topico);
  }

  async getTopicos(): Promise<TopicoPontuacao[]> {
    return this.topicosRepository.find({ where: { isActive: true } });
  }

  async submeterParecer(id: string, parecerDto: any, userId: string) {
    const auditoria = await this.auditoriasRepository.findOne({
      where: { id },
    });

    if (!auditoria) {
      throw new NotFoundException(`Auditoria com ID ${id} não encontrada`);
    }

    // Atualiza o parecer e status
    auditoria.parecerFinal = parecerDto.parecerFinal;
    auditoria.status = parecerDto.status; // 'conforme' ou 'nao_conforme'
    auditoria.dtParecer = new Date();
    
    // Opcional: registrar data de conclusão se ainda não tiver
    if (!auditoria.dtConclusao) {
      auditoria.dtConclusao = new Date();
    }

    return await this.auditoriasRepository.save(auditoria);
  }
}