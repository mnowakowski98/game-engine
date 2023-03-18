import Renderable from '../engine/scene/renderable';
import Updatable from '../engine/scene/updatable'

export default interface Camera extends Updatable, Renderable {
    fov: number
}

export function renderCamera(camera: Camera, context: CanvasRenderingContext2D) {
    context.translate(camera.position.x, camera.position.y)
}