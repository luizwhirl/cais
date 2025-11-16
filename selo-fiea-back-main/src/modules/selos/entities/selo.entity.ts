import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Criterion } from '../../criteria/entities/criterion.entity';

@Entity('selos')
export class Selo {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 255 })
  nome: string;

  @Column({ type: 'text', nullable: true })
  descricao: string;

  @Column({ type: 'int', name: 'validade_meses' })
  validadeMeses: number;

  @Column({ type: 'date', name: 'dt_inicio_emissao', nullable: true })
  dtInicioEmissao: Date;

  @Column({ type: 'date', name: 'dt_fim_emissao', nullable: true })
  dtFimEmissao: Date;

  @OneToMany(() => Criterion, criterion => criterion.selo)
  criteria: Criterion[];

  @CreateDateColumn({ type: 'datetime', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'updated_at' })
  updatedAt: Date;
}