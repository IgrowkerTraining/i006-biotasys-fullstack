/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  Req,
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { JwtAuthGuard } from '../../common/guards/jwt-guards';
import { RolesGuard } from '../../common/guards/role-guards/roles.guard';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LaboratoryOptionDto } from './dto/laboratory-option.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UserResponseDto } from './dto/user-response.dto';

type AuthenticatedRequest = Request & {
  user: {
    userId: string;
    role: Role;
    email?: string;
  };
};

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({
    summary: 'Registrar nuevo usuario',
    description: 'Crea un nuevo usuario en el sistema y envía email de verificación. El usuario debe verificar su email antes de poder loguearse.',
  })
  @ApiBody({
    type: CreateUserDto,
    examples: {
      nutricionista: {
        value: {
          fullName: 'Juan Pérez García',
          email: 'juan@example.com',
          password: 'SecurePass123!',
          laboratory: 'Laboratorio Central',
        },
      },
      sinLaboratorio: {
        value: {
          fullName: 'María López',
          email: 'maria@example.com',
          password: 'SecurePass123!',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Usuario creado exitosamente. Email de verificación enviado.',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Email ya registrado en el sistema',
    schema: {
      example: {
        message: 'Error: Email already exists',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos (contraseña muy corta, nombre vacío, etc)',
  })
  @ApiResponse({
    status: 422,
    description: 'Validación fallida en los datos de entrada',
  })
  create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.usersService.create(createUserDto);
  }

  @Post('verify-email')
  @ApiOperation({
    summary: 'Verificar email',
    description: 'Valida el token de verificación enviado al email del usuario mediante query parameter. El token expira en 24 horas. Ejemplo de URL: /users/verify-email?token=4B9780AD71184449F17D65541ADD2CF8541CCD7BE686DF4B75BCDE68E3C2AB92',
  })
  @ApiQuery({
    name: 'token',
    required: true,
    description: 'Token de verificación recibido en el email del usuario (64 caracteres hexadecimales)',
    type: String,
    example: '4B9780AD71184449F17D65541ADD2CF8541CCD7BE686DF4B75BCDE68E3C2AB92',
  })
  @ApiResponse({
    status: 200,
    description: 'Email verificado exitosamente. Usuario ya puede hacer login.',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Token inválido, expirado o ya utilizado',
    schema: {
      examples: {
        tokenInvalido: {
          summary: 'Token inválido',
          value: { message: 'Token de verificación inválido' },
        },
        tokenExpirado: {
          summary: 'Token expirado',
          value: { message: 'El enlace de verificación ha expirado' },
        },
        yaVerificado: {
          summary: 'Email ya verificado',
          value: { message: 'El email ya fue verificado' },
        },
      },
    },
  })
  @ApiResponse({
    status: 422,
    description: 'Token requerido en query parameter',
    schema: {
      example: {
        message: 'Token es requerido',
      },
    },
  })
  verifyEmail(@Query('token') token?: string): Promise<UserResponseDto> {
    if (!token) {
      throw new BadRequestException('Token es requerido');
    }
    return this.usersService.verifyEmail(token);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar usuarios',
    description: 'Obtiene la lista de todos los usuarios registrados',
  })
  @ApiResponse({
    status: 200,
    description: 'Listado de usuarios',
    type: [UserResponseDto],
  })
  findAll() {
    return this.usersService.findAll();
  }

  @Get('laboratories')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.NUTRICIONISTA, Role.LABORATORIO, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Listar opciones de laboratorio',
    description:
      'Retorna usuarios candidatos para selector de laboratorio (activos, verificados y con laboratory informado)',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Busqueda por laboratorio, nombre o email',
  })
  @ApiResponse({
    status: 200,
    description: 'Listado de opciones de laboratorio',
    type: [LaboratoryOptionDto],
  })
  listLaboratoryOptions(
    @Query('search') search: string | undefined,
    @Req() request: AuthenticatedRequest,
  ): Promise<LaboratoryOptionDto[]> {
    return this.usersService.listLaboratoryOptions(search, request.user);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener usuario',
    description: 'Obtiene los detalles de un usuario específico',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del usuario',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario encontrado',
    type: UserResponseDto,
  })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar usuario',
    description:
      'Actualiza los datos de un usuario existente (nombre, email, laboratorio)',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del usuario',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: 'Usuario actualizado exitosamente',
    type: UserResponseDto,
  })
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.usersService.update(id, updateUserDto);
  }

  @Patch(':id/change-password')
  @ApiOperation({
    summary: 'Cambiar contraseña',
    description:
      'Cambia la contraseña del usuario con validación de contraseña actual',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del usuario',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiBody({ type: ChangePasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Contraseña actualizada exitosamente',
  })
  changePassword(
    @Param('id') id: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    return this.usersService.changePassword(id, changePasswordDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar usuario',
    description: 'Elimina un usuario del sistema',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del usuario',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario eliminado exitosamente',
  })
  @ApiResponse({
    status: 409,
    description: 'No se puede eliminar el usuario porque tiene estudios asociados',
  })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
