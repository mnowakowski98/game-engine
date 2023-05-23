import { Canvas, Context } from './canvas'
import Scene from '../../../feature/scene/scene'
import { Actor } from './world'
import Coordinate,{ add, origin, subtract } from '../space/coordinates'
import Rotation from '../space/rotation'
import { mat4 } from 'gl-matrix'

function renderActor(context: Context, actor: Actor, currentPosition: Coordinate, currentRotation: Rotation) {
    if ('position' in actor) currentPosition = add(currentPosition, actor.position)
    if ('rotation' in actor) currentRotation = add(currentRotation, actor.rotation)

    if ('geometry' in actor) {

    }

    if (actor.actors) actor.actors().forEach(subActor => renderActor(context, subActor, currentPosition, currentRotation))
}

const vertexShaderSource = `
attribute vec4 aVertexPosition;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
void main() {
  gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
}
`

const fragmentShaderSource = `
void main() {
  gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
}
`

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

    // Init vertex shader
    const vertexShader = context.createShader(context.VERTEX_SHADER)
    if (!vertexShader) throw new Error('Unable to initialize vertex shader')
    context.shaderSource(vertexShader, vertexShaderSource)
    context.compileShader(vertexShader)
    if (!context.getShaderParameter(vertexShader, context.COMPILE_STATUS)) {
        const errorLog = context.getShaderInfoLog(vertexShader)
        if (!errorLog) console.error('Failed to get shader info log')
        context.deleteShader(vertexShader)
        throw new Error(`Vertex shader failed to compile: ${errorLog}`)
    }

    // Init fragment shader
    const fragmentShader = context.createShader(context.FRAGMENT_SHADER)
    if (!fragmentShader) throw new Error('Unable to initialize fragment shader')
    context.shaderSource(fragmentShader, fragmentShaderSource)
    context.compileShader(fragmentShader)
    if (!context.getShaderParameter(vertexShader, context.COMPILE_STATUS)) {
        context.deleteShader(fragmentShader)
        throw new Error('Fragment shader failed to compile')
    }

    // Init default shader program
    const shaderProgram = context.createProgram()
    if (!shaderProgram) throw new Error('Failed to create shader program')
    context.attachShader(shaderProgram, vertexShader)
    context.attachShader(shaderProgram, fragmentShader)
    context.linkProgram(shaderProgram)
    if (!context.getProgramParameter(shaderProgram, context.LINK_STATUS))
        throw new Error('Failed to link shader program')


    // Get attribute/uniform locations
    const aVertexPosition = context.getAttribLocation(shaderProgram, 'aVertexPosition')
    const uProjectionMatrix = context.getUniformLocation(shaderProgram, 'uProjectionMatrix')
    const uModelViewMatrix = context.getUniformLocation(shaderProgram, 'uModelViewMatrix')

    // Init position buffers
    const positionBuffer = context.createBuffer()
    if (!positionBuffer) throw new Error('Failed to create position buffer')
    context.bindBuffer(context.ARRAY_BUFFER, positionBuffer)

    const positions = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0]
    context.bufferData(context.ARRAY_BUFFER, new Float32Array(positions), context.STATIC_DRAW)

    // Init context draw settings
    context.clearColor(0, 0, 0, 1)
    context.clearDepth(1)
    context.enable(context.DEPTH_TEST)
    context.depthFunc(context.LEQUAL)

    // Start render loop
    let isRendering = true
    let requestId = 0

    const renderFrame = () => {
        if (!isRendering) return

        // Clear frame
        context.clear(context.COLOR_BUFFER_BIT)

        // Camera settings
        const fieldOfView = (45 * Math.PI) / 180
        const aspect = canvas.clientWidth / canvas.clientHeight
        const zNear = 0.1
        const zFar = 100

        // Create projection/model view matrices (using gl matrix)
        const projectionMatrix = mat4.create()
        mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar)

        const modelViewMatrix = mat4.create()
        mat4.translate(modelViewMatrix, modelViewMatrix, [0, 0, -6])

        const numComponents = 2
        const dataType = context.FLOAT
        const normalize = false
        const stride = 0
        const offset = 0

        context.bindBuffer(context.ARRAY_BUFFER, positionBuffer)
        context.vertexAttribPointer(aVertexPosition, numComponents, dataType, normalize, stride, offset)
        context.enableVertexAttribArray(aVertexPosition)

        context.useProgram(shaderProgram)

        context.uniformMatrix4fv(uProjectionMatrix, false, projectionMatrix)
        context.uniformMatrix4fv(uModelViewMatrix, false, modelViewMatrix)

        const vertexCount = 4
        context.drawArrays(context.TRIANGLE_STRIP, offset, vertexCount)
        
        // Render cameras
        // if (scene.cameras && scene.world) {
        //     const world = scene.world()
        //     if (!world.actors) return

        //     const actors = world.actors()
        //     scene.cameras().forEach(async camera => {

        //         let currentPosition = origin()
        //         let currentRotation = origin()

        //         const halfRes = [camera.resolutionX / 2, camera.resolutionY / 2]
        //         currentPosition = add(camera, { x: halfRes[0], y: halfRes[1]})

        //         actors.forEach(actor => {
        //             currentPosition = subtract(currentPosition, camera.position)
        //             renderActor(context, actor, currentPosition, currentRotation)
        //         })
        //     })
        // }

        requestId = requestAnimationFrame(renderFrame)
    }

    renderFrame()
    return () => {
        isRendering = false
        cancelAnimationFrame(requestId)
    }
}