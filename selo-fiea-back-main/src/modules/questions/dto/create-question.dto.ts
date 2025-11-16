import { IsString, IsInt, IsBoolean, IsOptional, Length, IsIn } from 'class-validator';

export class CreateQuestionDto {
  @IsInt({ message: 'ID do critério deve ser um número inteiro' })
  criterionId: number;

  @IsString()
  @Length(10, 1000, { message: 'Enunciado deve ter entre 10 e 1000 caracteres' })
  enunciado: string;

  @IsString()
  @IsIn(['escala', 'texto', 'upload', 'multi'], {
    message: 'Tipo deve ser: escala, texto, upload ou multi',
  })
  tipo: string;

  @IsOptional()
  @IsBoolean({ message: 'Obrigatória deve ser verdadeiro ou falso' })
  obrigatoria?: boolean;
}
