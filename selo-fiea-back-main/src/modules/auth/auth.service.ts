import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '../users/entities/user.entity';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<{ user: Partial<User>; accessToken: string }> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = await this.usersService.create({
      ...createUserDto,
      password: hashedPassword,
      role: createUserDto.role.toLowerCase(),
    });

    const accessToken = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: this.sanitizeUser(user),
      accessToken,
    };
  }

  async login(loginDto: LoginDto): Promise<{ user: Partial<User>; accessToken: string }> {
    const { email, password } = loginDto;

    let user: User;
    try {
      user = await this.usersService.findByEmail(email);
    } catch (error) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    if (user.lockedUntil && new Date() < user.lockedUntil) {
      const remainingMinutes = Math.ceil(
        (user.lockedUntil.getTime() - new Date().getTime()) / 60000,
      );
      throw new UnauthorizedException(
        `Usuário bloqueado. Tente novamente em ${remainingMinutes} minuto(s)`,
      );
    }

    if (user.lockedUntil && new Date() >= user.lockedUntil) {
      user.failedLoginAttempts = 0;
      user.lockedUntil = null;
      await this.usersService.updateLoginAttempts(user.id, 0, null);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      user.failedLoginAttempts += 1;

      if (user.failedLoginAttempts >= 5) {
        const lockedUntil = new Date(Date.now() + 30 * 60 * 1000);
        await this.usersService.updateLoginAttempts(
          user.id,
          user.failedLoginAttempts,
          lockedUntil,
        );
        throw new UnauthorizedException(
          'Muitas tentativas falhas. Usuário bloqueado por 30 minutos',
        );
      }

      await this.usersService.updateLoginAttempts(
        user.id,
        user.failedLoginAttempts,
        null,
      );

      throw new UnauthorizedException('Email ou senha inválidos');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Usuário inativo');
    }

    await this.usersService.updateLoginAttempts(user.id, 0, null);
    await this.usersService.updateLastLogin(user.id);

    const accessToken = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role.toLowerCase(),
    });

    return {
      user: this.sanitizeUser(user),
      accessToken,
    };
  }

  async validateToken(token: string): Promise<any> {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }

  private sanitizeUser(user: User): Partial<User> {
    const { password, ...result } = user;
    return result;
  }

  async requestPasswordReset(email: string): Promise<{ message: string }> {
    const user = await this.usersService.findByEmail(email);

    const resetToken = this.generateResetToken();
    const expiresIn = 30 * 60 * 1000;
    const expiresAt = new Date(Date.now() + expiresIn);

    await this.usersService.updateResetToken(user.id, resetToken, expiresAt);

    const resetLink = `${process.env.RESET_PASSWORD_URL}?token=${resetToken}`;
    await this.mailService.sendResetPasswordEmail(user.email, resetLink);

    return {
      message: 'Email de recuperação enviado com sucesso',
    };
  }

  async resetPassword(resetPasswordDto: any): Promise<{ message: string }> {
    const { token, newPassword, confirmPassword } = resetPasswordDto;

    if (newPassword !== confirmPassword) {
      throw new BadRequestException('As senhas não conferem');
    }

    const user = await this.usersService.findByResetToken(token);

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.usersService.updateResetToken(user.id, null, null);
    await this.usersService.updatePassword(user.id, hashedPassword);

    await this.mailService.sendPasswordChangedEmail(user.email);

    return {
      message: 'Senha alterada com sucesso',
    };
  }

  private generateResetToken(): string {
    return Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
  }
}