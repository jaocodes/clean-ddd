import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { AnswerQuestionUseCase } from './answer-question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: AnswerQuestionUseCase

describe('Create an answer use-case', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    sut = new AnswerQuestionUseCase(inMemoryAnswersRepository)
  })
  it('should be able to answer a question', async () => {
    const { isLeft, isRight, value } = await sut.execute({
      content: 'Primeira resposta',
      instructorId: '1',
      questionId: '1',
      attachmentsId: ['1', '2'],
    })

    expect(isRight()).toBe(true)
    expect(inMemoryAnswersRepository.items[0]).toEqual(value?.answer)
    expect(
      inMemoryAnswersRepository.items[0].attachments.currentItems,
    ).toHaveLength(2)
    expect(inMemoryAnswersRepository.items[0].attachments.currentItems).toEqual(
      [
        expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
        expect.objectContaining({ attachmentId: new UniqueEntityID('2') }),
      ],
    )
  })
})
