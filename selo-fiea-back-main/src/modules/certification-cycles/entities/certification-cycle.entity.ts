import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Selo } from '../../selos/entities/selo.entity';

@Entity('certification_cycles')
export class CertificationCycle {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'int', name: 'selo_id' })
  seloId: number;

  @ManyToOne(() => Selo)
  @JoinColumn({ name: 'selo_id' })
  selo: Selo;

  @Column({ type: 'varchar', length: 100 })
  nome: string;

  @Column({ type: 'date', name: 'dt_inicio' })
  dtInicio: Date;

  @Column({ type: 'date', name: 'dt_fim' })
  dtFim: Date;

  @Column({ type: 'boolean', default: true })
  ativo: boolean;

  @CreateDateColumn({ type: 'datetime', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'updated_at' })
  updatedAt: Date;
}
