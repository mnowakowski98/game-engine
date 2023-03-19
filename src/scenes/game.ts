import GameTimer, { renderGameTimer } from '../actors/game-timer'
import { addRendering, getContextDataString } from '../engine/render-loop'
import { renderShip, Ship, updateShip } from '../actors/ship'
import { addUpdatable } from '../engine/update-loop'
import { getMousePosition } from '../engine/inputs'
import { AsteroidSpawner, spawnAsteroid } from '../actors/asteroid-spawner'
import { movementDistance } from '../math-utils'
import Command, { registerCommand } from '../engine/command'
import World, { defaultWorldPosition, renderWorld } from '../engine/world'
import Camera, { renderCamera } from '../actors/camera'

export function startGame(canvasWidth: number, canvasHeight: number) {

    //#region Commands

    let isPaused = false

    const pauseCommand: Command = {
        id: 'game-pause',
        actions: [() => isPaused = !isPaused]
    }

    registerCommand(pauseCommand)

    const endGame = () => {
        dispatchEvent(new Event('game-end'))
    }

    //#endregion

    //#region HUD

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
    
    // addUpdatable(timer)
    // addRendering(timer)

    //#endregion

    //#region World

    const worldWidth = 3000
    const worldHeight = 3000

    const world: World = {
        id: 'game-world',
        width: worldWidth,
        height: worldHeight,
        render: context => renderWorld(world, camera.position, context),
        update: deltaTime => undefined,
        position: defaultWorldPosition,
        meshes: [{
            id: 'mesh-center',
            position: {
                x: worldWidth / 2,
                y: worldHeight / 2
            },
            render: context => {
                console.log(`Rendering mesh-center ${getContextDataString(context)}`)

                context.beginPath()
                context.arc(0, 0, 15, 0, Math.PI * 2)
                context.closePath()
                context.fillStyle = 'red'
                context.fill()
            }
        }],
        actors: []
    }

    addUpdatable(world)

    const camera: Camera = {
        id: 'camera',
        fov: 1,
        position: {
            x: worldWidth / 2 - canvasWidth / 2,
            y: worldHeight / 2 - canvasHeight / 2
        },
        world: world,
        render: context => renderCamera(camera, context),
        update: deltaTime => undefined
    }

    addRendering(camera)

    //#endregion

    //#region Actors

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

    const ship2: Ship = {
        id: 'ship2',
        position: {
            x: canvasWidth - 50,
            y: canvasHeight / 2
        },
        targetPosition: {
            x: 50,
            y: canvasHeight / 2
        },
        width: 25,
        length: 50,
        rotation: -90,
        render: context => renderShip(ship2, context),
        update: deltaTime => {
            if (isPaused) return
            if (ship2.position.x > ship2.targetPosition.x) ship2.position.x -= movementDistance(1, deltaTime)
        }
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
        checkCollisionsWith: [ship, ship2],
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

    addRendering(ship)
    addUpdatable(ship)

    addUpdatable(ship2)
    addRendering(ship2)

    //#endregion

    dispatchEvent(new Event('game-start'))
}