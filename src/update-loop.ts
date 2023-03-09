import Updateable from './updatable'

const updateables: Updateable[] = []

export function addUpdatable(updatable: Updateable) {
    updateables.push(updatable)
}

export function removeUpdatable(updatable: Updateable) {
    updateables.splice(updateables.findIndex(_ => updatable.id === _.id), 1)
}

let isUpdating = false

function tick(deltaTime: number) {
    for (const updatable of updateables) updatable.update(deltaTime)
}

export function startUpdating(): number {
    const startTime = performance.now()
    let lastUpdateTime = startTime
    isUpdating = true

    const timer = setInterval(() => {
        if(!isUpdating) {
            clearInterval(timer)
            return
        }

        const now = performance.now()
        tick(now - lastUpdateTime)
        lastUpdateTime = now
    })

    return startTime
}

export function stopUpdateLoop() {
    isUpdating = false
}