import Coordinate from '../space/coordinates'
import Material from './material'

export default interface Mesh {
    geometry: Coordinate[]
    material?: Material
}

export function isMesh(object: any): object is Mesh {
    return (object as Mesh).geometry !== undefined
}