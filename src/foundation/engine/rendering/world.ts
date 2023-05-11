import { Rotatable } from '../space/rotation'
import Positionable from './positionable'
import Mesh from './mesh'
import Unique from '../../base-types/unique'
import Renderable from './renderable'
import Updatable from '../update/updatable'

export type Actor = Unique & ActorContainer
    & (Mesh | Renderable)
    & (Positionable | Rotatable | Updatable)
    

type ActorContainer = {
    actors?: () => Actor[]
}

export default interface World extends ActorContainer {}