import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { SelfAssessmentsService } from './self-assessments.service';
import { CreateSelfAssessmentDto } from './dto/create-self-assessment.dto';
import { UpdateSelfAssessmentDto } from './dto/update-self-assessment.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '../../common/enums/roles.enum';

@Controller('self-assessments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SelfAssessmentsController {
  constructor(private readonly assessmentsService: SelfAssessmentsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createAssessmentDto: CreateSelfAssessmentDto, @CurrentUser() user: any) {
    return this.assessmentsService.create(createAssessmentDto);
  }

  @Get()
  findAll(@CurrentUser() user: any, @Query('cycleId') cycleId?: string, @Query('userId') userId?: string) {
    // Usuários comuns só podem ver suas próprias avaliações
    if (user.role !== UserRole.ADMIN && user.role !== UserRole.GESTOR && user.role !== UserRole.AUDITOR) {
      return this.assessmentsService.findByUserId(user.id);
    }
    
    if (cycleId) {
      return this.assessmentsService.findByCycleId(+cycleId);
    }
    if (userId) {
      return this.assessmentsService.findByUserId(userId);
    }
    return this.assessmentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assessmentsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAssessmentDto: UpdateSelfAssessmentDto) {
    return this.assessmentsService.update(+id, updateAssessmentDto);
  }

  @Post(':id/submit')
  @HttpCode(HttpStatus.OK)
  submit(@Param('id') id: string) {
    return this.assessmentsService.submit(+id);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.GESTOR)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.assessmentsService.remove(+id);
  }
}