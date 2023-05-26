import { mat4 } from 'gl-matrix'
import Coordinate from '../space/coordinates'
import Updatable from '../update/updatable'
import { Context } from './canvas'

export default interface Camera extends Updatable {
    resolutionX: number
    resolutionY: number
    position: Coordinate
    fieldOfView?: number
    aspect?: number
    zNear?: number
    zFar?: number
}

export function getProjectionMatrices(camera: Camera): mat4 {
    const fieldOfView = camera.fieldOfView ?? (45 * Math.PI) / 180
    const aspect = camera.aspect ?? camera.resolutionX / camera.resolutionY
    const zNear = camera.zNear ?? 0.1
    const zFar = camera.zFar ?? 100

    // Create projection/model view matrices (using gl matrix)
    const projectionMatrix = mat4.create()
    mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar)

    return projectionMatrix
}