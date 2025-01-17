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

  async create(question: Question): Promise<void> {
    this.items.push(question)
  }

  async delete(question: Question) {
    const indexToDelete = this.items.findIndex(
      (item) => item.id === question.id,
    )

    this.items.splice(indexToDelete, 1)
  }
}
