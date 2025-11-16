import { IsString, IsOptional, Length, IsUUID } from 'class-validator';

export class CreateAuditoriaDto {
  @IsString()
  @Length(3, 255)
  titulo: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsUUID()
  empresaId: string;

  @IsOptional()
  @IsUUID()
  auditorResponsavelId?: string;
}