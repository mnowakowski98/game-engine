import Rotatable from './rotatable'
import Positionable from './positionable'
import Mesh from './mesh'
import Unique from '../../base-types/unique'
import Updatable from '../update/updatable'

type ActorBase = Unique & ActorContainer
type ActorOptionals = (Mesh | Positionable | Rotatable | Updatable)
export type Actor = ActorBase & ActorOptionals
    
export function isPositionable(actor: Actor): actor is ActorBase & Positionable {
    return (actor as Positionable).position !== undefined
}

export function isMesh(actor: Actor): actor is ActorBase & Mesh {
    return (actor as Mesh).geometry !== undefined
}

type ActorContainer = {
    actors?: () => Actor[]
}

export default interface World extends ActorContainer {}