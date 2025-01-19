import type { AnswerCommentsRepository } from '../repositories/answer-comments-repository'

interface DeleteAnswerCommentUseCaseRequest {
  answerCommentId: string
  authorId: string
}

// biome-ignore lint/suspicious/noEmptyInterface: <explanation>
interface DeleteAnswerCommentUseCaseResponse {}

export class DeleteAnswerCommentUseCase {
  constructor(private answerCommentRepository: AnswerCommentsRepository) {}

  async execute({
    answerCommentId,
    authorId,
  }: DeleteAnswerCommentUseCaseRequest): Promise<DeleteAnswerCommentUseCaseResponse> {
    const answerComment =
      await this.answerCommentRepository.findById(answerCommentId)

    if (!answerComment) throw new Error('Answer comment not found!')

    if (authorId !== answerComment.authorId.toString())
      throw new Error('Not allowed')

    await this.answerCommentRepository.delete(answerComment)

    return {}
  }
}
