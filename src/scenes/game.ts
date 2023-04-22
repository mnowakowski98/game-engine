import GameTimer, { renderGameTimer } from '../hud/game-timer'
import { addRendering } from '../engine/render-loop'
import { renderShip, Ship, moveShip } from '../actors/ship'
import { addUpdatable } from '../engine/update-loop'
import { getMousePosition, mouseClickCommand } from '../engine/inputs'
import { AsteroidSpawner, renderSpawner, updateSpawner } from '../actors/asteroid-spawner'
import Command, { addCommandAction, executeCommand, registerCommand } from '../engine/command'
import World, { renderWorld, updateWorld } from '../engine/scene/world'
import Camera, { isOutSideCameraBounds, renderCamera, screenToWorldPosition } from '../engine/scene/camera'
import Positionable, { origin, Position, subtractPositions } from '../engine/scene/positionable'
import DebugMenu from '../hud/debug-menu'
import Checkbox, { isPointInCheckBox, renderCheckBox } from '../hud/checkbox'
import Renderable from '../engine/scene/renderable'
import Updatable from '../engine/scene/updatable'
import { deg2rad, movementDistance, randomBetween } from '../math-utils'
import Syncable from '../engine/scene/syncable'
import { addSyncable, connect } from '../engine/network'
import Unique from '../engine/scene/unique'

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

    //#region Background

    type Star = Renderable & Updatable & {
        timeSinceBlink: number
        radius: number
    }

    const starMaxRadius = 1
    const starMinRadius = .2

    const stars: Star[] = []
    for (let i = 0; i < 100; i++) {
        const star: Star = {
            id: `star-${i}`,
            position: {
                x: randomBetween(0, canvasWidth),
                y: randomBetween(0, canvasHeight)
            },
            rotation: 0,
            timeSinceBlink: 0,
            radius: randomBetween(starMinRadius, starMaxRadius),
            update: deltaTime => {
                star.timeSinceBlink += deltaTime

                if (star.timeSinceBlink > 200) {
                    star.radius = randomBetween(starMinRadius, starMaxRadius)
                    star.timeSinceBlink = 0
                }

                if (isPaused) return

                star.position.x -= movementDistance(2, deltaTime)
                if (star.position.x < 0) star.position.x = canvasWidth

            },
            render: context => {
                context.beginPath()
                context.arc(star.position.x, star.position.y, star.radius, 0, Math.PI * 2)
                context.fill()
            }
        }

        stars.push(star)

        addUpdatable(star)
    }

    const background: Renderable = {
        id: 'game-background',
        position: origin(),
        rotation: 0,
        zIndex: -9999,
        render: context => {
            context.fillStyle = '#181e29'
            context.fillRect(0, 0, canvasWidth, canvasHeight)

            context.fillStyle = 'white'
            for (const star of stars) star.render(context)
        }
    }

    addRendering(background)

    //#endregion

    //#region HUD

    const timer: GameTimer = {
        id: 'game-timer',
        time: 0,
        position: {
            x: 10,
            y: 10
        },
        rotation: 0,
        zIndex: 50,
        isPaused: () => isPaused,
        update: deltaTime => {
            if (!isPaused) timer.time += deltaTime
        },
        render: context => renderGameTimer(timer, context)
    }

    addUpdatable(timer)
    addRendering(timer)

    //#endregion

    //#region Debug menu

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
        rotation: 0,
        render: context => renderCheckBox(shouldDrawCameraRangeCheckBox, drawCameraRange, context),
        onUpdate: () => drawCameraRange = !drawCameraRange
    }

    let logRenderingDebugInfo = false
    const logRenderingDebugInfoCheckBox: Checkbox = {
        id: 'debug-menu-should-log-rendering-debug-info',
        width: 10,
        height: 10,
        text: 'Log camera debug info',
        position: {
            x: 10,
            y: 25
        },
        rotation: 0,
        render: context => renderCheckBox(logRenderingDebugInfoCheckBox, logRenderingDebugInfo, context),
        onUpdate: () => logRenderingDebugInfo = !logRenderingDebugInfo
    }

    let drawSpawnerPositions = false
    const drawSpawnerPositionsCheckBox: Checkbox = {
        id: 'debug-menu-should-draw-spawner-positions',
        width: 10,
        height: 10,
        text: 'Draw spawner positions',
        position: {
            x: 10,
            y: 40
        },
        rotation: 0,
        render: context => renderCheckBox(drawSpawnerPositionsCheckBox, drawSpawnerPositions, context),
        onUpdate: () => drawSpawnerPositions = !drawSpawnerPositions
    }

    addCommandAction(mouseClickCommand, () => {
        if (!showDebugMenu) return

        if (isPointInCheckBox(shouldDrawCameraRangeCheckBox, subtractPositions(getMousePosition(), debugMenu.position)))
            shouldDrawCameraRangeCheckBox.onUpdate()

        if (isPointInCheckBox(logRenderingDebugInfoCheckBox, subtractPositions(getMousePosition(), debugMenu.position)))
            logRenderingDebugInfoCheckBox.onUpdate()

        if (isPointInCheckBox(drawSpawnerPositionsCheckBox, subtractPositions(getMousePosition(), debugMenu.position)))
            drawSpawnerPositionsCheckBox.onUpdate()
    })

    const debugMenu: DebugMenu = {
        id: 'debug-menu',
        width: 200,
        height: 400,
        position: {
            x: canvasWidth - 250,
            y: 50
        },
        rotation: 0,
        controls: [
            shouldDrawCameraRangeCheckBox,
            logRenderingDebugInfoCheckBox,
            drawSpawnerPositionsCheckBox
        ],
        zIndex: 1001,
        render: context => {
            if (!showDebugMenu) return

            context.save()

            context.fillStyle = 'rgb(14, 188, 194, .5)'
            context.fillRect(0, 0, debugMenu.width, debugMenu.height)
            context.strokeRect(0, 0, debugMenu.width, debugMenu.height)

            context.restore()

            for (const control of debugMenu.controls) {
                const { x, y } = control.position

                context.save()
                context.translate(x, y)
                context.strokeStyle = 'white'
                context.fillStyle ='white'
                control.render(context)
                context.restore()
            }
        }
    }

    addRendering(debugMenu)

    //#endregion

    //#region Actors

    type HealthyShip = Ship & {
        health: number
        shield: number
        shieldRechargeTime: number
        lastHitTime: number
    }

    const previousShipPositions: Position[] = []
    const ship: HealthyShip & Syncable = {
        id: 'ship',
        position: {
            x: -worldWidth / 3,
            y: 0
        },
        targetPosition: origin(),
        rotation: 0,
        width: 8,
        length: 15,
        speed: 5,
        zIndex: 1,
        health: 4,
        shield: 4,
        shieldRechargeTime: 0,
        lastHitTime: 0,
        isPaused: () => isPaused,
        render: context => {
            // Shield
            context.strokeStyle = '#a8d9e3'
            context.lineWidth = 3
            if (ship.shield <= 3) context.strokeStyle = '#6fc2e8'
            if (ship.shield <= 2) context.strokeStyle = '#2389b8'
            if (ship.shield <= 1) context.strokeStyle = '#183ead'
            if (ship.shield <= 0) context.strokeStyle = 'rgb(0, 0, 0, 0)'

            // Health
            context.fillStyle = '#00ff00'
            if (ship.health <= 3) context.fillStyle = '#00aa00'
            if (ship.health <= 2) context.fillStyle = 'orange'
            if (ship.health <= 1) context.fillStyle = 'red'
            
            renderShip(ship, context)
            //drawMovementData(ship, context)

            // context.strokeStyle = 'wheat'
            // context.rotate(-ship.rotation)
            // context.translate(-ship.position.x, -ship.position.y)
            // context.beginPath()
            // for (const _ of previousShipPositions)
            //     context.lineTo(_.x, _.y)
            // context.stroke()
        },
        update: deltaTime => {
            if (isPaused) return

            // previousShipPositions.unshift(ship.position)
            // if (previousShipPositions.length > 1000) previousShipPositions.pop()

            ship.shieldRechargeTime += deltaTime
            if (ship.shieldRechargeTime > 5000 && ship.shield < 4) {
                ship.shield += 1
                ship.shieldRechargeTime = 0
            }
            
            if (isOutSideCameraBounds(camera, ship.position)) ship.position = origin()
            ship.targetPosition = screenToWorldPosition(camera, getMousePosition())
            moveShip(ship, deltaTime)
        },
        getSyncData: () => ({
            id: networkShip.id,
            x: ship.position.x,
            y: ship.position.y
        })
    }

    const networkShip: Ship & Syncable = {
        id: 'network-ship',
        position: origin(),
        targetPosition: origin(),
        rotation: 90,
        width: 10,
        length: 10,
        speed: 2,
        zIndex: 0,
        isPaused: () => isPaused,
        render: context => {
            context.strokeStyle = 'white'
            context.fillStyle = '#357515'
            renderShip(networkShip, context)
        },
        update: () => undefined,
        sync: (updateData: Position & Unique) => {
            if (updateData.x == null || updateData.y == null) {
                console.warn(`Attempted to sync ship without position data`)
                return
            }

            networkShip.position = {
                x: updateData.x,
                y: updateData.y
            }
        }
    }

    addSyncable(ship)
    addSyncable(networkShip)

    const players: Ship[] = [ship]

    const onAsteroidCollision = (target: Positionable) => {
        const targetAsShip = target as HealthyShip
        if (performance.now() - targetAsShip.lastHitTime < 200) return

        if (targetAsShip.shield <= 0) {
            targetAsShip.health--
            if (targetAsShip.health <= 0) endGame()
        }
        else {
            targetAsShip.shield--
            targetAsShip.shieldRechargeTime = 0
        }

        targetAsShip.lastHitTime = performance.now()
    }

    const renderSpawnerPosition = (context: CanvasRenderingContext2D) => {
        if (!drawSpawnerPositions) return
        renderSpawner(context)
    }

    const centerSpawner: AsteroidSpawner = {
        id: 'asteroid-spawner-center',
        maxSpeed: 8,
        minSpeed: 5,
        maxRadius: 10,
        minRadius: 5,
        minAngle: 0,
        maxAngle: 360,
        maxSpawns: 25,
        minTimeBetweenSpawns: 200,
        nextAsteroidId: 0,
        numAsteroids: 0,
        timeSinceLastSpawn: 0,
        maxTravelDistance: 2000,
        checkCollisionsWith: players,
        position: origin(),
        rotation: 0,
        zIndex: -2,
        isPaused: () => isPaused,
        onAsteroidCollision: onAsteroidCollision,
        render: renderSpawnerPosition,
        update: deltaTime => updateSpawner(centerSpawner, world, deltaTime)
    }

    //#endregion

    //#region World

    const world: World = {
        id: 'game-world',
        width: worldWidth,
        height: worldHeight,
        render: context => renderWorld(world, context),
        update: deltaTime => updateWorld(world, deltaTime),
        shouldLog: () => logRenderingDebugInfo,
        position: origin(),
        rotation: 0,
        actors: [
            ship,
            networkShip,
            centerSpawner
        ]
    }

    addUpdatable(world)

    //#endregion

    //#region Cameras

    const camera: Camera = {
        id: 'camera',
        fov: 1,
        screenX: 0,
        screenY: 0,
        resolutionX: canvasWidth,
        resolutionY: canvasHeight,
        position: origin(),
        rotation: 0,
        zIndex: 1000,
        render: context => renderCamera(camera, world, drawCameraRange, context),
        shouldLog: () => logRenderingDebugInfo
    }

    addRendering(camera)

    const camera2: Camera & Updatable = {
        id: 'camera-2',
        fov: 1,
        screenX: canvasWidth - (canvasWidth / 3),
        screenY: canvasHeight - (canvasHeight / 3),
        resolutionX: canvasWidth / 4,
        resolutionY: canvasHeight / 4,
        position: origin(),
        rotation: deg2rad(45),
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
        },
        shouldLog: () => false
    }

    addUpdatable(camera2)
    addRendering(camera2)

    //#endregion

    dispatchEvent(new Event('game-start'))

    connect('ws://localhost:3000')
}