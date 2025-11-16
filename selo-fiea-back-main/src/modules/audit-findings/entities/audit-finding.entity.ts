import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
//import { Audit } from '../../audits/entities/audit.entity';
import { Auditoria } from '../../auditorias/entities/auditoria.entity';
import { Criterion } from '../../criteria/entities/criterion.entity';

@Entity('audit_findings')
export class AuditFinding {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 50, name: 'audit_id' })
  auditId: string;

  @ManyToOne(() => Auditoria, (auditoria) => auditoria.findings)
  @JoinColumn({ name: 'audit_id' })
  audit: Auditoria;

  @Column({ type: 'int', name: 'criterion_id' })
  criterionId: number;

  @ManyToOne(() => Criterion)
  @JoinColumn({ name: 'criterion_id' })
  criterion: Criterion;

  @Column({ type: 'varchar', length: 50 })
  tipo: string; // conformidade, nao_conformidade, observacao, recomendacao

  @Column({ type: 'text' })
  descricao: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  gravidade: string; // baixa, media, alta, critica

  @Column({ type: 'text', nullable: true })
  acao_recomendada: string;

  @CreateDateColumn({ type: 'datetime', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'updated_at' })
  updatedAt: Date;
}
