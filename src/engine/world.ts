import { getContextDataString } from './render-loop'
import Collidable from './scene/collidable'
import { Position } from './scene/positionable'
import Renderable from './scene/renderable'
import Updatable from './scene/updatable'

type Actor = Renderable | Updatable
type Mesh = Renderable | (Renderable & Collidable)

export default interface World extends Renderable, Updatable {
    id: string
    width: number
    height: number
    meshes: Mesh[]
    actors: Actor[]
}

export const defaultWorldPosition: Position = {
    x: 0,
    y: 0
}

export function renderWorld(world: World, screenOrigin: Position, context: CanvasRenderingContext2D) {
    console.log(`Rendering world ${getContextDataString(context)}`)

    const { width, height, position } = world
    const { x, y } = position

    context.save()
    context.lineWidth = 5
    context.strokeStyle = 'blue'
    //context.translate(-screenOrigin.x, -screenOrigin.y)
    //context.strokeRect(x - screenOrigin.x, y - screenOrigin.y, width, height)
    context.strokeRect(0, 0, width, height)
    context.restore()

    for (const mesh of world.meshes) {
        context.save()
        context.translate(mesh.position.x - screenOrigin.x, mesh.position.y - screenOrigin.y)
        mesh.render(context)
        context.restore()
    }
}