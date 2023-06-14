import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { AddOrderDto } from './dto';
import { OrderService } from './order.service';

@UseGuards(JwtGuard)
@Controller('order')
export class OrderController {
  constructor(private readonly order: OrderService) {}

  @Post()
  createOrder(@GetUser('id') userId: string, @Body() dto: AddOrderDto) {
    return this.order.createOrder(dto, userId);
  }

  @Get()
  getOrders(@GetUser('id') userId: string) {
    return this.order.getOrders(userId);
  }
}
