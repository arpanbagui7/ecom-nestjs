import { Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { ChangePasswordDto, UpdateUseDto } from './dto';
import { UserService } from './user.service';
import { User } from '@prisma/client';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  constructor(private readonly user: UserService) {}

  @Patch()
  updateUser(@GetUser('id') userId: string, dto: UpdateUseDto) {
    return this.user.updateUser(userId, dto);
  }

  @Patch('changepassword')
  changePassword(@GetUser() user: User, dto: ChangePasswordDto) {
    const { id, hash } = user;
    return this.user.updateUser(id, dto, hash);
  }

  @Get()
  getUser(@GetUser() user: User) {
    delete user.hash;
    return user;
  }
}
