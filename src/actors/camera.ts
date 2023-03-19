import { getContextDataString } from '../engine/render-loop';
import Renderable from '../engine/scene/renderable';
import Updatable from '../engine/scene/updatable'
import World from '../engine/world';

export default interface Camera extends Updatable, Renderable {
    fov: number
    world: World
}

export function renderCamera(camera: Camera, context: CanvasRenderingContext2D) {
    console.log(`Rendering camera  ${getContextDataString(context)}`)

    context.save()
    context.fillStyle = '#0d540f'
    context.fillRect(0, 0, context.canvas.width, context.canvas.height)
    context.restore()
    camera.world.render(context)
}