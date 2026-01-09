import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'user' })
  username!: string;

  @ApiProperty({ example: 'user@local.ch' })
  email!: string;

  @ApiProperty({ example: 'user' })
  password!: string;
}
