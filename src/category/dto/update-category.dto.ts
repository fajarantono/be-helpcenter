import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCategoryDto } from './create-category.dto';
import { IsOptional, Validate } from 'class-validator';
import { Transform } from 'class-transformer';
import { IsNotExist } from '@/utils/validators/is-not-exists.validator';
import { slugTransformer } from '@/utils/transformers/slug-case.transformer';
import { FileEntity } from '@/files/entities/file.entity';
import { IsExist } from '@/utils/validators/is-exists.validator';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @ApiProperty({ example: 'Category' })
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'category' })
  @Transform(slugTransformer)
  @Validate(IsNotExist, ['CategoryEntity', 'slug'], {
    message: 'Slug already exists',
  })
  @IsOptional()
  slug?: string;

  @ApiProperty({ type: () => FileEntity })
  @IsOptional()
  @Validate(IsExist, ['FileEntity', 'id'], {
    message: 'file not exists',
  })
  icon?: FileEntity;

  @ApiProperty({ example: true })
  published?: boolean;
}
