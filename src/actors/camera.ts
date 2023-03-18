import Renderable from '../engine/scene/renderable';
import Updatable from '../engine/scene/updatable'
import World, { renderWorld } from '../engine/world';

export default interface Camera extends Updatable, Renderable {
    fov: number
    world: World
}

export function renderCamera(camera: Camera, context: CanvasRenderingContext2D) {
    const { x, y } = camera.position
    context.translate(x, y)
    camera.world.render(context)
}