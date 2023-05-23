import { Canvas, Context } from './canvas'
import Scene from '../../../feature/scene/scene'
import { Actor, isMesh, isPositionable } from './world'
import { ShaderInfo, createPositionBuffer, initializeFrameSettings, setDefaultShaders, setPositionAttribute } from './gl'
import { getProjectionMatrices } from './camera'
import { mat4 } from 'gl-matrix'

function renderActor(context: Context, shaderInfo: ShaderInfo, projectionMatrix: mat4, modelViewMatrix: mat4, actor: Actor) {
    if (isMesh(actor)) {
        const positions: number[] = []
        actor.geometry.forEach(position => {
            let x = position.x
            let y = position.y

            if (isPositionable(actor)) {
                x += actor.position.x / 100
                y += actor.position.y / 100
            }

            positions.push(x)
            positions.push(y)
        })

        const positionBuffer = createPositionBuffer(context, positions)
        setPositionAttribute(context, positionBuffer, shaderInfo)

        context.useProgram(shaderInfo.shaderProgram)
        
        context.uniformMatrix4fv(shaderInfo.uniformLocations.projectionMatrix, false, projectionMatrix)
        context.uniformMatrix4fv(shaderInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix)

        const vertexCount = actor.geometry.length
        const offset = 0
        context.drawArrays(context.TRIANGLE_STRIP, offset, vertexCount)

        context.deleteBuffer(positionBuffer)
        context.disableVertexAttribArray(shaderInfo.attributeLocations.vertexPosition)
    }

    if (actor.actors) actor.actors().forEach(subActor => renderActor(context, shaderInfo, projectionMatrix, modelViewMatrix, subActor))
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
                actors.forEach(actor => renderActor(context, shaderInfo, projectionMatrix, modelViewMatrix, actor))
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