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

export function renderWorld(world: World, offSet: Position, context: CanvasRenderingContext2D) {
    const { width, height, position } = world
    const { x, y } = position

    context.save()
    context.lineWidth = 5
    context.strokeStyle = 'blue'
    context.strokeRect(x, y, width, height)
    context.restore()

    context.translate(x, y)

    for (const mesh of world.meshes) {
        context.save()
        context.translate(mesh.position.x - offSet.x, mesh.position.y - offSet.y)
        mesh.render(context)
        context.restore()
    }
}