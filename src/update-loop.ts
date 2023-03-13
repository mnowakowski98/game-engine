import Updatable from './updatable'

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

    const tick = (deltaTime: number) => {
        for (const updatable of updatables) {
            if (isUpdating) updatable.update(deltaTime)
        }
    }

    const timer = setInterval(() => {
        if(!isUpdating) {
            clearInterval(timer)
            return
        }

        const now = performance.now()
        tick(now - lastUpdateTime)
        lastUpdateTime = now
    })

    return () => isUpdating = false
}