import { ApiProperty } from '@nestjs/swagger';
export class ReturnArticleDto {
  @ApiProperty({ description: 'id', example: 1 })
  id!: number;
  @ApiProperty({ description: 'Article Name', example: 'Apple' })
  articleName!: string;
  @ApiProperty({
    description: 'Article Description',
    example: 'Apple is a fruit',
  })
  articleDescription!: string;
  @ApiProperty({ description: 'Article Price', example: 10 })
  articlePrice!: number;
}
