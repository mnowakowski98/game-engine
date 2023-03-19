import { getContextDataString } from './render-loop'
import Collidable from './scene/collidable'
import { Position, subtractPositions } from './scene/positionable'
import Renderable from './scene/renderable'
import Updatable from './scene/updatable'

type Actor = Updatable
type Brush = Renderable & {
    collision?: Collidable
}

export default interface World extends Renderable, Updatable {
    id: string
    width: number
    height: number
    brushes: Brush[]
    actors: Actor[]
}

export const defaultWorldPosition: Position = {
    x: 0,
    y: 0
}

export function renderWorld(world: World, screenOrigin: Position, context: CanvasRenderingContext2D) {
    console.log(`Rendering world ${getContextDataString(context)}`)

    const { width, height, position } = world

    context.save()
    context.lineWidth = 5
    context.strokeStyle = 'blue'
    context.translate(-screenOrigin.x, -screenOrigin.y)
    context.strokeRect(0, 0, width, height)
    context.restore()

    const render = (rendering: Brush) => {
        console.log(`Starting rendering ${rendering.id} ${getContextDataString(context)}`)

        context.save()
        const renderPosition = subtractPositions(rendering.position, screenOrigin) 
        context.translate(renderPosition.x, renderPosition.y)
        rendering.render(context)
        context.restore()
    }

    for (const mesh of world.brushes) render(mesh)
}

export function updateWorld(world: World, deltaTime: number) {
    for (const actor of world.actors) actor.update(deltaTime)
}