import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { SelosService } from './selos.service';
import { CreateSeloDto } from './dto/create-selo.dto';
import { UpdateSeloDto } from './dto/update-selo.dto';

@Controller('selos')
export class SelosController {
  constructor(private readonly selosService: SelosService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createSeloDto: CreateSeloDto) {
    return this.selosService.create(createSeloDto);
  }

  @Get()
  findAll() {
    return this.selosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.selosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSeloDto: UpdateSeloDto) {
    return this.selosService.update(+id, updateSeloDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.selosService.remove(+id);
  }
}