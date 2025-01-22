import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { SendNotificationUseCase } from './send-notification'

let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sut: SendNotificationUseCase

describe('Send notification use-case', () => {
  beforeAll(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sut = new SendNotificationUseCase(inMemoryNotificationsRepository)
  })
  it('should be able to send a notification', async () => {
    const { isLeft, isRight, value } = await sut.execute({
      recipientId: '1',
      title: 'Nova notificação',
      content: 'Conteúdo nova notificação',
    })

    expect(isRight()).toBe(true)
    expect(inMemoryNotificationsRepository.items[0]).toEqual(
      value?.notification,
    )
  })
})
