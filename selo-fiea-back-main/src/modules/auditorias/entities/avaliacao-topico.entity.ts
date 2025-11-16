import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Auditoria } from './auditoria.entity';
import { TopicoPontuacao } from './topico-pontuacao.entity';
import { User } from '../../users/entities/user.entity';

@Entity('avaliacoes_topicos')
export class AvaliacaoTopico {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, name: 'auditoria_id' })
  auditoriaId: string;

  @ManyToOne(() => Auditoria, auditoria => auditoria.avaliacoes)
  @JoinColumn({ name: 'auditoria_id' })
  auditoria: Auditoria;

  @Column({ type: 'int', name: 'topico_id' })
  topicoId: number;

  @ManyToOne(() => TopicoPontuacao)
  @JoinColumn({ name: 'topico_id' })
  topico: TopicoPontuacao;

  @Column({ type: 'int', name: 'nivel_atingido' })
  nivelAtingido: number; // 1, 2, 3 ou 4

  @Column({ type: 'float', name: 'pontuacao_obtida', default: 0 })
  pontuacaoObtida: number;

  @Column({ type: 'text', nullable: true })
  observacoes: string;

  @Column({ type: 'varchar', length: 50, name: 'avaliado_por_id', nullable: true })
  avaliadoPorId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'avaliado_por_id' })
  avaliadoPor: User;

  @CreateDateColumn({ type: 'datetime', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'updated_at' })
  updatedAt: Date;
}