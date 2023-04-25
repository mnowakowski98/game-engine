// Functions that should probably be replaced by an external library if there's a lot
// I'm not ever gonna do that tho probably

import { Position } from './engine/scene/positionable'

//#region Constants

export const pi2 = Math.PI * 2

//#endregion

//#region Angles & rotation

export type Radians = number
export type Degrees = number

export function deg2rad(degrees: Degrees): Radians {
    return (degrees * Math.PI) / 180
}

export function rad2deg(radians: Radians): Degrees {
    return (radians * 180) / Math.PI
}

export function rotationToPosition(position: Position): Radians {
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

//#endregion

//#region Distance

export type Distance = number

export function movementDistance(speed: number, time: number): Distance {
    return speed * (time / 50)
}

export function linearDistance(a: number, b: number): Distance {
    return Math.abs(b - a)
}

export function positionDistance(pos1: Position, pos2: Position): Distance {
    const differenceX = pos2.x - pos1.x
    const differenceY = pos2.y - pos1.y
    const distance = Math.sqrt(differenceX * differenceX + differenceY * differenceY)
    return distance
}

//#endregion

//#region Randomization

export function randomBetween(min: number, max: number): number {
    const difference = max - min
    const baseRandom = difference * Math.random()
    return baseRandom + min
}

//#endregion