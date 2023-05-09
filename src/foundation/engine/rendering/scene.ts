import Renderable from '../scene/renderable'
import Camera from './camera'
import World from './world'

export default interface Scene {
    cameras: () => Camera[]
    world: () => World
    renderings: () => Renderable[]
}