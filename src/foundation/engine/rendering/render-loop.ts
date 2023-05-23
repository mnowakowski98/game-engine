import { Canvas, Context } from './canvas'
import Scene from '../../../feature/scene/scene'
import { Actor } from './world'
import Coordinate,{ add, origin, subtract } from '../space/coordinates'
import Rotation from '../space/rotation'
import { mat4 } from 'gl-matrix'
import { createPositionBuffer, initializeFrameSettings, setDefaultShaders, setPositionAttribute } from './gl'
import { getProjectionMatrices } from './camera'

function renderActor(context: Context, actor: Actor, currentPosition: Coordinate, currentRotation: Rotation) {
    if ('position' in actor) currentPosition = add(currentPosition, actor.position)
    if ('rotation' in actor) currentRotation = add(currentRotation, actor.rotation)

    if ('geometry' in actor) {

    }

    if (actor.actors) actor.actors().forEach(subActor => renderActor(context, subActor, currentPosition, currentRotation))
}

export function startRenderLoop(canvas: Canvas, scene: Scene): () => void {
    ///
    /// Following https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Adding_2D_content_to_a_WebGL_context
    /// to draw a square as WebGL/OpenGL are new to me
    /// TODO: Sort all the instructions into correct modules,
    ///       Un-hardcode(?) the square
    ///

    // Initialize context
    const context = canvas.getContext('webgl2')
    if (!context) throw new Error('Unable to initialize context')
    const shaderInfo = setDefaultShaders(context)
    initializeFrameSettings(context)
    
    // Init position buffers (hardcoded square for now)
    const mcSquarePositions = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0]
    const positionBuffer = createPositionBuffer(context, mcSquarePositions)
    

    // Start render loop
    let isRendering = true
    let requestId = 0

    const renderFrame = () => {
        if (!isRendering) return

        // Clear frame
        context.clear(context.COLOR_BUFFER_BIT)
        
        // Render cameras
        if (scene.cameras && scene.world) {
            const world = scene.world()
            if (!world.actors) return

            const actors = world.actors()
            scene.cameras().forEach(async camera => {
                const [projectionMatrix, modelViewMatrix] = getProjectionMatrices(camera, context)

                // Stuff that might need to be done per mesh
                setPositionAttribute(context, positionBuffer, shaderInfo)
                context.useProgram(shaderInfo.shaderProgram)
        
                context.uniformMatrix4fv(shaderInfo.uniformLocations.projectionMatrix, false, projectionMatrix)
                context.uniformMatrix4fv(shaderInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix)
        
                const vertexCount = 4
                const offset = 0
                context.drawArrays(context.TRIANGLE_STRIP, offset, vertexCount)
                
                // Set camera identity as base
                let currentPosition = origin()
                let currentRotation = origin()

                const halfRes = [camera.resolutionX / 2, camera.resolutionY / 2]
                currentPosition = add(camera, { x: halfRes[0], y: halfRes[1]})

                actors.forEach(actor => {
                    currentPosition = subtract(currentPosition, camera.position)
                    renderActor(context, actor, currentPosition, currentRotation)
                })
            })
        }

        requestId = requestAnimationFrame(renderFrame)
    }

    renderFrame()
    return () => {
        isRendering = false
        cancelAnimationFrame(requestId)
    }
}