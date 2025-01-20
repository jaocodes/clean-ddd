import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { EditAnswerUseCase } from './edit-answer'
import { NotAllowedError } from './errors/not-allowed-error'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { makeAnswerAttachment } from 'test/factories/make-answer-attachment'

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: EditAnswerUseCase

describe('Edit answer use-case', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()

    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    sut = new EditAnswerUseCase(
      inMemoryAnswersRepository,
      inMemoryAnswerAttachmentsRepository,
    )
  })

  it('should be able to edit a answer', async () => {
    const newAnswer = makeAnswer(
      { authorId: new UniqueEntityID('author-01') },
      new UniqueEntityID('answer-01'),
    )

    await inMemoryAnswersRepository.create(newAnswer)

    inMemoryAnswerAttachmentsRepository.items.push(
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityID('1'),
      }),
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityID('2'),
      }),
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityID('3'),
      }),
    )

    await sut.execute({
      authorId: 'author-01',
      answerId: newAnswer.id.toString(),
      content: 'Conteúdo editado',
      attachmentsId: ['1', '3'],
    })

    expect(inMemoryAnswersRepository.items[0]).toMatchObject({
      content: 'Conteúdo editado',
    })
    expect(
      inMemoryAnswersRepository.items[0].attachments.currentItems,
    ).toHaveLength(2)
    expect(inMemoryAnswersRepository.items[0].attachments.currentItems).toEqual(
      [
        expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
        expect.objectContaining({ attachmentId: new UniqueEntityID('3') }),
      ],
    )
  })

  it('should not be able to edit a answer from another user', async () => {
    const newAnswer = makeAnswer(
      { authorId: new UniqueEntityID('author-01') },
      new UniqueEntityID('answer-01'),
    )

    await inMemoryAnswersRepository.create(newAnswer)
    const { isLeft, isRight, value } = await sut.execute({
      authorId: 'author-02',
      answerId: newAnswer.id.toString(),
      content: 'Conteúdo editado',
      attachmentsId: [],
    })
    expect(isLeft()).toBe(true)
    expect(value).toBeInstanceOf(NotAllowedError)
  })
})
