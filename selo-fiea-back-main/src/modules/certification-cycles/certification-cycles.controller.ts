import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { CertificationCyclesService } from './certification-cycles.service';
import { CreateCertificationCycleDto } from './dto/create-certification-cycle.dto';
import { UpdateCertificationCycleDto } from './dto/update-certification-cycle.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/roles.enum';

@Controller('certification-cycles')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CertificationCyclesController {
  constructor(private readonly cyclesService: CertificationCyclesService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.GESTOR)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createCycleDto: CreateCertificationCycleDto) {
    return this.cyclesService.create(createCycleDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.GESTOR, UserRole.AUDITOR)
  findAll(@Query('seloId') seloId?: string) {
    if (seloId) {
      return this.cyclesService.findBySeloId(+seloId);
    }
    return this.cyclesService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.GESTOR, UserRole.AUDITOR)
  findOne(@Param('id') id: string) {
    return this.cyclesService.findOne(+id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.GESTOR)
  update(@Param('id') id: string, @Body() updateCycleDto: UpdateCertificationCycleDto) {
    return this.cyclesService.update(+id, updateCycleDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.GESTOR)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.cyclesService.remove(+id);
  }
}