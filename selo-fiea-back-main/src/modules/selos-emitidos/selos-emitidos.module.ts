import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeloEmitido } from './entities/selo-emitido.entity';
import { Auditoria } from '../auditorias/entities/auditoria.entity';
import { Selo } from '../selos/entities/selo.entity';
import { SelosEmitidosService } from './selos-emitidos.service';
import { SelosEmitidosController } from './selos-emitidos.controller';
import { QRCodeService } from './services/qrcode.service';
import { CertificadoService } from './services/certificado.service';
//import { AuditsModule } from '../audits/audits.module';
import { AuditoriasModule } from '../auditorias/auditorias.module';

@Module({
  imports: [TypeOrmModule.forFeature([SeloEmitido, Auditoria, Selo]), AuditoriasModule],
  controllers: [SelosEmitidosController],
  providers: [SelosEmitidosService, QRCodeService, CertificadoService],
  exports: [SelosEmitidosService],
})
export class SelosEmitidosModule {}