import { Canvas, Context } from './canvas'
import Scene from '../../../feature/scene/scene'
import { Actor } from './world'
import Coordinate,{
    add as addCoords,
    origin as coordOrigin,
    subtract as subtractCoords
} from '../space/coordinates'
import Rotation, { add as addRotations, origin as rotationOrigin } from '../space/rotation'

function renderActor(context: Context, actor: Actor, currentPosition: Coordinate, currentRotation: Rotation) {
    if ('position' in actor) currentPosition = addCoords(currentPosition, actor.position)
    if ('rotation' in actor) currentRotation = addRotations(currentRotation, actor.rotation)

    if ('geometry' in actor) {

    }

    if ('render' in actor) actor.render(context)

    if (actor.actors) actor.actors().forEach(subActor => renderActor(context, subActor, currentPosition, currentRotation))
}

export function startRenderLoop(canvas: Canvas, scene: Scene): () => void {
    const context = canvas.getContext('webgl2')
    if (!context) throw new Error('Unable to initialize context')

    context.clearColor(0, 0, 0, 1)

    let isRendering = true

    let requestId = 0
    const renderFrame = () => {
        if (!isRendering) return

        // Clear frame
        context.clear(context.COLOR_BUFFER_BIT)
        
        if (scene.cameras && scene.world) {
            const world = scene.world()
            if (!world.actors) return

            const actors = world.actors()
            scene.cameras().forEach(camera => {

                let currentPosition = coordOrigin()
                let currentRotation = rotationOrigin()

                const halfRes = [camera.resolutionX / 2, camera.resolutionY / 2]
                currentPosition = addCoords(camera, { x: halfRes[0], y: halfRes[1]})

                actors.forEach(actor => {
                    currentPosition = subtractCoords(currentPosition, camera.position)
                    renderActor(context, actor, currentPosition, currentRotation)
                })
            })
        }

        if (scene.renderings) {
            const renderings = scene.renderings().sort((a, b) => a.zIndex - b.zIndex)
            renderings.forEach(rendering => rendering.render(context))
        }

        requestId = requestAnimationFrame(renderFrame)
    }

    renderFrame()
    return () => {
        isRendering = false
        cancelAnimationFrame(requestId)
    }
}