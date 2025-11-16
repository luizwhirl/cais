import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  HttpCode, 
  HttpStatus 
} from '@nestjs/common';
import { EmpresasService } from './empresas.service';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';

@Controller('empresas')
export class EmpresasController {
  constructor(private readonly empresasService: EmpresasService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createEmpresaDto: CreateEmpresaDto) {
    return this.empresasService.create(createEmpresaDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.empresasService.findAll();
  }

  @Get('cnpj/:cnpj')
  @HttpCode(HttpStatus.OK)
  findByCnpj(@Param('cnpj') cnpj: string) {
    return this.empresasService.findByCnpj(cnpj);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.empresasService.findById(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() updateEmpresaDto: UpdateEmpresaDto) {
    return this.empresasService.update(id, updateEmpresaDto);
  }

  @Patch(':id/toggle-active')
  @HttpCode(HttpStatus.OK)
  toggleActive(@Param('id') id: string) {
    return this.empresasService.toggleActive(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    await this.empresasService.remove(id)
    return { message: 'Empresa excluída com sucesso' };
  }
}