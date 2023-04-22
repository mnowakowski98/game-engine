import Updatable from '../engine/scene/updatable'
import Renderable from '../engine/scene/renderable'
import { Position, addPositions, dividePositions, subtractPositions } from '../engine/scene/positionable'
import { deg2rad, linearDistance, movementDistance, pi2, rad2deg } from '../math-utils'
import Pausable from '../engine/scene/pausable'

export interface Ship extends Updatable, Renderable, Pausable {
    width: number
    length: number
    speed: number
    targetPosition: Position
}

const getTargetRotationFromDistance = (distance: Position): number => {
    const { x: A, y: O } = distance
    let rotation = Math.atan(O / A)

    // Detect quadrant and correct rotation
    // I have no idea why these are offset and trying to figure out trig hurts
    if (A <= 0 && O <= 0) rotation -= deg2rad(90)
    if (A >= 0 && O <= 0) rotation += deg2rad(90)
    if (A >= 0 && O >= 0) rotation += deg2rad(90)
    if (A <= 0 && O >= 0) rotation -= deg2rad(90)

    // Corrections for 0 cases
    if (A == 0) rotation += deg2rad(90)
    if (O == 0) rotation -= deg2rad(90)
    if (O == 0 && A <= 0) rotation += deg2rad(180)

    return rotation
}

export function moveShip(ship: Ship, deltaTime2: number) {
    if (ship.isPaused()) return
    const deltaTime = 40

    const targetDistance = subtractPositions(ship.targetPosition, ship.position)
    if (Math.abs(targetDistance.x) < 5 && Math.abs(targetDistance.y) < 5) return

    const rotation = getTargetRotationFromDistance(targetDistance)
    if (!Number.isNaN(rotation)) ship.rotation = rotation

    const distance = movementDistance(ship.speed, deltaTime)
    const distanceX = Math.sin(ship.rotation) * distance
    const distanceY = Math.cos(ship.rotation) * distance
    // ship.position = addPositions(ship.position, {
    //     x: distanceX,
    //     y: -distanceY
    // })
}

export function drawMovementData(ship: Ship, context: CanvasRenderingContext2D) {
    context.save()
    context.rotate(-ship.rotation)

    // Draw path to target (currently not the real path)
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

    // Draw rotation text
    const textX = -(ship.width + ship.width * 2)
    const textY = -(ship.length + ship.length / 2)

    context.fillStyle = 'rgb(0, 0, 0, .75'
    context.fillRect(textX - 3, textY - 10, 35, 13)

    context.fillStyle = '#00ff04'
    context.strokeStyle = '#00ff04'
    context.beginPath()
    context.fillText(`${rad2deg(ship.rotation).toFixed(2)}`, textX, textY)

    // Draw rotation arc
    context.rotate(deg2rad(-90))
    context.beginPath()
    context.moveTo(0, 0)
    context.arc(0, 0, ship.length + 5, 0, ship.rotation, ship.rotation < 0)
    context.closePath()
    context.stroke()

    context.restore()
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