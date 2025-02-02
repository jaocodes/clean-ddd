import { DomainEvents } from '@/core/events/domain-events'
import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import type { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'

export class InMemoryQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  public items: QuestionComment[] = []

  async findById(id: string) {
    const questionComment = this.items.find((item) => item.id.toString() === id)

    if (!questionComment) return null

    return questionComment
  }

  async findManyByQuestionId(
    questionId: string,
    params: PaginationParams,
  ): Promise<QuestionComment[]> {
    const initIndex = (params.page - 1) * 20
    const finalIndex = params.page * 20

    const questionComments = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .splice(initIndex, finalIndex)

    return questionComments
  }

  async create(questionComment: QuestionComment) {
    this.items.push(questionComment)

    DomainEvents.dispatchEventsForAggregate(questionComment.id)
  }

  async delete(questionComment: QuestionComment) {
    const indexToDelete = this.items.findIndex(
      (item) => item.id === questionComment.id,
    )

    this.items.splice(indexToDelete, 1)
  }
}
