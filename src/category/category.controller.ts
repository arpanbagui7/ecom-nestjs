import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AddCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { CategoryService } from './category.service';
import { JwtGuard, RoleGuard } from '../auth/guard';
import { Roles } from '../auth/decorator';
import { Role } from '../enum';
import { ICategoryExtraInfo } from '../interface';

@Controller('category')
export class CategoryController {
  constructor(private readonly category: CategoryService) {}

  @UseGuards(JwtGuard, RoleGuard)
  @Roles(Role.admin)
  @Post()
  createCategory(@Body() dto: AddCategoryDto) {
    return this.category.createCategory(dto);
  }

  @Get()
  getCategories() {
    return this.category.getCategories();
  }

  @Get(':id')
  getCategoryById(
    @Param('id') categoryId: string,
    @Query('product', ParseBoolPipe) isIncludeProduct: boolean,
  ) {
    let extraInfo: ICategoryExtraInfo | undefined = undefined;
    if (isIncludeProduct) {
      extraInfo = { products: true };
    }
    return this.category.getCategoryById(categoryId, extraInfo);
  }

  @UseGuards(JwtGuard, RoleGuard)
  @Roles(Role.admin)
  @Patch(':id')
  updateCategory(
    @Param('id') categoryId: string,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.category.updateCategory(categoryId, dto);
  }

  @UseGuards(JwtGuard, RoleGuard)
  @Roles(Role.admin)
  @Delete(':id')
  deleteCategory(@Param('id') categoryId: string) {
    return this.category.deleteCategory(categoryId);
  }
}
