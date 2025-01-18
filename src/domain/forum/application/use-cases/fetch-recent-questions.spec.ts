import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { FetchRecentQuestionsUseCase } from './fetch-recent-questions'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: FetchRecentQuestionsUseCase

describe('Fetch recent questions use-case', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new FetchRecentQuestionsUseCase(inMemoryQuestionsRepository)
  })

  it('should be able to fetch recent questions', async () => {
    await inMemoryQuestionsRepository.create(
      makeQuestion({ createdAt: new Date(2024, 0, 16) }),
    )
    await inMemoryQuestionsRepository.create(
      makeQuestion({ createdAt: new Date(2024, 0, 15) }),
    )
    await inMemoryQuestionsRepository.create(
      makeQuestion({ createdAt: new Date(2024, 0, 17) }),
    )

    const { questions } = await sut.execute({ page: 1 })

    expect(questions).toEqual([
      expect.objectContaining({ createdAt: new Date(2024, 0, 17) }),
      expect.objectContaining({ createdAt: new Date(2024, 0, 16) }),
      expect.objectContaining({ createdAt: new Date(2024, 0, 15) }),
    ])
  })

  it('should be able to fetch recent questions paginated', async () => {
    for (let index = 1; index <= 22; index++) {
      await inMemoryQuestionsRepository.create(makeQuestion())
    }

    const { questions } = await sut.execute({ page: 2 })

    expect(questions).toHaveLength(2)
  })
})
