import { IsInt, IsString, IsOptional, IsIn, Length } from 'class-validator';

export class CreateAuditFindingDto {
  @IsString()
  auditId: string;

  @IsInt({ message: 'ID do critério deve ser um número inteiro' })
  criterionId: number;

  @IsString()
  @IsIn(['conformidade', 'nao_conformidade', 'observacao', 'recomendacao'], {
    message: 'Tipo deve ser: conformidade, nao_conformidade, observacao ou recomendacao',
  })
  tipo: string;

  @IsString()
  @Length(10, 2000, { message: 'Descrição deve ter entre 10 e 2000 caracteres' })
  descricao: string;

  @IsOptional()
  @IsIn(['baixa', 'media', 'alta', 'critica'], {
    message: 'Gravidade deve ser: baixa, media, alta ou critica',
  })
  gravidade?: string;

  @IsOptional()
  @IsString()
  acao_recomendada?: string;
}
