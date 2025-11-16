import { IsString, IsOptional } from 'class-validator';

export class RevogarSeloDto {
  @IsOptional()
  @IsString()
  motivo?: string;
}