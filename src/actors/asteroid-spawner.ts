import { deg2rad, positionDistance } from '../math-utils'
import Positionable from '../engine/scene/positionable'
import Updatable from '../engine/scene/updatable'
import { Asteroid, checkCollision, renderAsteroid, updateAsteroid } from './asteroid'
import World, { getWorldBounds } from '../engine/scene/world'

export interface AsteroidSpawner extends Updatable, Positionable {
    maxSpeed: number
    minSpeed: number
    maxRadius: number
    minRadius: number,
    checkCollisionsWith: Positionable[],
    onAsteroidCollision: () => void,
    onAsteroidDespawn: () => void
}

export function spawnAsteroidInWorld(spawner: AsteroidSpawner, world: World, id: string, maxDistance: number, isPaused: () => boolean) {
    const asteroid: Asteroid = {
        id: `asteroid-${id}`,
        boundingRadius: (Math.random() * (spawner.maxRadius - spawner.minRadius)) + spawner.minRadius,
        position: {
            x: spawner.position.x,
            y: spawner.position.y
        },
        rotation: deg2rad(Math.random() * 360),
        speed: (Math.random() * (spawner.maxSpeed - spawner.minSpeed)) + spawner.minSpeed,
        zIndex: 2,
        update: deltaTime => {
            if (isPaused()) return
            updateAsteroid(asteroid, deltaTime, isPaused())

            for (const positionable of spawner.checkCollisionsWith)
                if (asteroid.isCollidingWith(positionable.position)) spawner.onAsteroidCollision()


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
