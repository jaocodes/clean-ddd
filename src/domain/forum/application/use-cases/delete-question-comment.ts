import type { QuestionCommentsRepository } from '../repositories/question-comments-repository'

interface DeleteQuestionCommentUseCaseRequest {
  questionCommentId: string
  authorId: string
}

// biome-ignore lint/suspicious/noEmptyInterface: <explanation>
interface DeleteQuestionCommentUseCaseResponse {}

export class DeleteQuestionCommentUseCase {
  constructor(private questionCommentRepository: QuestionCommentsRepository) {}

  async execute({
    questionCommentId,
    authorId,
  }: DeleteQuestionCommentUseCaseRequest): Promise<DeleteQuestionCommentUseCaseResponse> {
    const questionComment =
      await this.questionCommentRepository.findById(questionCommentId)

    if (!questionComment) throw new Error('Question comment not found!')

    if (authorId !== questionComment.authorId.toString())
      throw new Error('Not allowed')

    await this.questionCommentRepository.delete(questionComment)

    return {}
  }
}
