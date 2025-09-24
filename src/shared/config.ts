import { plainToInstance } from 'class-transformer'
import { IsInt, IsString, validateSync } from 'class-validator'
import fs from 'fs'
import path from 'path'
import { config } from 'dotenv'
config({ path: '.env' })

// check .env file exists
if (!fs.existsSync(path.resolve('.env'))) {
  console.log('.env file not found')
  process.exit(1)
}

class ConfigSchema {
  @IsString()
  DATABASE_URL: string

  @IsString()
  ACCESS_TOKEN_SECRET: string

  @IsString()
  ACCESS_TOKEN_EXPIRES_IN: string

  @IsString()
  REFRESH_TOKEN_SECRET: string

  @IsString()
  REFRESH_TOKEN_EXPIRES_IN: string

  @IsInt()
  APP_PORT: number
}

const configServer = plainToInstance(ConfigSchema, process.env, {
  enableImplicitConversion: true,
})
const e = validateSync(configServer)

if (e.length > 0) {
  console.log('Invalid environment variables')
  const errors = e.map((item) => {
    return { property: item.property, constraints: item.constraints, value: item.value }
  })

  throw errors
}

const envConfig = configServer

export default envConfig
