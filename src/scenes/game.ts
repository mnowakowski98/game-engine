import GameTimer, { renderGameTimer } from '../actors/game-timer'
import { addRendering } from '../engine/render-loop'
import { renderShip, Ship, updateShip } from '../actors/ship'
import { addUpdatable } from '../engine/update-loop'
import { getMousePosition, mouseClickCommand } from '../engine/inputs'
import { AsteroidSpawner, spawnAsteroidInWorld } from '../actors/asteroid-spawner'
import Command, { addCommandAction, registerCommand } from '../engine/command'
import World, { defaultWorldPosition, renderWorld, updateWorld } from '../engine/scene/world'
import Camera, { renderCamera, updateCamera } from '../actors/camera'
import { subtractPositions } from '../engine/scene/positionable'
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
        position: defaultWorldPosition(),
        targetPosition: defaultWorldPosition(),
        rotation: 90,
        width: 10,
        length: 15,
        zIndex: 1,
        isPaused: () => isPaused,
        render: context => {
            context.fillStyle = 'orange'
            renderShip(ship, context)
        },
        update: () => {
            if (isPaused) return
            ship.targetPosition = camera.position
            updateShip(ship)
        }
    }

    const ship2: Ship = {
        id: 'ship2',
        position: defaultWorldPosition(),
        targetPosition: {
            x: -250,
            y: -250
        },
        width: 15,
        length: 15,
        rotation: 90,
        zIndex: 1,
        isPaused: () => isPaused,
        render: context => renderShip(ship2, context),
        update: () => {
            if (isPaused) return
            //ship2.targetPosition = camera2.position
            updateShip(ship2)
        }
    }

    const players: Ship[] = []

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
        position: defaultWorldPosition(),
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
        update: deltaTime => {
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
        position: defaultWorldPosition(),
        actors: [ship, ship2, asteroidSpawner]
    }

    const camera: Camera = {
        id: 'camera',
        fov: 1,
        screenX: 0,
        screenY: 0,
        resolutionX: canvasWidth / 2,
        resoltuionY: canvasHeight / 2,
        position: defaultWorldPosition(),
        world: world,
        zIndex: 1000,
        render: context => renderCamera(camera, drawCameraRange, context),
        update: deltaTime => {
            // camera.position = addPositions({
            //     x: camera.screenX - camera.resolutionX,
            //     y: camera.screenY - camera.resoltuionY
            // }, getMousePosition())

            updateCamera(camera, deltaTime)
        }
    }

    const camera2: Camera = {
        id: 'camera2',
        fov: 1,
        screenX: canvasWidth / 2 + 100,
        screenY: 200,
        resolutionX: 500,
        resoltuionY: 500,
        position: {
            x: -250,
            y: -250
        },
        world: world,
        zIndex: 1000,
        render: context => renderCamera(camera2, drawCameraRange, context),
        update: deltaTime => updateCamera(camera2, deltaTime)
    }

    addUpdatable(camera)
    addRendering(camera)

    addUpdatable(camera2)
    addRendering(camera2)

    //#endregion

    dispatchEvent(new Event('game-start'))
}