import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { DeleteQuestionUseCase } from './delete-question'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { DeleteQuestionCommentUseCase } from './delete-question-comment'
import { makeQuestionComment } from 'test/factories/make-question-comment'

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: DeleteQuestionCommentUseCase

describe('Delete question comment use-case', () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository()
    sut = new DeleteQuestionCommentUseCase(inMemoryQuestionCommentsRepository)
  })

  it('should be able to delete a question comment', async () => {
    const newQuestionComment = makeQuestionComment(
      { authorId: new UniqueEntityID('author-01') },
      new UniqueEntityID('question-comment-01'),
    )

    await inMemoryQuestionCommentsRepository.create(newQuestionComment)

    await sut.execute({
      authorId: 'author-01',
      questionCommentId: 'question-comment-01',
    })

    expect(inMemoryQuestionCommentsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a question comment from another user', async () => {
    const newQuestionComment = makeQuestionComment(
      { authorId: new UniqueEntityID('author-01') },
      new UniqueEntityID('question-comment-01'),
    )

    await inMemoryQuestionCommentsRepository.create(newQuestionComment)

    await expect(() => {
      return sut.execute({
        questionCommentId: 'question-comment-01',
        authorId: 'author-02',
      })
    }).rejects.toBeInstanceOf(Error)
  })
})
