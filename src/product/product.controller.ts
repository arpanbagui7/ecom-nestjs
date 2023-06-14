import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
  HttpStatus,
  UseGuards,
  Query,
  ParseBoolPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductService } from './product.service';
import { AddProductDto, UpdateProductDto } from './dto/product.dto';
import { JwtGuard, RoleGuard } from '../auth/guard';
import { Roles } from '../auth/decorator';
import { Role } from '../enum';
import { IProductExtraInfo, IProductFilter } from '../interface';

@Controller('product')
export class ProductController {
  constructor(private readonly product: ProductService) {}

  @UseGuards(JwtGuard, RoleGuard)
  @Roles(Role.admin)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  createProduct(
    @Body() dto: AddProductDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'jpeg',
        })
        .addMaxSizeValidator({
          maxSize: 2 * 1024 * 1024,
        })
        .build({
          fileIsRequired: false,
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file?: Express.Multer.File,
  ) {
    return this.product.createProduct(dto, file);
  }

  @Get()
  getProducts(@Query('category') categoryId: string) {
    let filter: IProductFilter = {};
    if (categoryId) {
      filter = {
        categoryId,
      };
    }
    return this.product.getProducts(filter);
  }

  @Get(':id')
  getProductById(
    @Param('id') productId: string,
    @Query('category', ParseBoolPipe) category: boolean,
  ) {
    let extraInfo: IProductExtraInfo | undefined = undefined;
    if (category) {
      extraInfo = {
        category,
      };
    }
    return this.product.getProductById(productId, extraInfo);
  }

  @UseGuards(JwtGuard, RoleGuard)
  @Roles(Role.admin)
  @Patch(':id')
  updateProduct(@Param('id') productId: string, @Body() dto: UpdateProductDto) {
    return this.product.updateProduct(productId, dto);
  }

  @UseGuards(JwtGuard, RoleGuard)
  @Roles(Role.admin)
  @Delete(':id')
  deleteProduct(@Param('id') productId: string) {
    return this.product.deleteProduct(productId);
  }
}
