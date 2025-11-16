import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { CriteriaService } from './criteria.service';
import { CreateCriterionDto } from './dto/create-criterion.dto';
import { UpdateCriterionDto } from './dto/update-criterion.dto';

@Controller('criteria')
export class CriteriaController {
  constructor(private readonly criteriaService: CriteriaService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createCriterionDto: CreateCriterionDto) {
    return this.criteriaService.create(createCriterionDto);
  }

  @Get()
  findAll(@Query('seloId') seloId?: string) {
    if (seloId) {
      return this.criteriaService.findBySeloId(+seloId);
    }
    return this.criteriaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.criteriaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCriterionDto: UpdateCriterionDto) {
    return this.criteriaService.update(+id, updateCriterionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.criteriaService.remove(+id);
  }
}