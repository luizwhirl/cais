import { IsInt, IsNumber, IsOptional, IsString, Min, Max } from 'class-validator';

export class AvaliarTopicoDto {
  @IsInt()
  topicoId: number;

  @IsInt()
  @Min(1, { message: 'Nível deve ser entre 1 e 4' })
  @Max(4, { message: 'Nível deve ser entre 1 e 4' })
  nivelAtingido: number;

  @IsOptional()
  @IsString()
  observacoes?: string;
}