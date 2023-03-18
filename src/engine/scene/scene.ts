import { clearCommands } from '../command'
import { removeAllRenderings, startRenderLoop } from '../render-loop'
import { removeAllUpdatables, startUpdateLoop } from '../update-loop'

export default interface Scene {
    endSceneEventType: string,
    init: () => void
    onSceneEnd: () => void
}

let currentScene: Scene

export function getCurrentScene(): Scene {
    return currentScene
}

export function startScene(scene: Scene, context: CanvasRenderingContext2D) {
    const stopUpdating = startUpdateLoop()
    const stopRendering = startRenderLoop(context)

    const stopScene = () => {
        stopUpdating()
        removeAllUpdatables()

        stopRendering()
        removeAllRenderings()

        clearCommands()

        removeEventListener(scene.endSceneEventType, stopScene)

        scene.onSceneEnd()
    }

    currentScene = scene
    scene.init()
    addEventListener(scene.endSceneEventType, stopScene)
}