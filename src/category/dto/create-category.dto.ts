import { FileEntity } from '@/files/entities/file.entity';
import { slugTransformer } from '@/utils/transformers/slug-case.transformer';
import { IsExist } from '@/utils/validators/is-exists.validator';
import { IsNotExist } from '@/utils/validators/is-not-exists.validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, Validate } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Category' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'category' })
  @Transform(slugTransformer)
  @Validate(IsNotExist, ['CategoryEntity', 'slug'], {
    message: 'Slug already exists',
  })
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ type: () => FileEntity })
  @IsOptional()
  @Validate(IsExist, ['FileEntity', 'id'], {
    message: 'file not exists',
  })
  icon?: FileEntity;

  @ApiProperty({ example: true })
  published?: boolean = true;
}
