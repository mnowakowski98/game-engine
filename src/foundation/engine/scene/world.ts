import { getContextDataString } from '../rendering/render-loop'
import Logable from './logable'
import { Position } from './positionable'
import Renderable from './renderable'
import Updatable from './updatable'

type Actor = Renderable | Updatable

export default interface World extends Renderable, Updatable, Logable {
    width: number
    height: number
    actors: Actor[]
}

export function renderWorld(world: World, context: CanvasRenderingContext2D) {
    if (world.shouldLog()) console.log(`Rendering world ${getContextDataString(context)}`)

    const { width, height } = world

    context.save()
    context.lineWidth = 5
    context.strokeStyle = 'blue'
    context.strokeRect(0, 0, width, height)
    context.restore()

    const renderableActors: Renderable[] = []
    for (const actor of world.actors)
        if ("render" in actor) renderableActors.push(actor)

    renderableActors.sort((a, b) => (a.zIndex ?? 0) - (b.zIndex ?? 0))

    for (const actor of renderableActors) {
        // console.log(`Starting rendering ${actor.id} ${getContextDataString(context)}`)

        context.save()
        context.translate(actor.position.x + world.width / 2, actor.position.y + world.height / 2)
        context.rotate(actor.rotation)
        actor.render(context)
        context.restore()
    }
}

export function updateWorld(world: World, deltaTime: number) {
    for (const actor of world.actors)
        if ("update" in actor) actor.update(deltaTime)
}

export function getWorldBounds(world: World): [Position, Position] {
    const halfWidth = world.width / 2
    const halfHeight = world.height / 2
    return [
        {
            x: -halfWidth,
            y: -halfHeight
        },
        {
            x: halfWidth,
            y: halfHeight
        }
    ]
}

export function isOutsideWorldBounds(world: World, position: Position): boolean {
    const worldBounds = getWorldBounds(world)
    const x = position.x + world.position.x
    const y = position.y + world.position.y
    const outsideX = x < worldBounds[0].x || x > worldBounds[1].x
    const outsideY = y < worldBounds[0].y || y > worldBounds[1].y
    return outsideX || outsideY
}