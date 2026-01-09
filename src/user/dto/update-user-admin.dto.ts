import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserAdminDto {
  @ApiProperty({ example: 'true' })
  isAdmin!: boolean;
}
