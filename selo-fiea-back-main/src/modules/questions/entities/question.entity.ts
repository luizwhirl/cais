import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Criterion } from '../../criteria/entities/criterion.entity';

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'int', name: 'criterion_id' })
  criterionId: number;

  @ManyToOne(() => Criterion)
  @JoinColumn({ name: 'criterion_id' })
  criterion: Criterion;

  @Column({ type: 'text' })
  enunciado: string;

  @Column({ type: 'varchar', length: 50 })
  tipo: string;

  @Column({ type: 'boolean', default: true })
  obrigatoria: boolean;

  @CreateDateColumn({ type: 'datetime', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'updated_at' })
  updatedAt: Date;
}
