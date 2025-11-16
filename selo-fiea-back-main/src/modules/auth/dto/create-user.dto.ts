import { IsString, IsEmail, Length, IsOptional, Matches } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'Nome deve ser uma string' })
  @Length(3, 100, {
    message: 'Nome deve ter entre 3 e 100 caracteres',
  })
  name: string;

  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @IsString()
  @Length(8, 255, {
    message: 'Senha deve ter no mínimo 8 caracteres',
  })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: 'Senha deve conter maiúscula, minúscula, número e caractere especial (@$!%*?&)',
  })
  password: string;

  @IsString()
  confirmPassword: string;

  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  @IsString()
  role?: string;
}