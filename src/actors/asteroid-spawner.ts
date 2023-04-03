import { deg2rad, positionDistance, randomBetween } from '../math-utils'
import Positionable from '../engine/scene/positionable'
import Updatable from '../engine/scene/updatable'
import { Asteroid, checkCollision, renderAsteroid, updateAsteroid } from './asteroid'
import World, { getWorldBounds } from '../engine/scene/world'
import Pausable from '../engine/scene/pausable'

export interface AsteroidSpawner extends Updatable, Positionable, Pausable {
    maxSpeed: number
    minSpeed: number
    maxRadius: number
    minRadius: number
    minAngle: number
    maxAngle: number
    checkCollisionsWith: Positionable[],
    onAsteroidCollision: (target: Positionable) => void,
    onAsteroidDespawn: () => void
}

export function spawnAsteroidInWorld(spawner: AsteroidSpawner, world: World, id: string, maxDistance: number) {
    const asteroid: Asteroid = {
        id: `${spawner.id}--asteroid-${id}`,
        boundingRadius: (Math.random() * (spawner.maxRadius - spawner.minRadius)) + spawner.minRadius,
        position: {
            x: spawner.position.x,
            y: spawner.position.y
        },
        rotation: deg2rad(randomBetween(spawner.minAngle, spawner.maxAngle)),
        speed: (Math.random() * (spawner.maxSpeed - spawner.minSpeed)) + spawner.minSpeed,
        zIndex: 2,
        isPaused: spawner.isPaused,
        update: deltaTime => {
            if (spawner.isPaused()) return

            updateAsteroid(asteroid, deltaTime)

            for (const target of spawner.checkCollisionsWith) {
                if (asteroid.isCollidingWith(target.position)) {
                    asteroid.rotation *= -1
                    spawner.onAsteroidCollision(target)
                }
            }

            const worldBounds = getWorldBounds(world)
            const outsideWorldX = asteroid.position.x < worldBounds[0].x || asteroid.position.x > worldBounds[1].x
            const outsideWorldY = asteroid.position.y < worldBounds[0].y || asteroid.position.y > worldBounds[1].y
            const outsideMaxDistance = positionDistance(spawner.position, asteroid.position) > maxDistance

            if (outsideWorldX || outsideWorldY || outsideMaxDistance) {
                world.actors.splice(world.actors.findIndex(_ => asteroid.id === _.id), 1)
                spawner.onAsteroidDespawn()
            }
        },
        render: context => renderAsteroid(asteroid, context),
        isCollidingWith: position => checkCollision(asteroid, position)
    }

    world.actors.push(asteroid)
}
