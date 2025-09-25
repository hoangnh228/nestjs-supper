import { Body, Controller, HttpCode, HttpStatus, Post, SerializeOptions } from '@nestjs/common'
import {
  LoginBodyDto,
  LoginResDTO,
  RefreshTokenBodyDto,
  RefreshTokenResDTO,
  RegisterBodyDto,
  RegisterResDTO,
} from 'src/routes/auth/auth.dto'
import { AuthService } from 'src/routes/auth/auth.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @SerializeOptions({ type: RegisterResDTO })
  @Post('register')
  async register(@Body() body: RegisterBodyDto) {
    // const user = await this.authService.register(body)
    // return new RegisterResDTO(user)
    return await this.authService.register(body)
  }

  @Post('login')
  async login(@Body() body: LoginBodyDto) {
    return new LoginResDTO(await this.authService.login(body))
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() body: RefreshTokenBodyDto) {
    return new RefreshTokenResDTO(await this.authService.refreshToken(body.refreshToken))
  }
}
