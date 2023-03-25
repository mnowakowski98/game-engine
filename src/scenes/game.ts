import GameTimer, { renderGameTimer } from '../actors/game-timer'
import { addRendering } from '../engine/render-loop'
import { renderShip, Ship, updateShip } from '../actors/ship'
import { addUpdatable } from '../engine/update-loop'
import { getMousePosition, mouseClickCommand } from '../engine/inputs'
import { AsteroidSpawner, spawnAsteroidInWorld } from '../actors/asteroid-spawner'
import Command, { addCommandAction, registerCommand } from '../engine/command'
import World, { defaultWorldPosition, renderWorld, updateWorld } from '../engine/scene/world'
import Camera, { renderCamera, updateCamera } from '../actors/camera'
import { addPositions, subtractPositions } from '../engine/scene/positionable'
import { movementDistance } from '../math-utils'
import DebugMenu from '../actors/debug-menu'
import Checkbox, { isPointInCheckBox, renderCheckBox } from '../actors/checkbox'

export function startGame(canvasWidth: number, canvasHeight: number) {

    const worldWidth = canvasWidth - 150
    const worldHeight = canvasHeight - 75

    //#region Commands

    let isPaused = false

    const pauseCommand: Command = {
        id: 'game-pause',
        actions: [() => isPaused = !isPaused]
    }

    registerCommand(pauseCommand)

    let showDebugMenu = false

    registerCommand({
        id: 'game-show-debug-menu',
        actions: [() => showDebugMenu = !showDebugMenu]
    })

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
        zIndex: 50,
        update: deltaTime => {
            if (!isPaused) timer.time += deltaTime
        },
        render: context => renderGameTimer(timer, context)
    }

    addUpdatable(timer)
    addRendering(timer)

    let drawCameraRange = false
    const shouldDrawCameraRangeCheckBox: Checkbox = {
        id: 'debug-menu-should-draw-camera-range',
        width: 10,
        height: 10,
        text: 'Draw camera range',
        position: {
            x: 10,
            y: 10
        },
        render: context => renderCheckBox(shouldDrawCameraRangeCheckBox, drawCameraRange, context),
        onUpdate: () => drawCameraRange = !drawCameraRange

    }

    addCommandAction(mouseClickCommand, () => {
        if (!showDebugMenu) return
        
        if (isPointInCheckBox(shouldDrawCameraRangeCheckBox, subtractPositions(getMousePosition(), debugMenu.position)))
            shouldDrawCameraRangeCheckBox.onUpdate()
    })

    const debugMenu: DebugMenu = {
        id: 'debug-menu',
        width: 200,
        height: 400,
        position: {
            x: canvasWidth - 250,
            y: 50
        },
        controls: [shouldDrawCameraRangeCheckBox],
        zIndex: 100,
        render: context => {
            if (!showDebugMenu) return

            context.save()

            context.fillStyle = 'rgb(14, 188, 194, .2)'
            context.fillRect(0, 0, debugMenu.width, debugMenu.height)
            context.strokeRect(0, 0, debugMenu.width, debugMenu.height)

            context.restore()

            for (const control of debugMenu.controls) {
                const { x, y } = control.position

                context.save()
                context.translate(x, y)
                control.render(context)
                context.restore()
            }

        },
        onShouldDrawCameraRangeChange: shouldDrawCameraRange => undefined
    }

    addRendering(debugMenu)

    //#endregion

    //#region Actors

    const ship: Ship = {
        id: 'ship',
        position: defaultWorldPosition(),
        targetPosition: defaultWorldPosition(),
        rotation: 90,
        width: 10,
        length: 15,
        zIndex: 1,
        render: context => {
            context.fillStyle = 'orange'
            renderShip(ship, context)
        },
        update: () => {
            if (isPaused) return
            ship.targetPosition = addPositions(camera.position, getMousePosition())
            updateShip(ship)
        }
    }

    const ship2: Ship = {
        id: 'ship2',
        position: defaultWorldPosition(),
        targetPosition: {
            x: worldWidth,
            y: worldHeight
        },
        width: 15,
        length: 15,
        rotation: 135,
        zIndex: 1,
        render: context => renderShip(ship2, context),
        update: deltaTime => {
            if (isPaused) return
            if (ship2.position.x < ship2.targetPosition.x) ship2.position.x += movementDistance(1, deltaTime)
            if (ship2.position.y < ship2.targetPosition.y) ship2.position.y += movementDistance(1, deltaTime)
        }
    }

    const players = [ship, ship2]

    let nextAsteroidId = 0
    let numAsteroids = 0
    let lastAsteroidSpawnTime = 0
    let timeSinceLastSpawn = 0

    const asteroidSpawner: AsteroidSpawner = {
        id: 'asteroid-spawner',
        maxSpeed: 5,
        minSpeed: 2,
        maxRadius: 10,
        minRadius: 5,
        checkCollisionsWith: players,
        position: {
            x: worldWidth / 4,
            y: worldHeight / 2
        },
        onAsteroidCollision: endGame,
        onAsteroidDespawn: () => numAsteroids--,
        update: deltaTime => {
            if (isPaused) return

            timeSinceLastSpawn += deltaTime
            if (timeSinceLastSpawn - lastAsteroidSpawnTime < 750) return
            if (numAsteroids > 10) return

            spawnAsteroidInWorld(asteroidSpawner, world, `${nextAsteroidId++}`, 1500, () => isPaused)
            numAsteroids++
            lastAsteroidSpawnTime = performance.now()
            timeSinceLastSpawn = 0
        }
    }

    let nextAsteroidId2 = 0
    let numAsteroids2 = 0
    let lastAsteroidSpawnTime2 = 0
    let timeSinceLastSpawn2 = 0

    const asteroidSpawner2: AsteroidSpawner = {
        id: 'asteroid-spawner2',
        maxSpeed: 15,
        minSpeed: 10,
        maxRadius: 10,
        minRadius: 5,
        checkCollisionsWith: players,
        position: {
            x: worldWidth - (worldWidth / 4),
            y: worldHeight / 3
        },
        onAsteroidCollision: endGame,
        onAsteroidDespawn: () => numAsteroids2--,
        update: deltaTime => {
            if (isPaused) return

            timeSinceLastSpawn2 += deltaTime
            if (timeSinceLastSpawn2 - lastAsteroidSpawnTime2 < 200) return
            if (numAsteroids2 > 5) return

            spawnAsteroidInWorld(asteroidSpawner2, world, `${nextAsteroidId2++}`, 1500, () => isPaused)
            numAsteroids++
            lastAsteroidSpawnTime = performance.now()
            timeSinceLastSpawn2 = 0
        }
    }

    //#endregion

    //#region World

    const world: World = {
        id: 'game-world',
        width: worldWidth,
        height: worldHeight,
        render: context => renderWorld(world, camera.position, context),
        update: deltaTime => updateWorld(world, deltaTime),
        position: defaultWorldPosition(),
        actors: [
            {
                id: ship.id,
                updater: ship,
                rendering: ship
            },
            {
                id: ship2.id,
                updater: ship2,
                rendering: ship2
            },
            {
                id: asteroidSpawner.id,
                updater: asteroidSpawner
            },
            {
                id: asteroidSpawner2.id,
                updater: asteroidSpawner2
            }
        ]
    }

    const camera: Camera = {
        id: 'camera',
        fov: 1,
        position: {
            x: worldWidth / 2 - canvasWidth / 2,
            y: worldHeight / 2 - canvasHeight / 2
        },
        world: world,
        zIndex: -1000,
        render: context => renderCamera(camera, drawCameraRange, context),
        update: deltaTime => updateCamera(camera, deltaTime)
    }

    addUpdatable(camera)
    addRendering(camera)

    //#endregion

    dispatchEvent(new Event('game-start'))
}