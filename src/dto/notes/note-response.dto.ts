import { ApiProperty } from '@nestjs/swagger';
import { CategoryResponseDto } from '../categories/category-response.dto';

export class NoteResponseDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    example: 'Idea de proyecto',
  })
  title: string;

  @ApiProperty({
    example: 'Explorar Nest.js para microservicios',
  })
  content: string;

  @ApiProperty({
    example: false,
  })
  archived: boolean;

  @ApiProperty({
    type: [CategoryResponseDto],
  })
  categories: CategoryResponseDto[];

  @ApiProperty({
    example: '2023-12-01T10:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2023-12-01T15:30:00Z',
  })
  updatedAt: Date;
}