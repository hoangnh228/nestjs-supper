import { Exclude, Type } from 'class-transformer'
import { IsString } from 'class-validator'
import { SuccessResDTO } from 'src/shared/shared.dto'

export class LoginBodyDto {
  @IsString() email: string
  @IsString() password: string
}

export class LoginResDTO {
  accessToken: string
  refreshToken: string

  constructor(partial: Partial<LoginResDTO>) {
    Object.assign(this, partial)
  }
}
export class RegisterBodyDto extends LoginBodyDto {
  @IsString() name: string
  @IsString() confirmPassword: string
}

class RegisterData {
  id: number
  email: string
  name: string
  @Exclude() password: string
  createdAt: Date
  updatedAt: Date

  constructor(partial: Partial<RegisterData>) {
    Object.assign(this, partial)
  }
}

export class RegisterResDTO extends SuccessResDTO {
  @Type(() => RegisterData)
  declare data: RegisterData

  constructor(partial: Partial<RegisterResDTO>) {
    super(partial)
    Object.assign(this, partial)
  }
}

export class RefreshTokenBodyDto {
  @IsString() refreshToken: string
}

export class RefreshTokenResDTO extends LoginResDTO {}
