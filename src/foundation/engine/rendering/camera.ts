import Coordinate from '../space/coordinates'

export default interface Camera {
    resolutionX: number
    resolutionY: number
    position: Coordinate
}