import Coordinate from '../../space/coordinates'
import Material from './material'

export default interface Mesh {
    geometry: Coordinate[]
    material: Material
}