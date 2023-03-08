import Updateable from './updatable'
import Renderable from './renderable'
import Positionable from './positionable'
import Rotatable from './rotatable'

export interface Ship extends Updateable, Renderable, Positionable, Rotatable {
    colliding: boolean,
    width: number,
    length: number
}

export function renderShip(ship: Ship, context: CanvasRenderingContext2D): boolean {
    context.translate(ship.position.x, ship.position.y)
    context.rotate((ship.rotation * Math.PI) / 180)
    context.translate(-ship.position.x, -ship.position.y)

    context.beginPath()

    const halfWidth = ship.length / 2
    const halfLength = ship.length / 2

    context.moveTo(ship.position.x - halfWidth, ship.position.y + halfLength)
    context.lineTo(ship.position.x + halfWidth, ship.position.y + halfLength)
    context.lineTo(ship.position.x, ship.position.y - halfLength)

    context.closePath()

    context.lineWidth = 2
    if (ship.colliding) context.fillStyle = 'red'
    else context.fillStyle = 'green'
    context.fill()
    context.stroke()
    return true
}