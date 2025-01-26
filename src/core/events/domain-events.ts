import type { AggregateRoot } from '../entities/aggregate-root'
import type { UniqueEntityID } from '../entities/unique-entity-id'
import type { DomainEvent } from './domain-event'

type DomainEventCallback<T extends DomainEvent> = (event: T) => void

// biome-ignore lint/complexity/noStaticOnlyClass: <Classe de controle para os eventos de dominio não precisa ser instanciada>
export class DomainEvents {
  private static handlersMap: Record<
    string,
    DomainEventCallback<DomainEvent>[]
  > = {}
  private static markedAggregates: AggregateRoot<unknown>[] = []

  public static markAggregateForDispatch(aggregate: AggregateRoot<unknown>) {
    const aggregateFound = !!DomainEvents.findMarkedAggregateByID(aggregate.id)
    if (!aggregateFound) {
      DomainEvents.markedAggregates.push(aggregate)
    }
  }

  private static dispatchAggregateEvents(aggregate: AggregateRoot<unknown>) {
    for (const event of aggregate.domainEvents) {
      DomainEvents.dispatch(event)
    }
  }

  private static removeAggregateFromMarkedDispatchList(
    aggregate: AggregateRoot<unknown>,
  ) {
    const index = DomainEvents.markedAggregates.findIndex((a) =>
      a.equals(aggregate),
    )
    DomainEvents.markedAggregates.splice(index, 1)
  }

  private static findMarkedAggregateByID(
    id: UniqueEntityID,
  ): AggregateRoot<unknown> | undefined {
    return DomainEvents.markedAggregates.find((aggregate) =>
      aggregate.id.equals(id),
    )
  }
  public static dispatchEventsForAggregate(id: UniqueEntityID) {
    const aggregate = DomainEvents.findMarkedAggregateByID(id)
    if (aggregate) {
      DomainEvents.dispatchAggregateEvents(aggregate)
      aggregate.clearEvents()
      DomainEvents.removeAggregateFromMarkedDispatchList(aggregate)
    }
  }

  public static register<T extends DomainEvent>(
    callback: DomainEventCallback<T>,
    eventClassName: string,
  ) {
    const wasEventRegisteredBefore = eventClassName in DomainEvents.handlersMap
    if (!wasEventRegisteredBefore) {
      DomainEvents.handlersMap[eventClassName] = []
    }
    DomainEvents.handlersMap[eventClassName].push(
      callback as DomainEventCallback<DomainEvent>,
    )
  }

  public static clearHandlers() {
    DomainEvents.handlersMap = {}
  }

  public static clearMarkedAggregates() {
    DomainEvents.markedAggregates = []
  }

  private static dispatch(event: DomainEvent) {
    const eventClassName: string = event.constructor.name
    const isEventRegistered = eventClassName in DomainEvents.handlersMap
    if (isEventRegistered) {
      const handlers = DomainEvents.handlersMap[eventClassName]
      for (const handler of handlers) {
        handler(event)
      }
    }
  }
}
