import { AggregateRoot } from '../entities/aggregate-root'
import type { UniqueEntityID } from '../entities/unique-entity-id'
import type { DomainEvent } from './domain-event'
import { DomainEvents } from './domain-events'
import { vi } from 'vitest'
class CustomAggregateCreated implements DomainEvent {
  public ocurredAt: Date
  private aggregate: CustomAggregate

  constructor(aggregate: CustomAggregate) {
    this.ocurredAt = new Date()
    this.aggregate = aggregate
  }

  public getAggregateId(): UniqueEntityID {
    throw new Error('Method not implemented.')
  }
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
class CustomAggregate extends AggregateRoot<any> {
  static create() {
    const aggregate = new CustomAggregate(null)

    // método de criação de entidades, assim que a entidade for criada ela terá acesso
    //ao nétodo de adicionar um novo evento de domínio, que por sua vez é uma classe também.
    //Entãom criamos o evento de domínio e passamos ao método.

    aggregate.addDomainEvent(new CustomAggregateCreated(aggregate))

    return aggregate
  }
}

describe('domain events', () => {
  it('should be able to dispatch an listen events', () => {
    const callbackSpy = vi.fn()

    //cadastra subscriber (ouvindo o evento de customaggregatedcreated)
    DomainEvents.register(callbackSpy, CustomAggregateCreated.name)

    //cria um aggregated sem salvar no banco de dados
    const aggregate = CustomAggregate.create()

    //assegurando que o evento foi criado mas não disparado
    expect(aggregate.domainEvents).toHaveLength(1)

    //salvando o aggregated no banco e disparando o evento específico
    DomainEvents.dispatchEventsForAggregate(aggregate.id)

    // o subscriber ouve o evento e faz o que precisa ser feito com o dado
    expect(callbackSpy).toHaveBeenCalled()

    // confirma que os eventos disparados não estão mais em espera
    expect(aggregate.domainEvents).toHaveLength(0)
  })
})
