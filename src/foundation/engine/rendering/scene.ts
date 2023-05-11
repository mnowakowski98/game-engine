import Renderable from './renderable'
import Camera from './camera'
import World from './world'
import Coordinate from '../space/coordinates'

export default interface Scene {
    cameras?: () => (Camera & Coordinate)[]
    world?: () => World
    renderings?: () => Renderable[]
}