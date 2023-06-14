import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class ErrorHandlerService {
  handleError(error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002':
          throw new ForbiddenException('Already exists');
        default:
          throw new BadRequestException(error?.message || 'Bad Request');
      }
    }
    throw new InternalServerErrorException(
      error?.message || 'Something went wrong',
    );
  }
}
