import Updatable from '../engine/scene/updatable'
import Renderable from '../engine/scene/renderable'
import { Position, addPositions, subtractPositions } from '../engine/scene/positionable'
import { movementDistance, pi2, rotationToPosition } from '../math-utils'
import Pausable from '../engine/scene/pausable'
import { drawRotationData } from '../debug/renderable-data'

export interface Ship extends Updatable, Renderable, Pausable {
    width: number
    length: number
    speed: number
    targetPosition: Position
}

export function moveShip(ship: Ship, deltaTime: number) {
    if (ship.isPaused()) return

    const targetDistance = subtractPositions(ship.targetPosition, ship.position)
    if (Math.abs(targetDistance.x) <= 1 && Math.abs(targetDistance.y) <= 1) return

    ship.rotation = rotationToPosition(targetDistance)

    const distance = movementDistance(ship.speed, deltaTime)
    const distanceX = Math.sin(ship.rotation) * distance
    const distanceY = Math.cos(ship.rotation) * distance
    ship.position = addPositions(ship.position, {
        x: distanceX,
        y: -distanceY
    })
}

export function drawMovementData(ship: Ship, context: CanvasRenderingContext2D) {
    context.save()
    context.rotate(-ship.rotation)

    // Draw bezier path to target (currently not the real path)
    context.save()

    context.fillStyle = '#1a5cc7'
    context.strokeStyle = '#1a5cc7'

    const relativeTargetPosition = subtractPositions(ship.targetPosition, ship.position)

    const controlPointDistance = ship.speed * 50
    const controlPoint = {
        x: controlPointDistance * Math.sin(ship.rotation) + relativeTargetPosition.x / 2,
        y: -controlPointDistance * Math.cos(ship.rotation) + relativeTargetPosition.y / 2
    }

    context.beginPath()
    context.moveTo(0, 0)
    context.quadraticCurveTo(controlPoint.x, controlPoint.y, relativeTargetPosition.x, relativeTargetPosition.y)
    context.stroke()

    context.beginPath()
    context.arc(relativeTargetPosition.x, relativeTargetPosition.y, 5, 0, pi2)
    context.fill()

    context.beginPath()
    context.arc(controlPoint.x, controlPoint.y, 5, 0, pi2)
    context.fill()

    context.restore()

    drawRotationData(ship, context)
}

export function renderShip(ship: Ship, context: CanvasRenderingContext2D): void {
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