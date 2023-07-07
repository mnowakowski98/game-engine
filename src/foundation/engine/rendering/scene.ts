import Camera from './camera'
import World from './world'
import Coordinate from '../space/coordinates'
import Unique from '../../base-types/unique'


export default interface Scene extends Unique {
    cameras?: () => ({camera: Camera, position: Coordinate})[]
    world?: () => World
}