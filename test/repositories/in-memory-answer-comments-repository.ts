import type { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository'
import type { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'

export class InMemoryAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  public items: AnswerComment[] = []

  async findById(id: string) {
    const answerComment = this.items.find((item) => item.id.toString() === id)

    if (!answerComment) return null

    return answerComment
  }

  async create(answerComment: AnswerComment): Promise<void> {
    this.items.push(answerComment)
  }
  async delete(answerComment: AnswerComment) {
    const indexToDelete = this.items.findIndex(
      (item) => item.id === answerComment.id,
    )

    this.items.splice(indexToDelete, 1)
  }
}
