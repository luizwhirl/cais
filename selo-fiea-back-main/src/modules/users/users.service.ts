import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, name, company, role } = createUserDto;

    // Verificar se email já existe
    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email já cadastrado');
    }

    const user = this.usersRepository.create({
      name,
      email,
      password, // Já vem criptografado do auth.service
      company,
      role: role || 'user',
      isActive: true,
      emailVerified: false,
    });

    return this.usersRepository.save(user);
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);

    // Se estiver atualizando email, verificar se já existe
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.usersRepository.findOne({
        where: { email: updateUserDto.email },
      });

      if (existingUser) {
        throw new ConflictException('Email já cadastrado');
      }
    }

    Object.assign(user, updateUserDto);

    return this.usersRepository.save(user);
  }

  async deactivate(id: string): Promise<void> {
    const user = await this.findById(id);
    user.isActive = false;
    await this.usersRepository.save(user);
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.usersRepository.update({ id }, { updatedAt: new Date() });
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async remove(id: string): Promise<void> {
    const user = await this.findById(id);
    await this.usersRepository.remove(user);
  }

  async updateLoginAttempts(
    id: string,
    attempts: number,
    lockedUntil: Date | null,
  ): Promise<void> {
    await this.usersRepository.update(
      { id },
      {
        failedLoginAttempts: attempts,
        lockedUntil: lockedUntil,
        updatedAt: new Date(),
      },
    );
  }

  async updateResetToken(id: string, token: string, expiresAt: Date): Promise<void> {
    await this.usersRepository.update(
      { id },
      {
        resetPasswordToken: token,
        resetPasswordExpires: expiresAt,
        updatedAt: new Date(),
      },
    );
  }

  async findByResetToken(token: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { resetPasswordToken: token },
    });

    if (!user) {
      throw new NotFoundException('Token inválido ou expirado');
    }

    // Verificar se token expirou
    if (user.resetPasswordExpires < new Date()) {
      throw new NotFoundException('Token expirado');
    }
    
    return user;
  }

  async updatePassword(id: string, hashedPassword: string): Promise<void> {
    await this.usersRepository.update(
      { id },
      {
        password: hashedPassword,
        updatedAt: new Date(),
      },
    );
  }
}