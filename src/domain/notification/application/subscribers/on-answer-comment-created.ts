import type { EventHandler } from '@/core/events/event-handler'
import type { SendNotificationUseCase } from '../use-cases/send-notification'
import { AnswerCommentCreatedEvent } from '@/domain/forum/enterprise/events/answer-comment-created-event'
import type { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { DomainEvents } from '@/core/events/domain-events'

export class OnAnswerCommentCreated implements EventHandler {
  constructor(
    private answerRepository: AnswersRepository,
    private sendNotificationUseCase: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions() {
    DomainEvents.register(
      this.sendNewAnswerCommentNotification.bind(this),
      AnswerCommentCreatedEvent.name,
    )
  }

  private async sendNewAnswerCommentNotification({
    answerComment,
  }: AnswerCommentCreatedEvent) {
    const answer = await this.answerRepository.findById(
      answerComment.answerId.toString(),
    )

    if (answer) {
      this.sendNotificationUseCase.execute({
        recipientId: answer.authorId.toString(),
        title: `Novo comentário em "${answer.content.substring(0, 30).concat('...')}"`,
        content: answerComment.content,
      })
    }
  }
}
