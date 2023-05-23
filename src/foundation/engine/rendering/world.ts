import Rotatable from './rotatable'
import Positionable from './positionable'
import Mesh from './mesh'
import Unique from '../../base-types/unique'
import Updatable from '../update/updatable'

export type Actor = Unique & ActorContainer
    & (Mesh | Positionable | Rotatable | Updatable)
    

type ActorContainer = {
    actors?: () => Actor[]
}

export default interface World extends ActorContainer {}