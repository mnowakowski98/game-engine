import { Canvas } from '../../foundation/engine/rendering/canvas'
import { startRenderLoop } from '../../foundation/engine/rendering/render-loop'
import { startUpdateLoop } from '../../foundation/engine/update/update-loop'
import Scene from '../../foundation/engine/rendering/scene'

export default Scene

export function startScene(canvas: Canvas, scene: Scene): () => void {
    const stopRenderLoop = startRenderLoop(canvas, scene)
    const stopUpdateLoop = startUpdateLoop(scene)

    return () => {
        stopRenderLoop()
        stopUpdateLoop()
    }
}