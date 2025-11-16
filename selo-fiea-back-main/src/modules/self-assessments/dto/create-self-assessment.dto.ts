import { IsInt, IsString, IsOptional } from 'class-validator';

export class CreateSelfAssessmentDto {
  @IsInt({ message: 'ID do ciclo deve ser um número inteiro' })
  cycleId: number;

  @IsString({ message: 'ID do criador é obrigatório' })
  createdBy: string;

  @IsOptional()
  dtSubmissao?: string;
}
