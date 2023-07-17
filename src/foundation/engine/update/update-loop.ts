import Scene from '../scene/scene'
import { isUpdatable } from './updatable'

export function startUpdateLoop(scene: Scene): () => void {
    let isUpdating = true
    let lastUpdateTime = performance.now()
    let timeout: NodeJS.Timeout

    const loop = () => {
        if (!isUpdating) return

        const now = performance.now()

        // Deny the possibility that two updates were called in the same second
        // as it was causing some issues with distance calculations
        const deltaTime = now - lastUpdateTime || 1
        lastUpdateTime = now
        if (scene.cameras) scene.cameras.forEach(camera => {
            if (isUpdatable(camera.camera)) camera.camera.update(deltaTime)
        })
        scene.actors.forEach(actor => {
            if (isUpdatable(actor)) actor.update(deltaTime)
        })

        timeout = setTimeout(loop)
    }
    loop()

    return () => {
        isUpdating = false
        clearTimeout(timeout)
    }
}