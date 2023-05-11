import Scene from '../../../feature/scene/scene'

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
        if (scene.cameras) scene.cameras().forEach(camera => camera.update(deltaTime))
        if (scene.world) {
            const world = scene.world()
            if (world.actors) world.actors().forEach(actor => {
                if ('update' in actor) actor.update(deltaTime)
            })
        }

        lastUpdateTime = now
        timeout = setTimeout(loop)
    }

    return () => {
        isUpdating = false
        clearTimeout(timeout)
    }
}