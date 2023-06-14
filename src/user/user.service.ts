import { Injectable, UnauthorizedException } from '@nestjs/common';
import { verify, hash } from 'argon2';
import { ChangePasswordDto, UpdateUseDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import { ErrorHandlerService } from '../error-handler/error-handler.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly errorHandler: ErrorHandlerService,
  ) {}

  async updateUser(
    userId: string,
    dto: UpdateUseDto | ChangePasswordDto,
    hashPassword = '',
  ) {
    try {
      if (hashPassword && dto instanceof ChangePasswordDto) {
        const { old_password, new_password } = dto;
        const verifyPwd = await verify(hashPassword, old_password);
        if (!verifyPwd) {
          throw new UnauthorizedException('Old password mismathced');
        }
        const hashPwd = await hash(new_password);
        const user = await this.prisma.user.update({
          where: { id: userId },
          data: { hash: hashPwd },
        });
      }
      const user = await this.prisma.user.update({
        where: { id: userId },
        data: dto,
      });
      delete user.hash;
      return user;
    } catch (error) {
      this.errorHandler.handleError(error);
    }
  }
}
