import Updatable from '../engine/scene/updatable'
import Renderable from '../engine/scene/renderable'
import { Position, addPositions } from '../engine/scene/positionable'
import Rotatable from '../engine/scene/rotatable'
import { linearDistance, movementDistance } from '../math-utils'
import Pausable from '../engine/scene/pausable'
import { positionDistance } from '../math-utils'

export interface Ship extends Updatable, Renderable, Rotatable, Pausable {
    width: number
    length: number
    speed: number
    targetPosition: Position
}

export function moveShip(ship: Ship, deltaTime: number) {
    if (ship.isPaused()) return

    const distance = movementDistance(ship.speed, deltaTime)

    const H = positionDistance(ship.position, ship.targetPosition)
    // const O = linearDistance(ship.position.y, ship.targetPosition.y)
    const O = ship.targetPosition.y - ship.position.y
    const rotation = Math.asin(O/ H)
    if (rotation) ship.rotation = rotation

    const distanceX = Math.sin(ship.rotation) * distance
    const distanceY = Math.cos(ship.rotation) * distance
    ship.position = addPositions(ship.position, {
        x: distanceX,
        y: -distanceY
    })
}

export function renderShip(ship: Ship, context: CanvasRenderingContext2D): void {
    context.rotate(ship.rotation)

    context.beginPath()

    const halfWidth = ship.width / 2
    const halfLength = ship.length / 2

    context.moveTo(-halfWidth, halfLength)
    context.lineTo(halfWidth, halfLength)
    context.lineTo(0, -halfLength)

    context.closePath()

    context.fill()
    context.stroke()
}