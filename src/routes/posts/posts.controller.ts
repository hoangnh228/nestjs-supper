import { AuthTypes, ConditionGuard } from './../../shared/constants/auth.constant'
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { PostsService } from './posts.service'
import { Auth } from 'src/shared/decorators/auth.decorator'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
import { CreatePostDTO, GetPostItemDTO, UpdatePostDTO } from 'src/routes/posts/post.dto'

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Auth([AuthTypes.Bearer, AuthTypes.ApiKey], { condition: ConditionGuard.Or })
  @Get()
  getPosts(@ActiveUser('userId') userId: number) {
    return this.postsService.getPosts(userId).then((posts) => posts.map((post) => new GetPostItemDTO(post)))
  }

  @Auth([AuthTypes.Bearer])
  @Get(':id')
  async getPostById(@Param('id') id: number) {
    return new GetPostItemDTO(await this.postsService.getPostById(id))
  }

  @Auth([AuthTypes.Bearer])
  @Post()
  async createPost(@Body() body: CreatePostDTO, @ActiveUser('userId') userId: number) {
    return new GetPostItemDTO(await this.postsService.createPost(userId, body))
  }

  @Auth([AuthTypes.Bearer])
  @Put(':id')
  async updatePost(@Param('id') id: number, @Body() body: UpdatePostDTO, @ActiveUser('userId') userId: number) {
    return new GetPostItemDTO(await this.postsService.updatePost(userId, id, body))
  }

  @Auth([AuthTypes.Bearer])
  @Delete(':id')
  async deletePost(@Param('id') id: number, @ActiveUser('userId') userId: number): Promise<{ message: string }> {
    return this.postsService.deletePost(userId, id)
  }
}
