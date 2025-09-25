import { AuthTypes, ConditionGuard } from './../../shared/constants/auth.constant'
import { Body, Controller, Get, Post } from '@nestjs/common'
import { PostsService } from './posts.service'
import { Auth } from 'src/shared/decorators/auth.decorator'

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Auth([AuthTypes.Bearer, AuthTypes.ApiKey], { condition: ConditionGuard.And })
  @Get()
  getPosts() {
    return this.postsService.getPosts()
  }

  @Post()
  createPost(@Body() body: any) {
    return this.postsService.createPost(body)
  }
}
