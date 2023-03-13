import { removeAllRenderings, startRenderLoop } from './render-loop'
import { removeAllUpdatables, startUpdateLoop } from './update-loop'

export default interface Scene {
    endSceneEventType: string,
    init: () => void
    onSceneEnd: () => void
}

export function startScene(scene: Scene, context: CanvasRenderingContext2D) {
    const stopUpdating = startUpdateLoop()
    const stopRendering = startRenderLoop(context)

    const stopScene = () => {
        stopUpdating()
        removeAllUpdatables()

        stopRendering()
        removeAllRenderings()

        removeEventListener(scene.endSceneEventType, stopScene)

        scene.onSceneEnd()
    }

    scene.init()
    addEventListener(scene.endSceneEventType, stopScene)
}