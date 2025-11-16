import { IsUUID, IsInt } from 'class-validator';

export class EmitirSeloDto {
  @IsUUID()
  auditoriaId: string;

  @IsInt()
  seloId: number;
}