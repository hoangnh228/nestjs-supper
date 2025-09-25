import { TokenService } from './../../shared/services/token.service'
import { ConflictException, Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common'
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library'
import { LoginBodyDto } from 'src/routes/auth/auth.dto'
import { isUniqueConstraintPrismaError } from 'src/shared/helpers'
import { HashingService } from 'src/shared/services/hashing.service'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly prisma: PrismaService,
    private readonly tokenService: TokenService,
  ) {}

  async register(body: any) {
    try {
      const hashedPassword = await this.hashingService.hash(body.password)
      const user = await this.prisma.user.create({
        data: {
          email: body.email,
          name: body.name,
          password: hashedPassword,
        },
      })
      return user
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw new ConflictException('Email already exists')
      }
      throw error
    }
  }

  async login(body: LoginBodyDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: body.email,
      },
    })

    if (!user) {
      throw new UnauthorizedException('Account does not exist')
    }

    const isPasswordValid = await this.hashingService.compare(body.password, user.password)

    if (!isPasswordValid) {
      throw new UnprocessableEntityException([
        {
          field: 'password',
          error: 'Invalid password',
        },
      ])
    }

    const tokens = await this.generateTokens({ userId: user.id })
    return tokens
  }

  async generateTokens(payload: { userId: number }) {
    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.signAccessToken(payload),
      this.tokenService.signRefreshToken(payload),
    ])
    const decodedRefreshToken = await this.tokenService.verifyRefreshToken(refreshToken)
    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: payload.userId,
        expiresAt: new Date(decodedRefreshToken.exp * 1000),
      },
    })

    return { accessToken, refreshToken }
  }

  async refreshToken(refreshToken: string) {
    try {
      // 1. Verify refresh token
      const { userId } = await this.tokenService.verifyRefreshToken(refreshToken)

      // 2. check exists
      await this.prisma.refreshToken.findUniqueOrThrow({
        where: {
          token: refreshToken,
        },
      })

      // 3. delete old refresh token
      await this.prisma.refreshToken.delete({
        where: {
          token: refreshToken,
        },
      })

      // 4. generate new tokens
      return await this.generateTokens({ userId })
    } catch (error) {
      // nếu đã refresh token rồi => thông báo refresh token đã bị hack
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new UnauthorizedException('Refresh token has been revoked')
      }
      throw new UnauthorizedException('Invalid refresh token')
    }
  }

  async logout(refreshToken: string) {
    try {
      // 1. Verify refresh token
      await this.tokenService.verifyRefreshToken(refreshToken)

      // 2. delete old refresh token
      await this.prisma.refreshToken.delete({
        where: {
          token: refreshToken,
        },
      })

      return { message: 'Logout successfully' }
    } catch (error) {
      // nếu đã refresh token rồi => thông báo refresh token đã bị hack
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new UnauthorizedException('Refresh token has been revoked')
      }
      throw new UnauthorizedException('Invalid refresh token')
    }
  }
}
