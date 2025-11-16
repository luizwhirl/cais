import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Selo } from '../../selos/entities/selo.entity';
import { Question } from '../../questions/entities/question.entity';

@Entity('criteria')
export class Criterion {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'int', name: 'selo_id' })
  seloId: number;

  @ManyToOne(() => Selo, selo => selo.criteria)
  @JoinColumn({ name: 'selo_id' })
  selo: Selo;

  @Column({ type: 'varchar', length: 100 })
  pilar: string;

  @Column({ type: 'text' })
  descricao: string;

  @Column({ type: 'float' })
  peso: number;

  @Column({ type: 'boolean', default: false })
  setorial: boolean;

  @CreateDateColumn({ type: 'datetime', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'updated_at' })
  updatedAt: Date;
}