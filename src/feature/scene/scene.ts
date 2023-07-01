import Camera from '../../foundation/engine/rendering/camera'
import World from '../../foundation/engine/rendering/world'
import Coordinate from '../../foundation/engine/space/coordinates'
import { Canvas } from '../../foundation/engine/rendering/canvas'
import { startRenderLoop } from '../../foundation/engine/rendering/render-loop'
import { startUpdateLoop } from '../../foundation/engine/update/update-loop'
import Unique from '../../foundation/base-types/unique'

export { Actor } from '../../foundation/engine/rendering/world'

export default interface Scene extends Unique {
    cameras?: () => ({camera: Camera, position: Coordinate})[]
    world?: () => World
}

export function startScene(canvas: Canvas, scene: Scene): () => void {
    const stopRenderLoop = startRenderLoop(canvas, scene)
    const stopUpdateLoop = startUpdateLoop(scene)

    return () => {
        stopRenderLoop()
        stopUpdateLoop()
    }
}

export { Camera, World, Coordinate, Unique }