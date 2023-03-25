import { getContextDataString } from '../engine/render-loop';
import Renderable from '../engine/scene/renderable';
import Updatable from '../engine/scene/updatable'
import World from '../engine/scene/world';

export default interface Camera extends Updatable, Renderable {
    fov: number
    screenX: number,
    screenY: number,
    resolutionX: number
    resoltuionY: number
    world: World
}

export function renderCamera(camera: Camera, drawRange: boolean, context: CanvasRenderingContext2D) {
    // console.log(`Rendering camera  ${getContextDataString(context)}`)

    const { x, y } = camera.position

    if (drawRange) {
        context.save()

        const { resolutionX, resoltuionY, screenX, screenY } = camera

        context.resetTransform()
        context.translate(screenX, screenY)

        context.fillStyle = 'rgb(13, 84, 15, .5)'
        context.fillRect(0, 0, resolutionX, resoltuionY)

        context.lineWidth = 10
        context.strokeStyle = 'red'
        context.strokeRect(0, 0, resolutionX, resoltuionY)

        context.restore()
    }

    camera.world.render(context)
}

export function updateCamera(camera: Camera, deltaTime: number) {
    camera.world.update(deltaTime)
}