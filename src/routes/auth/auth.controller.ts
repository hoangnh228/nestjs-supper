import { Body, Controller, Post } from '@nestjs/common'
import { RegisterBodyDto } from 'src/routes/auth/auth.dto'
import { AuthService } from 'src/routes/auth/auth.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() body: RegisterBodyDto) {
    console.log(body)
    return 'register'
    // return this.authService.register(body)
  }
}
