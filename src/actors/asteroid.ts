import Collidable from '../engine/scene/collidable'
import { Position } from '../engine/scene/positionable'
import Renderable from '../engine/scene/renderable'
import Rotatable from '../engine/scene/rotatable'
import Updatable from '../engine/scene/updatable'

export interface Asteroid extends Collidable, Renderable, Updatable, Rotatable {
    boundingRadius: number
    speed: number
}

export function checkCollision(asteroid: Asteroid, position: Position): boolean {
    const differenceX = position.x - asteroid.position.x
    const differenceY = position.y - asteroid.position.y
    const distance = Math.sqrt(differenceX * differenceX + differenceY * differenceY)
    return distance <= asteroid.boundingRadius
}

export function renderAsteroid(asteroid: Asteroid, context: CanvasRenderingContext2D): void {
    context.beginPath()
    context.arc(0, 0, asteroid.boundingRadius, 0, Math.PI * 2)
    context.closePath()

    context.fillStyle = "#c2a07c"
    context.fill()
    context.stroke()
}

export function updateAsteroid(asteroid: Asteroid, deltaTime: number, isPaused: boolean) {
    if (isPaused) return

    asteroid.position.x += Math.sin(asteroid.rotation) * (asteroid.speed / deltaTime)
    asteroid.position.y += Math.cos(asteroid.rotation) * (asteroid.speed / deltaTime)
}