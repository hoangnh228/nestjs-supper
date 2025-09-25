import { Injectable, NotFoundException } from '@nestjs/common'
import { CreatePostDTO, UpdatePostDTO } from 'src/routes/posts/post.dto'
import { isNotFoundPrismaError } from 'src/shared/helpers'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  getPosts(userId: number) {
    const createLogWithTime = (logFnc: (message: string) => void) => (message1: string) => {
      const now = new Date().toISOString()
      logFnc(`${now}: ${message1}`)
    }

    const log1 = createLogWithTime(console.log)
    log1('Hello')

    return this.prisma.post.findMany({
      where: {
        authorId: userId,
      },
      include: {
        author: {
          omit: {
            password: true,
          },
        },
      },
    })
  }

  async getPostById(id: number) {
    try {
      return await this.prisma.post.findUniqueOrThrow({
        where: {
          id,
        },
        include: {
          author: {
            omit: {
              password: true,
            },
          },
        },
      })
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw new NotFoundException('Post not found')
      }
      throw error
    }
  }

  createPost(userId: number, body: CreatePostDTO) {
    console.log(userId)
    return this.prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: userId,
      },
    })
  }

  async updatePost(userId: number, id: number, body: UpdatePostDTO) {
    try {
      return await this.prisma.post.update({
        where: {
          id,
          authorId: userId,
        },
        data: {
          title: body.title,
          content: body.content,
        },
        include: {
          author: {
            omit: {
              password: true,
            },
          },
        },
      })
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw new NotFoundException('Post not found')
      }
      throw error
    }
  }

  async deletePost(userId: number, id: number) {
    try {
      await this.prisma.post.delete({
        where: {
          id,
          authorId: userId,
        },
      })
      return { message: 'Post deleted successfully' }
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw new NotFoundException('Post not found')
      }
      throw error
    }
  }
}
