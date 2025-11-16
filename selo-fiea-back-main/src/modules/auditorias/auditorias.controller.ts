import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { AuditoriasService } from './auditorias.service';
import { CreateAuditoriaDto } from './dto/create-auditoria.dto';
import { UpdateAuditoriaDto } from './dto/update-auditoria.dto';
import { AvaliarTopicoDto } from './dto/avaliar-topico.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '../../common/enums/roles.enum';

@Controller('auditorias')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AuditoriasController {
  constructor(private readonly auditoriasService: AuditoriasService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.GESTOR)
  create(@Body() createAuditoriaDto: CreateAuditoriaDto) {
    return this.auditoriasService.create(createAuditoriaDto);
  }

  @Post('topicos-pontuacao')
  @Roles(UserRole.ADMIN, UserRole.GESTOR)
  criarTopico(@Body() createTopicoDto: any) {
    return this.auditoriasService.criarTopico(createTopicoDto);
  }

  @Get('topicos-pontuacao')
  @Roles(UserRole.ADMIN, UserRole.GESTOR, UserRole.AUDITOR)
  getTopicos() {
    return this.auditoriasService.getTopicos();
  }

  @Post(':id/avaliar-topico')
  @Roles(UserRole.ADMIN, UserRole.GESTOR, UserRole.AUDITOR)
  avaliarTopico(
    @Param('id') id: string,
    @Body() avaliarTopicoDto: AvaliarTopicoDto,
    @CurrentUser() user: any,
  ) {
    return this.auditoriasService.avaliarTopico(id, avaliarTopicoDto, user.id);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.GESTOR, UserRole.AUDITOR)
  findAll() {
    return this.auditoriasService.findAll();
  }

  // ← @Get(':id') DEVE VIR DEPOIS DOS ENDPOINTS ESPECÍFICOS
  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.GESTOR, UserRole.AUDITOR)
  findOne(@Param('id') id: string) {
    return this.auditoriasService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.GESTOR)
  update(@Param('id') id: string, @Body() updateAuditoriaDto: UpdateAuditoriaDto) {
    return this.auditoriasService.update(id, updateAuditoriaDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.GESTOR)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.auditoriasService.remove(id);
  }

  @Post(':id/parecer')
  @Roles(UserRole.ADMIN, UserRole.GESTOR, UserRole.AUDITOR)
  submeterParecer(
    @Param('id') id: string,
    @Body() parecerDto: any, // Crie o DTO apropriado
    @CurrentUser() user: any,
  ) {
    return this.auditoriasService.submeterParecer(id, parecerDto, user.id);
  }
}