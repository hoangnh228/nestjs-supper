import { AuthTypes, ConditionGuard } from './../../shared/constants/auth.constant'
import { Body, Controller, Get, Post } from '@nestjs/common'
import { PostsService } from './posts.service'
import { Auth } from 'src/shared/decorators/auth.decorator'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Auth([AuthTypes.Bearer, AuthTypes.ApiKey], { condition: ConditionGuard.Or })
  @Get()
  getPosts() {
    return this.postsService.getPosts()
  }

  @Auth([AuthTypes.Bearer])
  @Post()
  createPost(@Body() body: any, @ActiveUser('userId') userId: number) {
    return this.postsService.createPost(userId, body)
  }
}
