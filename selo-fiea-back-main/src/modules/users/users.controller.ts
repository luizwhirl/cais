import { Controller, Get, Patch, Delete, Body, Param, HttpCode, HttpStatus, UseGuards, HttpException, ForbiddenException } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '../../common/enums/roles.enum';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.GESTOR)
  findAll() {
    return this.usersService.findAll();
  }

  @Get('me')
  getProfile(@CurrentUser() user: any) {
    return this.usersService.findById(user.id);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.GESTOR)
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @CurrentUser() user: any) {
    // Usuário só pode editar a si mesmo, exceto admin e gestor
    if (user.role !== UserRole.ADMIN && user.role !== UserRole.GESTOR && user.id !== id) {
      throw new ForbiddenException('Você não tem permissão para editar este usuário');
    }
    
    const updatedUser = await this.usersService.update(id, updateUserDto);
    const { password, ...result } = updatedUser;
    return result;
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.GESTOR)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deactivate(@Param('id') id: string) {
    await this.usersService.deactivate(id);
  }
}