import { Injectable } from '@nestjs/common';
import { AddCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ErrorHandlerService } from '../error-handler/error-handler.service';
import { ICategoryExtraInfo } from '../interface';

@Injectable()
export class CategoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly errorHander: ErrorHandlerService,
  ) {}

  async createCategory(dto: AddCategoryDto) {
    try {
      const cateogory = await this.prisma.category.create({ data: dto });
      return cateogory;
    } catch (error) {
      this.errorHander.handleError(error);
    }
  }

  async getCategories() {
    try {
      const cateogories = await this.prisma.category.findMany({});
      return cateogories;
    } catch (error) {
      this.errorHander.handleError(error);
    }
  }
  async getCategoryById(
    categoryId: string,
    extraInfo: ICategoryExtraInfo | undefined = undefined,
  ) {
    try {
      const cateogory = await this.prisma.category.findUnique({
        where: { id: categoryId },
        include: extraInfo,
      });
      return cateogory;
    } catch (error) {
      this.errorHander.handleError(error);
    }
  }
  async updateCategory(categoryId: string, dto: UpdateCategoryDto) {
    try {
      const cateogory = await this.prisma.category.update({
        where: { id: categoryId },
        data: dto,
      });
      return cateogory;
    } catch (error) {
      this.errorHander.handleError(error);
    }
  }
  async deleteCategory(categoryId: string) {
    try {
      const cateogory = await this.prisma.category.delete({
        where: { id: categoryId },
      });
      return cateogory;
    } catch (error) {
      this.errorHander.handleError(error);
    }
  }
}
