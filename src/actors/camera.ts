import { getContextDataString } from '../engine/render-loop';
import Renderable from '../engine/scene/renderable';
import Updatable from '../engine/scene/updatable'
import World from '../engine/world';

export default interface Camera extends Updatable, Renderable {
    fov: number
    world: World
}

export function renderCamera(camera: Camera, drawRange: boolean, context: CanvasRenderingContext2D) {
    // console.log(`Rendering camera  ${getContextDataString(context)}`)

    const { x, y } = camera.position
    context.translate(-x, -y)

    if (drawRange) {
        context.save()

        const { width, height } = context.canvas
        context.fillStyle = 'rgb(13, 84, 15, .5)'
        context.fillRect(0, 0, width, height)

        context.lineWidth = 10
        context.strokeStyle = 'red'
        context.strokeRect(0, 0, width, height)

        context.restore()
    }

    camera.world.render(context)
}

export function updateCamera(camera: Camera, deltaTime: number) {
    camera.world.update(deltaTime)
}