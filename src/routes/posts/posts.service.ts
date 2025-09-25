import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  getPosts() {
    const createLogWithTime = (logFnc: (message: string) => void) => (message1: string) => {
      const now = new Date().toISOString()
      logFnc(`${now}: ${message1}`)
    }

    const log1 = createLogWithTime(console.log)
    log1('Hello')

    return this.prisma.post.findMany()
  }

  createPost(userId: number, body: any) {
    console.log(userId)
    return this.prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: userId,
      },
    })
  }
}
