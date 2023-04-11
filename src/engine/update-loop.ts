import Updatable from './scene/updatable'

const updatables: Updatable[] = []

export function addUpdatable(updatable: Updatable) {
    updatables.push(updatable)
}

export function removeUpdatable(updatable: Updatable) {
    updatables.splice(updatables.findIndex(_ => updatable.id === _.id), 1)
}

export function removeAllUpdatables() {
    while (updatables.length > 0) updatables.pop()
}

export function startUpdateLoop(): () => void {
    let lastUpdateTime = performance.now()
    let isUpdating = true

    const loop = () => {
        if (!isUpdating) return

        const now = performance.now()

        // Deny the possibility that two updates were called in the same second
        // as it was causing some issues with distance calculations
        const deltaTime = now - lastUpdateTime || 1
        for (const updatable of updatables) updatable.update(deltaTime)

        lastUpdateTime = now
        setTimeout(loop)
    }

    loop()

    return () => isUpdating = false
}