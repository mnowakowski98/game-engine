import Camera from '../actors/camera'
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

export function renderWorld(world: World, context: CanvasRenderingContext2D, camera: Camera) {
    context.translate(world.position.x, world.position.y)
    
    camera.render(context)

    for (const mesh of world.meshes) {
        context.save()
        context.translate(mesh.position.x - camera.position.x, mesh.position.y - camera.position.y)
        mesh.render(context)
        context.restore()
    }
}