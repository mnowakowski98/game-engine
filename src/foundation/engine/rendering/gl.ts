///
/// Following https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Adding_2D_content_to_a_WebGL_context
/// to draw a square as WebGL/OpenGL are new to me
///

import { CameraMatrices } from '../scene/camera'
import { Canvas } from './canvas'
import { RenderPipeline } from './render-loop'

const vertexShaderSource = /*glsl*/ `
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

const fragmentShaderSource = /*glsl*/ `
    precision lowp float;
    varying vec4 vVertexColor;
    void main() {
      gl_FragColor = vVertexColor;
    }
`

interface ShaderInfo {
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

interface GLRenderData {
    positionBuffer: WebGLBuffer
    colorBuffer: WebGLBuffer | null
}

let globalContext: WebGL2RenderingContext | null

const glRenderingPipeline: RenderPipeline = {
    init: (canvas: Canvas) => {
        const gl = globalContext ?? canvas.getContext('webgl2')
        if (!gl) throw 'Failed to initialize WebGL2'
        globalContext = gl

        const shaderInfo = setDefaultShaders(gl)
        initializeFrameSettings(gl)
        gl.useProgram(shaderInfo.shaderProgram)

        return {
            context: gl,
            loadMesh: (mesh) => {
                const positions: number[] = []
                mesh.geometry.forEach(point => {
                    positions.push(point.x)
                    positions.push(point.y)
                })

                const positionBuffer = createPositionBuffer(gl, positions)

                let colorBuffer: WebGLBuffer | null = null
                if (mesh.material) {
                    const colors: number[] = []
                    mesh.material.diffuse.forEach(color => {
                        colors.push(color.red / 255, color.green / 255, color.blue / 255, 1)
                    })
                    colorBuffer = createColorBuffer(gl, colors)
                }

                return {
                    draw: (matrices: CameraMatrices) => {
                        setPositionAttribute(gl, positionBuffer, shaderInfo)
                        if (colorBuffer) setColorAttribute(gl, colorBuffer, shaderInfo)

                        gl.uniformMatrix4fv(shaderInfo.uniformLocations.projectionMatrix, false, matrices.perspective)
                        gl.uniformMatrix4fv(shaderInfo.uniformLocations.modelViewMatrix, false, matrices.modelView)

                        const vertexCount = mesh.geometry.length
                        const offset = 0
                        gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount)

                    },
                    unload: () => { }
                }
            }
        }
    },
    frame: (gl: WebGL2RenderingContext) => ({
        clear: () => gl.clear(gl.COLOR_BUFFER_BIT)
    })
}
export default glRenderingPipeline

function loadShader(gl: WebGL2RenderingContext, source: string, shaderType: number): WebGLShader {
    const shader = gl.createShader(shaderType)
    if (!shader) throw `Failed to create shader type: ${shaderType}`
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const message = gl.getShaderInfoLog(shader)
        gl.deleteShader(shader)
        throw `Shader failed to compile: ${message}`
    }
    return shader
}

function setDefaultShaders(gl: WebGL2RenderingContext): ShaderInfo {
    const vertexShader = loadShader(gl, vertexShaderSource, gl.VERTEX_SHADER)
    const fragmentShader = loadShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER)

    // Init default shader program
    const shaderProgram = gl.createProgram()
    if (!shaderProgram) throw 'Failed to create shader program'
    gl.attachShader(shaderProgram, vertexShader)
    gl.attachShader(shaderProgram, fragmentShader)
    gl.linkProgram(shaderProgram)
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS))
        throw 'Failed to link shader program'


    // Get attribute/uniform locations
    const aVertexPosition = gl.getAttribLocation(shaderProgram, 'aVertexPosition')
    const aVertexColor = gl.getAttribLocation(shaderProgram, 'aVertexColor')

    const uProjectionMatrix = gl.getUniformLocation(shaderProgram, 'uProjectionMatrix')
    if (!uProjectionMatrix) throw 'uProjectionMatrix not found in shader program'
    const uModelViewMatrix = gl.getUniformLocation(shaderProgram, 'uModelViewMatrix')
    if (!uModelViewMatrix) throw 'uModelViewMatrix not found in shader program'

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

function initializeFrameSettings(gl: WebGL2RenderingContext) {
    // Init gl draw settings
    gl.clearColor(0, 0, 0, 1)
    gl.clearDepth(1)
    gl.enable(gl.DEPTH_TEST)
    gl.depthFunc(gl.LEQUAL)
}

function createPositionBuffer(gl: WebGL2RenderingContext, positions: number[]): WebGLBuffer {
    const buffer = gl.createBuffer()
    if (!buffer) throw 'Failed to create position buffer'
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)
    return buffer
}

function createColorBuffer(gl: WebGL2RenderingContext, colors: number[]): WebGLBuffer {
    const buffer = gl.createBuffer()
    if (!buffer) throw 'Failed to create color buffer'
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW)
    return buffer
}

function setColorAttribute(gl: WebGL2RenderingContext, colorBuffer: WebGLBuffer, shaderInfo: ShaderInfo) {
    const numComponents = 4
    const dataType = gl.FLOAT
    const normalize = false
    const stride = 0
    const offset = 0

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
    gl.vertexAttribPointer(shaderInfo.attributeLocations.vertexColor, numComponents, dataType, normalize, stride, offset)
    gl.enableVertexAttribArray(shaderInfo.attributeLocations.vertexColor)
}

function setPositionAttribute(gl: WebGL2RenderingContext, positionBuffer: WebGLBuffer, shaderInfo: ShaderInfo) {
    const numComponents = 2
    const dataType = gl.FLOAT
    const normalize = false
    const stride = 0
    const offset = 0

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.vertexAttribPointer(shaderInfo.attributeLocations.vertexPosition, numComponents, dataType, normalize, stride, offset)
    gl.enableVertexAttribArray(shaderInfo.attributeLocations.vertexPosition)
}