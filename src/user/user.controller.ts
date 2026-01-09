// src/user/user.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UpdateUserAdminDto } from './dto/update-user-admin.dto';
import { ReturnUserDto } from './dto/return-user.dto';

@Controller('user')
@ApiInternalServerErrorResponse({
  description:
    'Internal Server Error\n\n[Referenz zu HTTP 500](https://developer.mozilla.org/de/docs/Web/HTTP/Reference/Status/500)',
})
@ApiUnauthorizedResponse({
  description:
    'Unauthorized, the user must be signed in\n\n[Referenz zu HTTP 401](https://developer.mozilla.org/de/docs/Web/HTTP/Reference/Status/401)',
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({
    summary: `Create user`,
    description: `Create a new user resource`,
  })
  @ApiCreatedResponse({
    description: `Return the created user resource\n\n[Referenz zu HTTP 201](https://developer.mozilla.org/de/docs/Web/HTTP/Reference/Status/201)`,
    type: ReturnUserDto,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiBody({ type: CreateUserDto })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiOperation({
    summary: `Get all user`,
    description: `Return an array of user resources`,
  })
  @ApiOkResponse({
    type: ReturnUserDto,
    isArray: true,
    description: `Return an array of user resources\n\n[Referenz zu HTTP 200](https://developer.mozilla.org/de/docs/Web/HTTP/Reference/Status/200)`,
  })
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: `Get user by id`,
    description: `Return a user resource by it's id`,
  })
  @ApiOkResponse({
    type: ReturnUserDto,
    description: `Return the found user resource\n\n[Referenz zu HTTP 200](https://developer.mozilla.org/de/docs/Web/HTTP/Reference/Status/200)`,
  })
  @ApiNotFoundResponse({
    description: `The user resource was not found with the requested id\n\n[Referenz zu HTTP 404](https://developer.mozilla.org/de/docs/Web/HTTP/Reference/Status/404)`,
  })
  @ApiForbiddenResponse({
    description: `The user is not authorized to access this resource\n\n[Referenz zu HTTP 403](https://developer.mozilla.org/de/docs/Web/HTTP/Reference/Status/403)`,
  })
  @ApiParam({ name: 'id', type: Number })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id/admin')
  @ApiOperation({
    summary: `Update user`,
    description: `Update a user resource by id with new values and return the updated resource`,
  })
  @ApiOkResponse({
    type: ReturnUserDto,
    description: `Return the updated user resource\n\n[Referenz zu HTTP 200](https://developer.mozilla.org/de/docs/Web/HTTP/Reference/Status/200)`,
  })
  @ApiUnauthorizedResponse({
    description:
      'Unauthorized, the user must be signed in\n\n[Referenz zu HTTP 401](https://developer.mozilla.org/de/docs/Web/HTTP/Reference/Status/401)',
  })
  @ApiNotFoundResponse({
    description: `The user resource was not found with the requested id\n\n[Referenz zu HTTP 404](https://developer.mozilla.org/de/docs/Web/HTTP/Reference/Status/404)`,
  })
  @ApiForbiddenResponse({
    description: `The user is not authorized to access this resource\n\n[Referenz zu HTTP 403](https://developer.mozilla.org/de/docs/Web/HTTP/Reference/Status/403)`,
  })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateUserAdminDto })
  update(
    @Param('id') id: string,
    @Body() updateUserAdminDto: UpdateUserAdminDto,
  ) {
    return this.userService.update(+id, updateUserAdminDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: `Delete user`,
    description: `Delete a user by id and return the deleted object`,
  })
  @ApiOkResponse({
    type: ReturnUserDto,
    description: `Return the deleted user resource\n\n[Referenz zu HTTP 200](https://developer.mozilla.org/de/docs/Web/HTTP/Reference/Status/200)`,
  })
  @ApiUnauthorizedResponse({
    description:
      'Unauthorized, the user must be signed in\n\n[Referenz zu HTTP 401](https://developer.mozilla.org/de/docs/Web/HTTP/Reference/Status/401)',
  })
  @ApiNotFoundResponse({
    description: `The user resource was not found with the requested id\n\n[Referenz zu HTTP 404](https://developer.mozilla.org/de/docs/Web/HTTP/Reference/Status/404)`,
  })
  @ApiForbiddenResponse({
    description: `The user is not authorized to delete this resource\n\n[Referenz zu HTTP 403](https://developer.mozilla.org/de/docs/Web/HTTP/Reference/Status/403)`,
  })
  @ApiParam({ name: 'id', type: Number })
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
