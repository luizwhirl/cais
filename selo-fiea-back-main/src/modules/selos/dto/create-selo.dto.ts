import { IsString, IsInt, IsOptional, IsDateString, Length, Min } from 'class-validator';

export class CreateSeloDto {
  @IsString()
  @Length(3, 255, { message: 'Nome deve ter entre 3 e 255 caracteres' })
  nome: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsInt({ message: 'Validade em meses deve ser um número inteiro' })
  @Min(1, { message: 'Validade deve ser no mínimo 1 mês' })
  validadeMeses: number;

  @IsOptional()
  @IsString({ message: 'Data de início de emissão deve ser uma string' })
  dtInicioEmissao?: string;

  @IsOptional()
  @IsString({ message: 'Data de fim de emissão deve ser uma string' })
  dtFimEmissao?: string;
}