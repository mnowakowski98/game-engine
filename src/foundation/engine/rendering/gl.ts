const vertexShaderSource = `
attribute vec4 aVertexPosition;
attribute vec4 aVertexColor;
varying vec4 vVertexColor;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
void main() {
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    vVertexColor = aVertexColor;
}
`

const fragmentShaderSource = `
precision mediump float;
varying vec4 vVertexColor;
void main() {
  gl_FragColor = vVertexColor;
}
`

export interface ShaderInfo {
    shaderProgram: WebGLProgram
    attributeLocations: {
        vertexPosition: number
        vertexColor: number
    }
    uniformLocations: {
        projectionMatrix: WebGLUniformLocation
        modelViewMatrix: WebGLUniformLocation
    }
}

function loadShader(context: WebGL2RenderingContext, source: string, shaderType: number): WebGLShader {
    const shader = context.createShader(shaderType)
    if (!shader) throw `Failed to create shader type: ${shaderType}`
    context.shaderSource(shader, source)
    context.compileShader(shader)
    if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) {
        const message = context.getShaderInfoLog(shader)
        context.deleteShader(shader)
        throw `Shader failed to compile: ${message}`
    }
    return shader
}

export function setDefaultShaders(context: WebGL2RenderingContext): ShaderInfo {
    const vertexShader = loadShader(context, vertexShaderSource, context.VERTEX_SHADER)
    const fragmentShader = loadShader(context, fragmentShaderSource, context.FRAGMENT_SHADER)
    
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
    const aVertexColor = context.getAttribLocation(shaderProgram, 'aVertexColor')

    const uProjectionMatrix = context.getUniformLocation(shaderProgram, 'uProjectionMatrix')
    if (!uProjectionMatrix) throw new Error('uProjectionMatrix not found in shader program')
    const uModelViewMatrix = context.getUniformLocation(shaderProgram, 'uModelViewMatrix')
    if (!uModelViewMatrix) throw new Error('uModelViewMatrix not found in shader program')

    return {
        shaderProgram: shaderProgram,
        attributeLocations: {
            vertexPosition: aVertexPosition,
            vertexColor: aVertexColor
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

export function createColorBuffer(context: WebGL2RenderingContext, colors: number[]): WebGLBuffer {
    const buffer = context.createBuffer()
    if (!buffer) throw new Error('Failed to create color buffer')
    context.bindBuffer(context.ARRAY_BUFFER, buffer)
    context.bufferData(context.ARRAY_BUFFER, new Float32Array(colors), context.STATIC_DRAW)
    return buffer
}

export function setColorAttribute(context: WebGL2RenderingContext, colorBuffer: WebGLBuffer, shaderInfo: ShaderInfo) {
    const numComponents = 4
    const dataType = context.FLOAT
    const normalize = false
    const stride = 0
    const offset = 0

    context.bindBuffer(context.ARRAY_BUFFER, colorBuffer)
    context.vertexAttribPointer(shaderInfo.attributeLocations.vertexColor, numComponents, dataType, normalize, stride, offset)
    context.enableVertexAttribArray(shaderInfo.attributeLocations.vertexColor)
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