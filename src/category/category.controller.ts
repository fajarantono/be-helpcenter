// category.controller.ts
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { AuthGuard } from '@/auth/auth.guard'; // Impor AuthGuard

// Make AuthGuard in here
@Controller({
  path: 'categories',
  version: '1',
})
@ApiTags('Categories')
@ApiBearerAuth()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  
  @UseGuards(AuthGuard) 
  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

//   @Get()
//   @HttpCode(HttpStatus.OK)
//   async getCategories(@Req() req: Request) {
//     console.log(req['logged']?.userId);
//     return this.categoryService.getCategories();
//   }
}
