import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { CertificationCycle } from '../../certification-cycles/entities/certification-cycle.entity';
import { User } from '../../users/entities/user.entity';

@Entity('self_assessments')
export class SelfAssessment {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'int', name: 'cycle_id' })
  cycleId: number;

  @ManyToOne(() => CertificationCycle)
  @JoinColumn({ name: 'cycle_id' })
  cycle: CertificationCycle;

  @Column({ type: 'varchar', length: 36, name: 'created_by' })
  createdBy: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  creator: User;

  @Column({ type: 'datetime', name: 'dt_submissao', nullable: true })
  dtSubmissao: Date;

  @CreateDateColumn({ type: 'datetime', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'updated_at' })
  updatedAt: Date;
}
