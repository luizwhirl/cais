import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Empresa } from '../../empresas/entities/empresa.entity';
import { User } from '../../users/entities/user.entity';
import { AvaliacaoTopico } from './avaliacao-topico.entity';
import { AuditFinding } from '../../audit-findings/entities/audit-finding.entity';

@Entity('auditorias')
export class Auditoria {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  titulo: string;

  @Column({ type: 'text', nullable: true })
  descricao: string;

  @Column({ type: 'varchar', length: 50, name: 'empresa_id' })
  empresaId: string;

  @ManyToOne(() => Empresa)
  @JoinColumn({ name: 'empresa_id' })
  empresa: Empresa;

  @Column({ type: 'varchar', length: 50, name: 'auditor_responsavel_id', nullable: true })
  auditorResponsavelId: string;

  @OneToMany(() => AuditFinding, (finding) => finding.audit)
  findings: AuditFinding[];

  @ManyToOne(() => User)
  @JoinColumn({ name: 'auditor_responsavel_id' })
  auditorResponsavel: User;

  @Column({ type: 'varchar', length: 50, default: 'em_analise' })
  status: string; // 'em_analise', 'conforme', 'nao_conforme'

  @Column({ type: 'float', default: 0 })
  pontuacaoTotal: number;

  @Column({ type: 'float', default: 0 })
  pontuacaoMaxima: number;

  @Column({ type: 'float', default: 0 })
  percentualAtingido: number;

  @OneToMany(() => AvaliacaoTopico, avaliacao => avaliacao.auditoria)
  avaliacoes: AvaliacaoTopico[];

  @CreateDateColumn({ type: 'datetime', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'text', nullable: true, name: 'parecer_final' })
  parecerFinal: string;

  @Column({ type: 'datetime', nullable: true, name: 'dt_inicio' })
  dtInicio: Date;

  @Column({ type: 'datetime', nullable: true, name: 'dt_conclusao' })
  dtConclusao: Date;

  @Column({ type: 'datetime', nullable: true, name: 'dt_parecer' })
  dtParecer: Date;
}