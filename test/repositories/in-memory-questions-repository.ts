import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import type { Question } from '@/domain/forum/enterprise/entities/question'

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public items: Question[] = []

  async findById(id: string) {
    const question = this.items.find((item) => item.id.toString() === id)

    if (!question) return null

    return question
  }

  async findBySlug(slug: string) {
    const question = this.items.find((item) => item.slug.value === slug)

    if (!question) return null

    return question
  }

  async findManyRecent(params: PaginationParams) {
    const initIndex = (params.page - 1) * 20
    const finalIndex = params.page * 20

    const questions = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .splice(initIndex, finalIndex)

    return questions
  }

  async create(question: Question) {
    this.items.push(question)
  }

  async delete(question: Question) {
    const indexToDelete = this.items.findIndex(
      (item) => item.id === question.id,
    )

    this.items.splice(indexToDelete, 1)
  }

  async save(question: Question) {
    const indexToSave = this.items.findIndex((item) => item.id === question.id)

    this.items[indexToSave] = question
  }
}
