import Unique from '../../base-types/unique'
import Positionable from '../rendering/positionable'
import Rotatable from '../rendering/rotatable'
import Updatable from '../update/updatable'

export type ActorContainer = {
    actors?: ReadonlyMap<string, Actor>
    onActorAdded?: (actor: Actor) => void
    onActorRemoved?: (actor: Actor) => void
}

export const actorAddedEvent = 'engine-actor-adde'

export function addActor(container: ActorContainer, actor: Actor) {
    const map = new Map<string, Actor>(container.actors)
    map.set(actor.id, actor)
    container.onActorAdded?.(actor)
}

export function removeActor(container: ActorContainer, actor: Actor) {
    const map = new Map<string, Actor>(container.actors)
    map.delete(actor.id)
    container.onActorRemoved?.(actor)
}

type ActorBase = Unique & ActorContainer
export type ActorOptionals = (Unique | Positionable | Rotatable | Updatable)

type Actor = ActorBase & ActorOptionals
export default Actor