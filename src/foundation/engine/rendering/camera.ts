import Coordinate from '../space/coordinates'
import Updatable from '../update/updatable'

export default interface Camera extends Updatable {
    resolutionX: number
    resolutionY: number
    position: Coordinate
}