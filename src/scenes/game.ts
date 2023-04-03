import GameTimer, { renderGameTimer } from '../actors/game-timer'
import { addRendering } from '../engine/render-loop'
import { renderShip, Ship, updateShip } from '../actors/ship'
import { addUpdatable } from '../engine/update-loop'
import { getMousePosition, mouseClickCommand } from '../engine/inputs'
import { AsteroidSpawner, spawnAsteroidInWorld } from '../actors/asteroid-spawner'
import Command, { addCommandAction, executeCommand, registerCommand } from '../engine/command'
import World, { renderWorld, updateWorld } from '../engine/scene/world'
import Camera, { renderCamera, screenToCameraPosition, screenToWorldPosition, updateCamera } from '../actors/camera'
import { origin, subtractPositions } from '../engine/scene/positionable'
import DebugMenu from '../actors/debug-menu'
import Checkbox, { isPointInCheckBox, renderCheckBox } from '../actors/checkbox'
import Renderable from '../engine/scene/renderable'

export function startGame(canvasWidth: number, canvasHeight: number) {

    const worldWidth = 500
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

    const ship: Ship = {
        id: 'ship',
        position: origin(),
        targetPosition: origin(),
        rotation: 90,
        width: 10,
        length: 15,
        zIndex: 1,
        isPaused: () => isPaused,
        render: context => {
            context.fillStyle = 'orange'
            renderShip(ship, context)
        },
        update: deltaTime => {
            if (isPaused) return
            
            // ship.targetPosition.x += (1 / deltaTime)
            // if (ship.targetPosition.x > worldWidth / 2) ship.targetPosition.x = -worldWidth / 2

            ship.targetPosition = screenToCameraPosition(camera, getMousePosition())

            updateShip(ship)
        }
    }

    const players: Ship[] = [ship]

    let nextAsteroidId = 0
    let numAsteroids = 0
    let lastAsteroidSpawnTime = 0

    const asteroidSpawner: AsteroidSpawner & Renderable = {
        id: 'asteroid-spawner',
        maxSpeed: 8,
        minSpeed: 5,
        maxRadius: 10,
        minRadius: 5,
        checkCollisionsWith: players,
        position: origin(),
        zIndex: -2,
        isPaused: () => isPaused,
        onAsteroidCollision: endGame,
        onAsteroidDespawn: () => numAsteroids--,
        render: context => {
            context.save()
            context.beginPath()
            context.arc(0, 0, 25, 0, Math.PI * 2)
            context.fillStyle = '#c75d24'
            context.fill()
            context.restore()
        },
        update: () => {
            if (isPaused) return

            if (performance.now() - lastAsteroidSpawnTime < 200) return
            if (numAsteroids > 10) return

            spawnAsteroidInWorld(asteroidSpawner, world, `${nextAsteroidId++}`, 1500)
            numAsteroids++
            lastAsteroidSpawnTime = performance.now()
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
        actors: [ship, asteroidSpawner]
    }

    const camera: Camera = {
        id: 'camera',
        fov: 1,
        screenX: 0,
        screenY: 0,
        resolutionX: canvasWidth,
        resolutionY: canvasHeight,
        position: origin(),
        world: world,
        zIndex: 1000,
        render: context => renderCamera(camera, drawCameraRange, context),
        update: deltaTime => {
            //camera.position = screenToCameraPosition(camera, getMousePosition())
            updateCamera(camera, deltaTime)
        }
    }

    addUpdatable(camera)
    addRendering(camera)

    const camera2: Camera = {
        id: 'camera-2',
        fov: 1,
        screenX: canvasWidth / 2,
        screenY: canvasHeight / 2,
        resolutionX: canvasWidth / 2,
        resolutionY: canvasHeight / 2,
        position: origin(),
        world: world,
        zIndex: 1001,
        render: context => {
            context.save()
            context.resetTransform()
            context.fillStyle = 'rgb(157, 168, 165, .7)'
            context.fillRect(camera2.screenX, camera2.screenY, camera2.resolutionX, camera2.resolutionY)
            context.restore()
            renderCamera(camera2, drawCameraRange, context)
        },
        update: deltaTime => {
            if (isPaused) return
            camera2.position = screenToWorldPosition(camera, getMousePosition())
            updateCamera(camera2, deltaTime)
        }
    }

    addUpdatable(camera2)
    addRendering(camera2)

    //setCursorRenderer(() => undefined)

    //#endregion

    dispatchEvent(new Event('game-start'))
}