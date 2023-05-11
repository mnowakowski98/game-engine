import { Rotatable } from '../space/rotation'
import Positionable from './positionable'
import Mesh from './mesh'
import Unique from '../../base-types/unique'
import Renderable from './renderable'

type Actor = (Mesh | Renderable) & (Unique &Positionable & Rotatable & ActorContainer)

type ActorContainer = {
    actors?: () => Actor[]
}

export default interface World extends ActorContainer {}