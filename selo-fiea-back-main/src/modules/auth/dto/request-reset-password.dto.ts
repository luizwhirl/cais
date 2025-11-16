import { IsEmail } from 'class-validator';

export class RequestResetPasswordDto {
  @IsEmail({}, { message: 'Email inválido' })
  email: string;
}
