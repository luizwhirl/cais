import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('topicos_pontuacao')
export class TopicoPontuacao {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 255 })
  titulo: string;

  @Column({ type: 'text', nullable: true })
  descricao: string;

  @Column({ type: 'float', name: 'pontos_nivel_1', default: 0 })
  pontosNivel1: number;

  @Column({ type: 'float', name: 'pontos_nivel_2', default: 0 })
  pontosNivel2: number;

  @Column({ type: 'float', name: 'pontos_nivel_3', default: 0 })
  pontosNivel3: number;

  @Column({ type: 'float', name: 'pontos_nivel_4', default: 0 })
  pontosNivel4: number;

  @Column({ type: 'int', default: 1 })
  ordem: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'datetime', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'updated_at' })
  updatedAt: Date;
}