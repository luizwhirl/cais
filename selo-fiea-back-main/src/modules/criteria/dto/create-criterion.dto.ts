import { IsString, IsInt, IsNumber, IsBoolean, IsOptional, Length, Min, Max } from 'class-validator';

export class CreateCriterionDto {
  @IsInt({ message: 'ID do selo deve ser um número inteiro' })
  seloId: number;

  @IsString()
  @Length(3, 100, { message: 'Pilar deve ter entre 3 e 100 caracteres' })
  pilar: string;

  @IsString()
  @Length(10, 1000, { message: 'Descrição deve ter entre 10 e 1000 caracteres' })
  descricao: string;

  @IsNumber({}, { message: 'Peso deve ser um número' })
  @Min(0, { message: 'Peso deve ser no mínimo 0' })
  @Max(100, { message: 'Peso deve ser no máximo 100' })
  peso: number;

  @IsOptional()
  @IsBoolean({ message: 'Setorial deve ser verdadeiro ou falso' })
  setorial?: boolean;
}