import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsNotEmpty } from 'class-validator';

export class AssignCategoriesDto {
  @ApiProperty({
    example: [1, 2, 3],
    type: [Number],
  })
  @IsArray()
  @IsNotEmpty()
  @IsInt({ each: true })
  categoryIds: number[];
}