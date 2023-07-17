import Unique from '../../base-types/unique'
import Coordinate from '../space/coordinates'
import Material from './material'

export default interface Mesh extends Unique {
    geometry: Coordinate[]
    material?: Material
}

export function isMesh(object: any): object is Mesh {
    return (object as Mesh).geometry !== undefined
}