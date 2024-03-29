import { mat4 } from 'gl-matrix'
import { isPositionable } from '../rendering/positionable'
import { isRotatable } from '../rendering/rotatable'
import { ActorOptionals } from './actor'
import Unique from '../../base-types/unique'

interface CameraBase extends Unique {
    resolutionX: number
    resolutionY: number
    fieldOfView?: number
    aspect?: number
    zNear?: number
    zFar?: number
}

type Camera = CameraBase & ActorOptionals
export default Camera

export interface CameraMatrices {
    perspective: mat4,
    modelView: mat4
}

export function getProjectionMatrices(camera: Camera): CameraMatrices {
    const fieldOfView = camera.fieldOfView ?? (45 * Math.PI) / 180
    const aspect = camera.aspect ?? camera.resolutionX / camera.resolutionY
    const zNear = camera.zNear ?? 1
    const zFar = camera.zFar ?? 1000

    // Create projection/model view matrices (using gl matrix)
    const projectionMatrix = mat4.create()
    mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar)

    const modelViewMatrix = mat4.create()

    if (isPositionable(camera)) {
        const { x: xPos, y: yPos } = camera.position
        const zPos = ('z' in camera.position) ? camera.position.z : 0
        mat4.translate(modelViewMatrix, modelViewMatrix, [-xPos, -yPos, zPos])
    }

    if (isRotatable(camera)) {
        const { x: xRot, y: yRot } = camera.rotation
        const zRot = ('z' in camera.rotation) ? camera.rotation.z : 0
        mat4.rotateX(projectionMatrix, projectionMatrix, xRot)
        mat4.rotateY(projectionMatrix, projectionMatrix, yRot)
        mat4.rotateZ(projectionMatrix, projectionMatrix, zRot)
    }

    return {
        perspective: projectionMatrix,
        modelView: modelViewMatrix
    }
}