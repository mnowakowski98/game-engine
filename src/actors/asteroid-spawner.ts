import { deg2rad } from '../math-utils'
import Positionable from '../engine/scene/positionable'
import { addRendering, removeRendering } from '../engine/render-loop'
import Updatable from '../engine/scene/updatable'
import { addUpdatable, removeUpdatable } from '../engine/update-loop'
import { Asteroid, checkCollision, renderAsteroid, updateAsteroid } from './asteroid'

export interface AsteroidSpawner extends Updatable {
    maxSpeed: number
    minSpeed: number
    maxRadius: number
    minRadius: number,
    checkCollisionsWith: Positionable[],
    onAsteroidCollision: () => void,
    onAsteroidDespawn: () => void
}

export function spawnAsteroid(spawner: AsteroidSpawner, id: string,
    canvasWidth: number, canvasHeight: number, isPaused: () => boolean) {

    const asteroid: Asteroid = {
        id: `asteroid-${id}`,
        boundingRadius: (Math.random() * (spawner.maxRadius - spawner.minRadius)) + spawner.minRadius,
        position: {
            x: canvasWidth / 2,
            y: canvasHeight / 2
        },
        rotation: deg2rad(Math.random() * 360),
        speed: (Math.random() * (spawner.maxSpeed - spawner.minSpeed)) + spawner.minSpeed,
        update: deltaTime => {
            if (isPaused()) return
            updateAsteroid(asteroid, deltaTime, isPaused())

            for (const positionable of spawner.checkCollisionsWith)
                if (asteroid.isCollidingWith(positionable.position)) spawner.onAsteroidCollision()

            const isPastLeftBound = asteroid.position.x < asteroid.boundingRadius
            const isPastRightBound = asteroid.position.x > canvasWidth + asteroid.boundingRadius
            const isOutsideXBounds = isPastLeftBound || isPastRightBound

            const isPastTopBound = asteroid.position.y < -asteroid.boundingRadius
            const isPastBottomBound = asteroid.position.y > canvasHeight + asteroid.boundingRadius
            const isOutsideYBounds = isPastTopBound || isPastBottomBound

            if (isOutsideXBounds || isOutsideYBounds) {
                removeUpdatable(asteroid)
                removeRendering(asteroid)
                spawner.onAsteroidDespawn()
            }
        },
        render: context => renderAsteroid(asteroid, context),
        isCollidingWith: position => checkCollision(asteroid, position)
    }

    addUpdatable(asteroid)
    addRendering(asteroid)
}
