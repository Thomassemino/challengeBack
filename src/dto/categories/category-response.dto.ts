import { ApiProperty } from '@nestjs/swagger';

export class CategoryResponseDto {
  @ApiProperty({
    example: 1,
  })
  id: number;

  @ApiProperty({
    example: 'Development',
  })
  name: string;

  @ApiProperty({
    example: 'Notes related to software development',
  })
  description: string;

  @ApiProperty({
    example: '#007bff',
  })
  color: string;

  @ApiProperty({
    example: '2023-12-01T10:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2023-12-01T15:30:00Z',
  })
  updatedAt: Date;
}