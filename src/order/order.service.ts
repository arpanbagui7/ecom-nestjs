import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ErrorHandlerService } from 'src/error-handler/error-handler.service';
import { AddOrderDto } from './dto';

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly errorHander: ErrorHandlerService,
  ) {}

  async createOrder(dto: AddOrderDto, userId: string) {
    try {
      const { orderAmt, products } = dto;
      const order = await this.prisma.order.create({
        data: {
          userId,
          orderAmt,
          productOrders: {
            createMany: { data: products },
          },
        },
      });
      return order;
    } catch (error) {
      this.errorHander.handleError(error);
    }
  }
  async getOrders(userId: string) {
    try {
      const orders = await this.prisma.order.findMany({
        where: { userId },
        include: {
          productOrders: {
            include: { product: true },
          },
        },
      });
      return orders;
    } catch (error) {
      this.errorHander.handleError(error);
    }
  }
}
