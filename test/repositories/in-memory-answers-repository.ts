import { DomainEvents } from '@/core/events/domain-events'
import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import type { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import type { Answer } from '@/domain/forum/enterprise/entities/answer'

export class InMemoryAnswersRepository implements AnswersRepository {
  public items: Answer[] = []

  constructor(
    private answerAttachmentsRepository: AnswerAttachmentsRepository,
  ) {}

  async findById(id: string) {
    const answer = this.items.find((item) => item.id.toString() === id)

    if (!answer) return null

    return answer
  }

  async findManyByQuestionId(questionId: string, params: PaginationParams) {
    const initIndex = (params.page - 1) * 20
    const finalIndex = params.page * 20

    const answers = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .splice(initIndex, finalIndex)

    return answers
  }

  async create(answer: Answer) {
    this.items.push(answer)

    DomainEvents.dispatchEventsForAggregate(answer.id)
  }

  async delete(answer: Answer) {
    const indexToDelete = this.items.findIndex((item) => item.id === answer.id)

    this.items.splice(indexToDelete, 1)

    this.answerAttachmentsRepository.deleteManyByAnswerId(answer.id.toString())
  }

  async save(answer: Answer) {
    const indexToSave = this.items.findIndex((item) => item.id === answer.id)

    this.items[indexToSave] = answer
    DomainEvents.dispatchEventsForAggregate(answer.id)
  }
}
