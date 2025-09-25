import { Body, Controller, HttpCode, HttpStatus, Post, SerializeOptions, UseGuards } from '@nestjs/common'
import {
  LoginBodyDto,
  LoginResDTO,
  LogoutResDTO,
  RefreshTokenBodyDto,
  RefreshTokenResDTO,
  RegisterBodyDto,
  RegisterResDTO,
} from 'src/routes/auth/auth.dto'
import { AuthService } from 'src/routes/auth/auth.service'
import { AccessTokenGuard } from 'src/shared/guards/access-token.guard'

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

  @UseGuards(AccessTokenGuard)
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() body: RefreshTokenBodyDto) {
    return new RefreshTokenResDTO(await this.authService.refreshToken(body.refreshToken))
  }

  @Post('logout')
  async logout(@Body() body: any) {
    return new LogoutResDTO(await this.authService.logout(body.refreshToken))
  }
}
