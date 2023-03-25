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
    console.log(`Rendering camera ${getContextDataString(context)}`)

    const { resolutionX, resoltuionY: resolutionY, screenX, screenY } = camera

    context.resetTransform()

    context.save()
    context.translate(screenX, screenY)
    context.strokeRect(0, 0, resolutionX, resolutionY)

    if (drawRange) {
        context.save()

        context.fillStyle = 'rgb(13, 84, 15, .25)'
        context.fillRect(0, 0, resolutionX, resolutionY)

        context.lineWidth = 10
        context.strokeStyle = 'rgb(255, 0, 0, .25'
        context.strokeRect(0, 0, resolutionX, resolutionY)

        context.restore()
    }

    context.restore()

    context.beginPath()
    context.rect(screenX, screenY, resolutionX, resolutionY)
    context.clip()

    const { x, y } = camera.position
    context.translate(camera.world.position.x, camera.world.position.y)
    context.translate(screenX + resolutionX / 2, screenY + resolutionY / 2)
    context.translate(-x - camera.world.width / 2, -y - camera.world.height / 2)
    camera.world.render(context)
}

export function updateCamera(camera: Camera, deltaTime: number) {
    camera.world.update(deltaTime)
}