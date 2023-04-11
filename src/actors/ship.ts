import Updatable from '../engine/scene/updatable'
import Renderable from '../engine/scene/renderable'
import { Position } from '../engine/scene/positionable'
import Rotatable from '../engine/scene/rotatable'
import { deg2rad } from '../math-utils'
import Pausable from '../engine/scene/pausable'

export interface Ship extends Updatable, Renderable, Rotatable, Pausable {
    width: number
    length: number
    targetPosition: Position
}

export function updateShip(ship: Ship) {
    if (ship.isPaused()) return

    ship.position.x = ship.targetPosition.x
    ship.position.y = ship.targetPosition.y
}

export function renderShip(ship: Ship, context: CanvasRenderingContext2D): void {
    
    context.rotate(deg2rad(ship.rotation))

    context.beginPath()

    const halfWidth = ship.length / 2
    const halfLength = ship.length / 2

    context.moveTo(-halfWidth, halfLength)
    context.lineTo(halfWidth, halfLength)
    context.lineTo(0, -halfLength)

    context.closePath()

    context.fill()
    context.stroke()
}