import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { hash, verify } from 'argon2';
import { Response } from 'express';
import { SignInDto, SignUpDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import { ErrorHandlerService } from '../error-handler/error-handler.service';
import { Role } from '../enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly errorHandler: ErrorHandlerService,
  ) {}

  async signup(dto: SignUpDto, userRole: Role, res: Response) {
    try {
      const { email, password } = dto;
      const hashPassword = await hash(password);
      const user = await this.prisma.user.create({
        data: {
          email,
          role: userRole,
          hash: hashPassword,
        },
      });
      const { id, role } = user;
      return this.generateToken(id, role, res);
    } catch (error) {
      this.errorHandler.handleError(error);
    }
  }

  async signin(dto: SignInDto, res: Response) {
    try {
      const { email, password } = dto;
      const user = await this.prisma.user.findUnique({ where: { email } });
      if (!user) throw new UnauthorizedException('User does not exist');
      const { id, hash, role } = user;
      const isPasswordVerified = await verify(hash, password);
      if (!isPasswordVerified)
        throw new UnauthorizedException('User does not exist');
      return this.generateToken(id, role, res);
    } catch (error) {
      this.errorHandler.handleError(error);
    }
  }

  async signout(res: Response) {
    res.clearCookie('token');
    return { message: 'Logout successful' };
  }

  async generateToken(id: string, role: string, res: Response) {
    try {
      const payload = { sub: id, role };
      const token = await this.jwtService.signAsync(payload, {
        expiresIn: '6h',
        secret: this.config.get('JWT_SECRET'),
      });
      const currentDate = new Date();
      currentDate.setMinutes(currentDate.getMinutes() + 360);
      const options = {
        expires: currentDate,
        httpOnly: true,
      };
      res.cookie('token', token, options);
      return { access_token: token };
    } catch (error) {
      this.errorHandler.handleError(error);
    }
  }
}
