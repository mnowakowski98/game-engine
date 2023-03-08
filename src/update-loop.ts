import Collidable from './collidable'
import Updateable from './updatable'

const updateables: Updateable[] = []

export function addUpdatable(updatable: Updateable) {
    updateables.push(updatable)
}

export function removeUpdatable(updatable: Updateable) {
    updateables.slice(updateables.findIndex(_ => updatable.id === _.id))
}

let isUpdating = false

function tick(deltaTime: number) {
    for (const updatable of updateables) updatable.update(deltaTime)
}

export function startUpdating() {
    const startTime = performance.now()
    let lastUpdateTime = startTime
    isUpdating = true

    const timer = setInterval(() => {
        if(!isUpdating) {
            clearInterval(timer)
            return
        }

        tick(lastUpdateTime - performance.now())
        lastUpdateTime = performance.now()
    })
}

export function stopUpdateLoop() {
    isUpdating = false
}