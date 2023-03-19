import { getContextDataString } from './render-loop'
import { Position, subtractPositions } from './scene/positionable'
import Renderable from './scene/renderable'
import Updatable from './scene/updatable'

type Actor = {
    id: string
    rendering?: Renderable
    updater?: Updatable
}

export default interface World extends Renderable, Updatable {
    id: string
    width: number
    height: number
    actors: Actor[]
}

export const defaultWorldPosition: Position = {
    x: 0,
    y: 0
}

export function renderWorld(world: World, screenOrigin: Position, context: CanvasRenderingContext2D) {
    // console.log(`Rendering world ${getContextDataString(context)}`)

    const { width, height } = world

    context.save()
    context.lineWidth = 5
    context.strokeStyle = 'blue'
    context.translate(-screenOrigin.x, -screenOrigin.y)
    context.strokeRect(0, 0, width, height)
    context.restore()

    const render = (rendering: Renderable) => {
        // console.log(`Starting rendering ${rendering.id} ${getContextDataString(context)}`)

        context.save()
        const renderPosition = subtractPositions(rendering.position, screenOrigin) 
        context.translate(renderPosition.x, renderPosition.y)
        rendering.render(context)
        context.restore()
    }

    for (const actor of world.actors) 
        if (actor.rendering) render(actor.rendering)
}

export function updateWorld(world: World, deltaTime: number) {
    for (const actor of world.actors)
        if (actor.updater) actor.updater.update(deltaTime)
}