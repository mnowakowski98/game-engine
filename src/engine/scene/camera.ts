import { getContextDataString } from '../render-loop';
import { addPositions, Position } from './positionable';
import Renderable from './renderable';
import World from './world';

export default interface Camera extends Renderable {
    fov: number
    screenX: number,
    screenY: number,
    resolutionX: number
    resolutionY: number
}

export function renderCamera(camera: Camera, world: World, drawRange: boolean, context: CanvasRenderingContext2D) {
    console.log(`Rendering camera ${getContextDataString(context)}`)

    const { resolutionX, resolutionY, screenX, screenY } = camera

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
    context.translate(world.position.x, world.position.y)
    context.translate(screenX + resolutionX / 2, screenY + resolutionY / 2)
    context.translate(-x - world.width / 2, -y - world.height / 2)
    world.render(context)
}

export function screenToCameraPosition(camera: Camera, screenPosition: Position): Position {
    const { resolutionX, resolutionY, screenX, screenY } = camera
    return addPositions({
        x: -screenX - resolutionX / 2,
        y: -screenY - resolutionY / 2
    }, screenPosition)
}

export function screenToWorldPosition(camera: Camera, screenPosition: Position): Position {
    const cameraRelativePosition = screenToCameraPosition(camera, screenPosition)
    return addPositions(cameraRelativePosition, camera.position)
}