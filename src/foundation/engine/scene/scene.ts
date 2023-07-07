import Camera from './camera'
import World from './world'
import { Coordinate2d } from '../space/coordinates'
import Unique from '../../base-types/unique'
import Overlay from './overlay'


export default interface Scene extends Unique {
    cameras?: () => ({ camera: Camera, screenPosition: Coordinate2d })[]
    world?: () => World
    overlays?: () => ({ overlay: Overlay, screenPosition: Coordinate2d })
}