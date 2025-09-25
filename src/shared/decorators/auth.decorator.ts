import { SetMetadata } from '@nestjs/common'
import { AuthType, ConditionGuardType } from 'src/shared/constants/auth.constant'

export const AUTH_TYPE_KEY = 'authType'

export type AuthTypeDecoratorPayload = {
  authTypes: AuthType[]
  options: {
    condition: ConditionGuardType
  }
}

export const Auth = (authTypes: string[], options: { condition: ConditionGuardType }) => {
  return SetMetadata(AUTH_TYPE_KEY, { authTypes, options })
}
