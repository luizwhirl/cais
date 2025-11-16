import { IsInt, IsOptional } from 'class-validator';

export class CreateEvidenceDto {
  @IsOptional()
  @IsInt({ message: 'ID da pergunta deve ser um número inteiro' })
  questionId?: number;

  @IsOptional()
  @IsInt({ message: 'ID da autoavaliação deve ser um número inteiro' })
  selfAssessmentId?: number;
}
