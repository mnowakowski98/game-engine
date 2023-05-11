import Coordinate from './coordinates'

export interface Rotatable {
    rotation: number
}

export type Radians = number
export type Degrees = number

export function deg2rad(degrees: Degrees): Radians {
    return (degrees * Math.PI) / 180
}

export function rad2deg(radians: Radians): Degrees {
    return (radians * 180) / Math.PI
}

export function rotationToPosition(position: Coordinate): Radians {
    const { x: A, y: O } = position
    let rotation = Math.atan(O / A)

    // Detect quadrant and correct rotation
    // I have no idea why these are offset and trying to figure out trig hurts
    // Probably cause canvas uses flipped y values
    if (A <= 0 && O <= 0) rotation -= deg2rad(90) // Q2
    if (A >= 0 && O <= 0) rotation += deg2rad(90) // Q1
    if (A >= 0 && O >= 0) rotation += deg2rad(90) // Q4
    if (A <= 0 && O >= 0) rotation -= deg2rad(90) // Q3

    // Corrections for 0 cases
    if (A == 0) rotation += deg2rad(90)
    if (O == 0) rotation -= deg2rad(90)
    if (O == 0 && A <= 0) rotation += deg2rad(180)

    return rotation
}