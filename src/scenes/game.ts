import GameTimer, { renderGameTimer } from '../actors/game-timer'
import { addRendering } from '../engine/render-loop'
import { renderShip, Ship, updateShip } from '../actors/ship'
import { addUpdatable } from '../engine/update-loop'
import { getMousePosition } from '../engine/inputs'
import { AsteroidSpawner, spawnAsteroid } from '../actors/asteroid-spawner'
import { movementDistance } from '../math-utils'
import Command, { registerCommand } from '../engine/command'
import World, { defaultWorldPosition, renderWorld } from '../engine/world'
import { Position } from '../engine/scene/positionable'
import Updatable from '../engine/scene/updatable'
import Camera from '../actors/camera'
import Renderable from '../engine/scene/renderable'

export function startGame(canvasWidth: number, canvasHeight: number) {
    let isPaused = false

    const timer: GameTimer = {
        id: 'game-timer',
        time: 0,
        position: {
            x: 10,
            y: 10
        },
        update: deltaTime => {
            if (!isPaused) timer.time += deltaTime
        },
        render: context => renderGameTimer(timer, context)
    }
    addUpdatable(timer)
    addRendering(timer)

    const camera: Camera = {
        id: 'camera',
        fov: 70,
        position: {
            x: 100,
            y: 100
        },
        update: deltaTime => undefined
    }

    addUpdatable(camera)

    const testMesh: Renderable = {
        id: 'test-ball',
        render: context => {
            context.beginPath()
            context.arc(0, 0, 10, 0, Math.PI * 2)
            context.closePath()
            context.fill()
        },
        position: {
            x: 10,
            y: 150
        }
    }

    const world: World = {
        id: 'game-world',
        width: 50,
        height: 50,
        render: context => renderWorld(world, context, camera),
        update: deltaTime => undefined,
        position: defaultWorldPosition,
        meshes: [testMesh],
        actors: []
    }

    addRendering(world)
    addUpdatable(world)

    const ship: Ship = {
        id: 'ship',
        position: {
            x: 50,
            y: canvasHeight / 2
        },
        targetPosition: {
            x: 50,
            y: canvasHeight / 2
        },
        rotation: 90,
        width: 5,
        length: 10,
        render: context => {
            renderShip(ship, context)
        },
        update: () => {
            if (isPaused) return
            ship.targetPosition = getMousePosition()
            updateShip(ship)
        }
    }

    // const ship2: Ship = {
    //     id: 'ship2',
    //     position: {
    //         x: canvasWidth - 50,
    //         y: canvasHeight / 2
    //     },
    //     targetPosition: {
    //         x: 50,
    //         y: canvasHeight / 2
    //     },
    //     width: 25,
    //     length: 50,
    //     rotation: -90,
    //     render: context => renderShip(ship2, context),
    //     update: deltaTime => {
    //         if (isPaused) return
    //         if (ship2.position.x > ship2.targetPosition.x) ship2.position.x -= movementDistance(1, deltaTime)
    //     }
    // }

    addRendering(ship)
    addUpdatable(ship)

    // addUpdatable(ship2)
    // addRendering(ship2)

    const pauseCommand: Command = {
        id: 'game-pause',
        actions: [() => isPaused = !isPaused]
    }

    registerCommand(pauseCommand)

    const endGame = () => {
        dispatchEvent(new Event('game-end'))
    }

    let nextAsteroidId = 0
    let numAsteroids = 0
    let lastAsteroidSpawnTime = 0

    const asteroidSpawner: AsteroidSpawner = {
        id: 'asteroid-spawner',
        maxSpeed: 15,
        minSpeed: 10,
        maxRadius: 10,
        minRadius: 5,
        checkCollisionsWith: [ship],
        // checkCollisionsWith: [ship, ship2],
        onAsteroidCollision: endGame,
        onAsteroidDespawn: () => numAsteroids--,
        update: () => {
            if (isPaused) return
            if (performance.now() - lastAsteroidSpawnTime < 750) return
            if (numAsteroids > 10) return

            spawnAsteroid(asteroidSpawner, `${nextAsteroidId++}`, canvasWidth, canvasHeight, () => isPaused)
            numAsteroids++
            lastAsteroidSpawnTime = performance.now()
        }
    }
    addUpdatable(asteroidSpawner)

    dispatchEvent(new Event('game-start'))
}