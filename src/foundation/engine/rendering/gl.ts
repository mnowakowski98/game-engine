import Coordinate from "../space/coordinates"

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

export interface ShaderInfo {
    shaderProgram: WebGLProgram
    attributeLocations: {
        vertexPosition: number
    }
    uniformLocations: {
        projectionMatrix: WebGLUniformLocation
        modelViewMatrix: WebGLUniformLocation
    }
}

export function setDefaultShaders(context: WebGL2RenderingContext): ShaderInfo {
    // Init vertex shader
    const vertexShader = context.createShader(context.VERTEX_SHADER)
    if (!vertexShader) throw new Error('Unable to initialize vertex shader')
    context.shaderSource(vertexShader, vertexShaderSource)
    context.compileShader(vertexShader)
    if (!context.getShaderParameter(vertexShader, context.COMPILE_STATUS)) {
        context.deleteShader(vertexShader)
        throw new Error(`Vertex shader failed to compile`)
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
    if (!uProjectionMatrix) throw new Error('uProjectionMatrix not found in shader program')
    const uModelViewMatrix = context.getUniformLocation(shaderProgram, 'uModelViewMatrix')
    if (!uModelViewMatrix) throw new Error('uModelViewMatrix not found in shader program')

    return {
        shaderProgram: shaderProgram,
        attributeLocations: {
            vertexPosition: aVertexPosition,
        },
        uniformLocations: {
            projectionMatrix: uProjectionMatrix,
            modelViewMatrix: uModelViewMatrix
        }
    }
}

export function initializeFrameSettings(context: WebGL2RenderingContext) {
    // Init context draw settings
    context.clearColor(0, 0, 0, 1)
    context.clearDepth(1)
    context.enable(context.DEPTH_TEST)
    context.depthFunc(context.LEQUAL)
}

export function createPositionBuffer(context: WebGL2RenderingContext, positions: number[]): WebGLBuffer {
    const buffer = context.createBuffer()
    if (!buffer) throw new Error('Failed to create position buffer')
    context.bindBuffer(context.ARRAY_BUFFER, buffer)
    context.bufferData(context.ARRAY_BUFFER, new Float32Array(positions), context.STATIC_DRAW)
    return buffer
}

export function setPositionAttribute(context: WebGL2RenderingContext, positionBuffer: WebGLBuffer, shaderInfo: ShaderInfo) {
    const numComponents = 2
    const dataType = context.FLOAT
    const normalize = false
    const stride = 0
    const offset = 0

    context.bindBuffer(context.ARRAY_BUFFER, positionBuffer)
    context.vertexAttribPointer(shaderInfo.attributeLocations.vertexPosition, numComponents, dataType, normalize, stride, offset)
    context.enableVertexAttribArray(shaderInfo.attributeLocations.vertexPosition)
}