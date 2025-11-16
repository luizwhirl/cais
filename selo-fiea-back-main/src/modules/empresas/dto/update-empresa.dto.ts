import { PartialType } from '@nestjs/mapped-types';
import { CreateEmpresaDto } from './create-empresa.dto';
import { IsOptional, IsBoolean } from 'class-validator';

export class UpdateEmpresaDto extends PartialType(CreateEmpresaDto) {
  @IsOptional()
  @IsBoolean({ message: 'isActive deve ser um valor booleano' })
  isActive?: boolean;
}
