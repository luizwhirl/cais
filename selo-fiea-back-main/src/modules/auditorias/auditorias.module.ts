import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auditoria } from './entities/auditoria.entity';
import { AvaliacaoTopico } from './entities/avaliacao-topico.entity';
import { TopicoPontuacao } from './entities/topico-pontuacao.entity';
import { AuditoriasService } from './auditorias.service';
import { AuditoriasController } from './auditorias.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Auditoria, AvaliacaoTopico, TopicoPontuacao])],
  controllers: [AuditoriasController],
  providers: [AuditoriasService],
  exports: [AuditoriasService],
})
export class AuditoriasModule {}