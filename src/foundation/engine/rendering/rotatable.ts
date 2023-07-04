import Rotation from '../space/rotation'

export default interface Rotatable {
    rotation: Rotation
}

export function isRotatable(object: any): object is Rotatable {
    return (object as Rotatable).rotation !== undefined
}