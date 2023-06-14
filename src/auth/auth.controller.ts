import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtGuard, RoleGuard } from './guard';
import { Roles } from './decorator';
import { AuthService } from './auth.service';
import { SignUpDto, SignInDto } from './dto';
import { Role } from '../enum';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @UseGuards(JwtGuard, RoleGuard)
  @Roles(Role.admin)
  @Post('signup/admin')
  adminSignup(
    @Body() dto: SignUpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.auth.signup(dto, Role.admin, res);
  }

  @Post('signup/user')
  userSignup(
    @Body() dto: SignUpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.auth.signup(dto, Role.user, res);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signin(@Body() dto: SignInDto, @Res({ passthrough: true }) res: Response) {
    return this.auth.signin(dto, res);
  }

  @Get('signout')
  signout(@Res({passthrough: true}) res: Response){
    this.auth.signout(res)
  }
}
