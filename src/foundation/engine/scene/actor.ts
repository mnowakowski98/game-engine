import Unique from '../../base-types/unique'
import Positionable from '../rendering/positionable'
import Rotatable from '../rendering/rotatable'
import Updatable from '../update/updatable'

export type ActorContainer = {
    actors?: () => Actor[]
}

type ActorBase = Unique & ActorContainer
export type ActorOptionals = (Positionable | Rotatable | Updatable)

type Actor = ActorBase & ActorOptionals
export default Actor