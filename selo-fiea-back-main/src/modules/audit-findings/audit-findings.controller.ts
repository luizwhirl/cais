import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  HttpCode, 
  HttpStatus, 
  Query,
  UseGuards 
} from '@nestjs/common';
import { AuditFindingsService } from './audit-findings.service';
import { CreateAuditFindingDto } from './dto/create-audit-finding.dto';
import { UpdateAuditFindingDto } from './dto/update-audit-finding.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/roles.enum';

@Controller('audit-findings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AuditFindingsController {
  constructor(private readonly findingsService: AuditFindingsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.GESTOR, UserRole.AUDITOR)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createFindingDto: CreateAuditFindingDto) {
    return this.findingsService.create(createFindingDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.GESTOR, UserRole.AUDITOR)
  findAll(@Query('auditId') auditId?: string) {
    if (auditId) {
      return this.findingsService.findByAuditId(auditId);
    }
    return this.findingsService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.GESTOR, UserRole.AUDITOR)
  findOne(@Param('id') id: string) {
    return this.findingsService.findOne(+id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.GESTOR, UserRole.AUDITOR)
  update(@Param('id') id: string, @Body() updateFindingDto: UpdateAuditFindingDto) {
    return this.findingsService.update(+id, updateFindingDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.GESTOR)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.findingsService.remove(+id);
  }
}