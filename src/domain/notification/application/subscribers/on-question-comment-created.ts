import type { EventHandler } from '@/core/events/event-handler'
import type { SendNotificationUseCase } from '../use-cases/send-notification'
import { QuestionCommentCreatedEvent } from '@/domain/forum/enterprise/events/question-comment-created-event'
import type { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { DomainEvents } from '@/core/events/domain-events'

export class OnQuestionCommentCreated implements EventHandler {
  constructor(
    private questionsRepository: InMemoryQuestionsRepository,
    private sendNotificationUseCase: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions() {
    DomainEvents.register(
      this.sendNewQuestionCommentNotification.bind(this),
      QuestionCommentCreatedEvent.name,
    )
  }

  private async sendNewQuestionCommentNotification({
    questionComment,
  }: QuestionCommentCreatedEvent) {
    const question = await this.questionsRepository.findById(
      questionComment.questionId.toString(),
    )

    if (question) {
      this.sendNotificationUseCase.execute({
        recipientId: question.authorId.toString(),
        title: `Novo comentário em "${question.title.substring(0, 30).concat('...')}"`,
        content: questionComment.content,
      })
    }
  }
}
