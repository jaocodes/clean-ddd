import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { FetchQuestionAnswersUseCase } from './fetch-question-answers'

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository

let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: FetchQuestionAnswersUseCase

describe('Fetch question answers use-case', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )
    sut = new FetchQuestionAnswersUseCase(inMemoryAnswersRepository)
  })

  it('should be able to fetch question answers', async () => {
    await inMemoryAnswersRepository.create(
      makeAnswer({
        questionId: new UniqueEntityID('question-01'),
      }),
    )
    await inMemoryAnswersRepository.create(
      makeAnswer({
        questionId: new UniqueEntityID('question-01'),
      }),
    )
    await inMemoryAnswersRepository.create(
      makeAnswer({
        questionId: new UniqueEntityID('question-01'),
      }),
    )

    const { isLeft, isRight, value } = await sut.execute({
      page: 1,
      questionId: 'question-01',
    })

    expect(value?.answers).toHaveLength(3)
  })

  it('should be able to fetch answers paginated', async () => {
    for (let index = 1; index <= 22; index++) {
      await inMemoryAnswersRepository.create(
        makeAnswer({ questionId: new UniqueEntityID('question-01') }),
      )
    }

    const { isLeft, isRight, value } = await sut.execute({
      page: 2,
      questionId: 'question-01',
    })

    expect(value?.answers).toHaveLength(2)
  })
})
