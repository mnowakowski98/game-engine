import Coordinate from '../space/coordinates'

export default interface Positionable {
    position: Coordinate
}

export function isPositionable(object: any): object is Positionable {
    return (object as Positionable).position !== undefined
}