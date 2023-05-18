import Coordinate from './coordinates'

export type Radians = number
export type Degrees = number

export interface Rotatable {
    rotation: Radians
}

export const quarter = Math.PI / 2
export const half = Math.PI

export function deg2rad(degrees: Degrees): Radians {
    return (degrees * Math.PI) / 180
}

export function rad2deg(radians: Radians): Degrees {
    return (radians * 180) / Math.PI
}

export function rotationToPosition(position: Coordinate): Radians {
    const { x: A, y: O } = position
    return Math.atan2(O, A)
}