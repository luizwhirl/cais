import { IsString, IsInt, IsBoolean, IsOptional, Length } from 'class-validator';

export class CreateCertificationCycleDto {
  @IsInt({ message: 'ID do selo deve ser um número inteiro' })
  seloId: number;

  @IsString()
  @Length(3, 100, { message: 'Nome deve ter entre 3 e 100 caracteres' })
  nome: string;

  @IsOptional()
  dtInicio?: string;

  @IsOptional()
  dtFim?: string;

  @IsOptional()
  @IsBoolean({ message: 'Ativo deve ser verdadeiro ou falso' })
  ativo?: boolean;
}
