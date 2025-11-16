import { IsString, Length, Matches } from 'class-validator';

export class ResetPasswordDto {
  @IsString({ message: 'Token é obrigatório' })
  token: string;

  @IsString()
  @Length(8, 255, {
    message: 'Senha deve ter no mínimo 8 caracteres',
  })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: 'Senha deve conter maiúscula, minúscula, número e caractere especial (@$!%*?&)',
  })
  newPassword: string;

  @IsString()
  confirmPassword: string;
}
