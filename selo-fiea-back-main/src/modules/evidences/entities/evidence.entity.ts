import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Question } from '../../questions/entities/question.entity';
import { SelfAssessment } from '../../self-assessments/entities/self-assessment.entity';

@Entity('evidences')
export class Evidence {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'int', name: 'question_id', nullable: true })
  questionId: number;

  @ManyToOne(() => Question, { nullable: true })
  @JoinColumn({ name: 'question_id' })
  question: Question;

  @Column({ type: 'int', name: 'self_assessment_id', nullable: true })
  selfAssessmentId: number;

  @ManyToOne(() => SelfAssessment, { nullable: true })
  @JoinColumn({ name: 'self_assessment_id' })
  selfAssessment: SelfAssessment;

  @Column({ type: 'varchar', length: 255, name: 'original_name' })
  originalName: string;

  @Column({ type: 'varchar', length: 255, name: 'file_name' })
  fileName: string;

  @Column({ type: 'varchar', length: 500, name: 'file_path' })
  filePath: string;

  @Column({ type: 'varchar', length: 100, name: 'mime_type' })
  mimeType: string;

  @Column({ type: 'bigint', name: 'file_size' })
  fileSize: number;

  @CreateDateColumn({ type: 'datetime', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'updated_at' })
  updatedAt: Date;
}
