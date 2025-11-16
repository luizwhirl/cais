import { Controller, Get, Post, Body, Param, Patch, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { SelosEmitidosService } from './selos-emitidos.service';
import { EmitirSeloDto } from './dto/emitir-selo.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/roles.enum';
//import { EmitirSeloComAuditDto } from './dto/emitir-selo-com-audit.dto';

@Controller('selos-emitidos')
export class SelosEmitidosController {
  constructor(private readonly selosEmitidosService: SelosEmitidosService) {}

  @Post('emitir')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.GESTOR)
  emitirSelo(@Body() emitirSeloDto: EmitirSeloDto) {
    return this.selosEmitidosService.emitirSelo(emitirSeloDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.GESTOR, UserRole.AUDITOR)
  findAll() {
    return this.selosEmitidosService.findAll();
  }

  @Get('empresa/:empresaId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  findByEmpresa(@Param('empresaId') empresaId: string) {
    return this.selosEmitidosService.findByEmpresa(empresaId);
  }

  @Get('validar/:id')
  // Endpoint PÚBLICO (sem autenticação) para validação do selo
  validarSelo(@Param('id') id: string) {
    return this.selosEmitidosService.validarSeloPublico(id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  findOne(@Param('id') id: string) {
    return this.selosEmitidosService.findOne(id);
  }

  @Patch(':id/revogar')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.GESTOR)
  @HttpCode(HttpStatus.OK)
  revogarSelo(@Param('id') id: string) {
    return this.selosEmitidosService.revogarSelo(id);
  }

  @Post('verificar-expirados')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  async verificarExpirados() {
    await this.selosEmitidosService.verificarSelosExpirados();
    return { message: 'Verificação de selos expirados concluída' };
  }

  @Get(':id/certificado')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async visualizarCertificado(@Param('id') id: string) {
    const html = await this.selosEmitidosService.gerarCertificadoDigital(id);
    return html;
  }
}