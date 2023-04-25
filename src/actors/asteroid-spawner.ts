import { deg2rad, positionDistance, randomBetween } from '../math-utils'
import Positionable from '../engine/scene/positionable'
import Updatable from '../engine/scene/updatable'
import { Asteroid, checkCollision, renderAsteroid, updateAsteroid } from './asteroid'
import World, { isOutsideWorldBounds } from '../engine/scene/world'
import Pausable from '../engine/scene/pausable'
import Renderable from '../engine/scene/renderable'

export interface AsteroidSpawner extends Updatable, Renderable, Pausable {
    maxSpeed: number
    minSpeed: number
    maxRadius: number
    minRadius: number
    minAngle: number
    maxAngle: number
    checkCollisionsWith: Positionable[]
    maxSpawns: number
    minTimeBetweenSpawns: number
    nextAsteroidId: number
    numAsteroids: number
    timeSinceLastSpawn: number
    maxTravelDistance: number
    onAsteroidCollision: (target: Positionable) => void
}

export function updateSpawner(spawner: AsteroidSpawner, world: World, deltaTime: number) {
    if (spawner.isPaused()) return

    spawner.timeSinceLastSpawn += deltaTime

    if (spawner.timeSinceLastSpawn < spawner.minTimeBetweenSpawns) return
    if (spawner.numAsteroids > spawner.maxSpawns) return

    spawnAsteroidInWorld(spawner, world, (spawner.nextAsteroidId).toString(), spawner.maxTravelDistance)
    spawner.numAsteroids++
    spawner.timeSinceLastSpawn = 0
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
                    asteroid.speed *= 1.75
                    spawner.onAsteroidCollision(target)
                }
            }

            const outsideWorldBounds = isOutsideWorldBounds(world, asteroid.position)
            const outsideMaxDistance = positionDistance(spawner.position, asteroid.position) > maxDistance
            if (outsideWorldBounds || outsideMaxDistance) {
                world.actors.splice(world.actors.findIndex(_ => asteroid.id === _.id), 1)
                spawner.numAsteroids--
            }
        },
        render: context => renderAsteroid(asteroid, context),
        isCollidingWith: position => checkCollision(asteroid, position)
    }

    world.actors.push(asteroid)
}
