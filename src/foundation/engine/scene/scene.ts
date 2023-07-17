import Camera from './camera'
import { Coordinate2d } from '../space/coordinates'
import Unique from '../../base-types/unique'
import Overlay from './overlay'
import Actor, { ActorContainer } from './actor'


export default interface Scene extends Unique, ActorContainer {
    cameras: ReadonlyMap<string, { camera: Camera, screenPosition: Coordinate2d }>
    actors: ReadonlyMap<string, Actor>
    overlays?: ReadonlyMap<string, { overlay: Overlay, screenPosition: Coordinate2d }>
}