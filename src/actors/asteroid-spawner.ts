import { deg2rad } from '../angle-utils'
import Positionable from '../positionable'
import { addRendering, removeRendering } from '../render-loop'
import Updateable from '../updatable'
import { addUpdatable, removeUpdatable } from '../update-loop'
import { Asteroid, checkCollision, renderAsteroid, updateAsteroid } from './asteroid'

export interface AsteroidSpawner extends Updateable {
    maxSpeed: number
    minSpeed: number
    maxRadius: number
    minRadius: number,
    checkCollisionsWith: Positionable,
    onAsteroidCollision: () => void,
    onAsteroidDespawn: () => void
}

export function spawnAsteroid(spawner: AsteroidSpawner, id: string,
    canvasWidth: number, canvasHeight: number, isPaused: () => boolean) {

    const asteroid: Asteroid = {
        id: `asteroid-${id}`,
        boundingRadius: Math.random() * 25,
        position: {
            x: canvasWidth / 2,
            y: canvasHeight / 2
        },
        rotation: deg2rad(90),
        speed: (Math.random() * 10) + 5,
        update: deltaTime => {
            if (isPaused()) return
            updateAsteroid(asteroid, deltaTime, isPaused())

            if (asteroid.isCollidingWith(spawner.checkCollisionsWith.position)) spawner.onAsteroidCollision()

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
