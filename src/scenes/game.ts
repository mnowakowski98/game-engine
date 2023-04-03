import GameTimer, { renderGameTimer } from '../actors/game-timer'
import { addRendering } from '../engine/render-loop'
import { renderShip, Ship, updateShip } from '../actors/ship'
import { addUpdatable } from '../engine/update-loop'
import { getMousePosition, mouseClickCommand } from '../engine/inputs'
import { AsteroidSpawner, spawnAsteroidInWorld } from '../actors/asteroid-spawner'
import Command, { addCommandAction, executeCommand, registerCommand } from '../engine/command'
import World, { renderWorld, updateWorld } from '../engine/scene/world'
import Camera, { renderCamera, screenToCameraPosition, screenToWorldPosition } from '../actors/camera'
import Positionable, { addPositions, origin, subtractPositions } from '../engine/scene/positionable'
import DebugMenu from '../actors/debug-menu'
import Checkbox, { isPointInCheckBox, renderCheckBox } from '../actors/checkbox'
import Renderable from '../engine/scene/renderable'
import Updatable from '../engine/scene/updatable'
import { movementDistance } from '../math-utils'

export function startGame(canvasWidth: number, canvasHeight: number) {

    const worldWidth = 3000
    const worldHeight = 500

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

    executeCommand('global-activate-shield-leds')
    executeCommand('global-activate-health-leds')

    executeCommand('global-set-shield-leds-full')
    executeCommand('global-set-health-leds-full')

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
        isPaused: () => isPaused,
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

    type HealthyShip = Ship & {
        health: number
        shield: number
    }

    const ship: HealthyShip = {
        id: 'ship',
        position: origin(),
        targetPosition: origin(),
        rotation: 90,
        width: 10,
        length: 15,
        zIndex: 1,
        health: 4,
        shield: 4,
        isPaused: () => isPaused,
        render: context => {
            context.fillStyle = '#0000ff'

            if (ship.shield <= 3) context.fillStyle = '0000aa'
            if (ship.shield <= 2) context.fillStyle = '000055'
            if (ship.shield <= 1) context.fillStyle = '000011'

            if (ship.shield <= 0) {
                context.fillStyle = '#00ff00'
                if (ship.health <= 3) context.fillStyle = '#00aa00'
                if (ship.health <= 2) context.fillStyle = 'orange'
                if (ship.health <= 1) context.fillStyle = 'red'
            }

            renderShip(ship, context)
        },
        update: () => {
            if (isPaused) return
            ship.targetPosition = camera.position
            ship.targetPosition = addPositions(ship.targetPosition, screenToCameraPosition(camera, getMousePosition()))
            updateShip(ship)
        }
    }

    const players: Ship[] = [ship]

    let lastPlayerHitTime = 0

    const onAsteroidCollision = (target: Positionable) => {
        if (performance.now() - lastPlayerHitTime < 500) return

        const targetAsShip = target as HealthyShip
        if (targetAsShip.shield <= 0) {
            targetAsShip.health--
            if (targetAsShip.health <= 0) endGame()
        }
        else targetAsShip.shield--

        lastPlayerHitTime = performance.now()
    }

    const renderSpawnerPosition = (context: CanvasRenderingContext2D) => {
        context.save()
        context.beginPath()
        context.arc(0, 0, 5, 0, Math.PI * 2)
        context.fillStyle = '#c75d24'
        context.fill()
        context.restore()
    }

    let nextAsteroidId = 0
    let numAsteroids = 0
    let lastAsteroidSpawnTime = 0

    const asteroidSpawner: AsteroidSpawner & Renderable = {
        id: 'asteroid-spawner',
        maxSpeed: 8,
        minSpeed: 5,
        maxRadius: 10,
        minRadius: 5,
        minAngle: 0,
        maxAngle: 360,
        checkCollisionsWith: players,
        position: origin(),
        zIndex: -2,
        isPaused: () => isPaused,
        onAsteroidCollision: onAsteroidCollision,
        onAsteroidDespawn: () => numAsteroids--,
        render: renderSpawnerPosition,
        update: () => {
            if (isPaused) return

            if (performance.now() - lastAsteroidSpawnTime < 200) return
            if (numAsteroids > 10) return

            spawnAsteroidInWorld(asteroidSpawner, world, `${nextAsteroidId++}`, 1500)
            numAsteroids++
            lastAsteroidSpawnTime = performance.now()
        }
    }

    let nextAsteroidId2 = 0
    let numAsteroids2 = 0
    let lastAsteroidSpawnTime2 = 0

    const asteroidSpawner2: AsteroidSpawner & Renderable = {
        id: 'asteroid-spawner2',
        maxSpeed: 8,
        minSpeed: 5,
        maxRadius: 10,
        minRadius: 5,
        minAngle: 70,
        maxAngle: 110,
        checkCollisionsWith: players,
        position: {
            x: -1450,
            y: 0
        },
        zIndex: -2,
        isPaused: () => isPaused,
        onAsteroidCollision: onAsteroidCollision,
        onAsteroidDespawn: () => numAsteroids2--,
        render: renderSpawnerPosition,
        update: () => {
            if (isPaused) return

            if (performance.now() - lastAsteroidSpawnTime2 < 200) return
            if (numAsteroids2 > 25) return

            spawnAsteroidInWorld(asteroidSpawner2, world, `${nextAsteroidId2++}`, 1500)
            numAsteroids2++
            lastAsteroidSpawnTime2 = performance.now()
        }
    }

    let nextAsteroidId3 = 0
    let numAsteroids3 = 0
    let lastAsteroidSpawnTime3 = 0

    const asteroidSpawner3: AsteroidSpawner & Renderable = {
        id: 'asteroid-spawner3',
        maxSpeed: 8,
        minSpeed: 5,
        maxRadius: 10,
        minRadius: 5,
        minAngle: -70,
        maxAngle: -110,
        checkCollisionsWith: players,
        position: {
            x: 1450,
            y: 0
        },
        zIndex: -2,
        isPaused: () => isPaused,
        onAsteroidCollision: onAsteroidCollision,
        onAsteroidDespawn: () => numAsteroids3--,
        render: renderSpawnerPosition,
        update: () => {
            if (isPaused) return

            if (performance.now() - lastAsteroidSpawnTime3 < 200) return
            if (numAsteroids3 > 25) return

            spawnAsteroidInWorld(asteroidSpawner3, world, `${nextAsteroidId3++}`, 1500)
            numAsteroids3++
            lastAsteroidSpawnTime3 = performance.now()
        }
    }

    //#endregion

    //#region World

    const world: World = {
        id: 'game-world',
        width: worldWidth,
        height: worldHeight,
        render: context => renderWorld(world, context),
        update: deltaTime => updateWorld(world, deltaTime),
        position: origin(),
        actors: [ship, asteroidSpawner, asteroidSpawner2, asteroidSpawner3]
    }

    addUpdatable(world)

    const camera: Camera & Updatable = {
        id: 'camera',
        fov: 1,
        screenX: 0,
        screenY: 0,
        resolutionX: canvasWidth,
        resolutionY: canvasHeight,
        position: {
            x: -1500,
            y: 0
        },
        zIndex: 1000,
        render: context => renderCamera(camera, world, drawCameraRange, context),
        update: deltaTime => {
            if (isPaused) return
            camera.position.x += movementDistance(5, deltaTime)
            if (camera.position.x > world.width / 2) camera.position.x *= -1
        }
    }

    addRendering(camera)
    addUpdatable(camera)

    const camera2: Camera & Updatable = {
        id: 'camera-2',
        fov: 1,
        screenX: canvasWidth - (canvasWidth / 3),
        screenY: canvasHeight - (canvasHeight / 3),
        resolutionX: canvasWidth / 4,
        resolutionY: canvasHeight / 4,
        position: origin(),
        zIndex: 1001,
        render: context => {
            context.save()
            context.resetTransform()
            context.fillStyle = 'rgb(157, 168, 165, .7)'
            context.fillRect(camera2.screenX, camera2.screenY, camera2.resolutionX, camera2.resolutionY)
            context.restore()
            renderCamera(camera2, world, drawCameraRange, context)
        },
        update: () => {
            if (isPaused) return
            camera2.position = screenToWorldPosition(camera, getMousePosition())
        }
    }

    addUpdatable(camera2)
    addRendering(camera2)

    //setCursorRenderer(() => undefined)

    //#endregion

    dispatchEvent(new Event('game-start'))
}