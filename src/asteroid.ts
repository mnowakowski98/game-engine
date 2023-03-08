import Collidable from './collidable'
import { Position } from './positionable'
import Renderable from './renderable'
import Updateable from './updatable'

export interface Asteroid extends Collidable, Renderable, Updateable {
    boundingRadius: number
}

export function checkCollision(asteroid: Asteroid, position: Position) {
    const differenceX = position.x - asteroid.position.x
    const differenceY = position.y - asteroid.position.y
    const distance = Math.sqrt(differenceX * differenceX + differenceY * differenceY)
    return distance <= asteroid.boundingRadius
}

export function renderAsteroid(asteroid: Asteroid, context: CanvasRenderingContext2D): boolean {
    context.beginPath()
    context.arc(asteroid.position.x, asteroid.position.y, asteroid.boundingRadius, 0, Math.PI * 2)
    context.closePath()

    context.fillStyle = "#c2a07c"
    context.fill()
    context.stroke()
    return true
}