import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Empresa } from '../../empresas/entities/empresa.entity';
import { Selo } from '../../selos/entities/selo.entity';
import { Auditoria } from '../../auditorias/entities/auditoria.entity';

@Entity('selos_emitidos')
export class SeloEmitido {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, name: 'empresa_id' })
  empresaId: string;

  @ManyToOne(() => Empresa)
  @JoinColumn({ name: 'empresa_id' })
  empresa: Empresa;

  @Column({ type: 'int', name: 'selo_id' })
  seloId: number;

  @ManyToOne(() => Selo)
  @JoinColumn({ name: 'selo_id' })
  selo: Selo;

  @Column({ type: 'varchar', length: 50, name: 'auditoria_id', nullable: true })
  auditoriaId: string;

  @ManyToOne(() => Auditoria)
  @JoinColumn({ name: 'auditoria_id' })
  auditoria: Auditoria;

  @Column({ type: 'date', name: 'data_emissao' })
  dataEmissao: Date;

  @Column({ type: 'date', name: 'data_validade' })
  dataValidade: Date;

  @Column({ type: 'varchar', length: 50, default: 'ativo' })
  status: string; // 'ativo', 'expirado', 'revogado'

  @Column({ type: 'float', name: 'pontuacao_obtida' })
  pontuacaoObtida: number;

  @Column({ type: 'float', name: 'percentual_atingido' })
  percentualAtingido: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  qrCodeUrl: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  certificadoUrl: string;

  @CreateDateColumn({ type: 'datetime', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'updated_at' })
  updatedAt: Date;
}