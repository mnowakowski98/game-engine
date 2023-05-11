import Renderable from '../../foundation/engine/rendering/renderable'
import Camera from '../../foundation/engine/rendering/camera'
import World from '../../foundation/engine/rendering/world'
import Coordinate from '../../foundation/engine/space/coordinates'
import { Context } from '../../foundation/engine/rendering/canvas'
import { startRenderLoop } from '../../foundation/engine/rendering/render-loop'
import { startUpdateLoop } from '../../foundation/engine/update/update-loop'

export default interface Scene {
    cameras?: () => (Camera & Coordinate)[]
    world?: () => World
    renderings?: () => Renderable[]
}

export function startScene(context: Context, scene: Scene): () => void {
    const stopRenderLoop = startRenderLoop(context, scene)
    const stopUpdateLoop = startUpdateLoop(scene)

    return () => {
        stopRenderLoop()
        stopUpdateLoop()
    }
}