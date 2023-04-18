// Functions that should probably be replaced by an external library if there's a lot
// I'm not ever gonna do that tho probably

import { Position } from './engine/scene/positionable'

export const pi2 = Math.PI * 2

export function deg2rad(degrees: number): number {
    return (degrees * Math.PI) / 180
}

export function rad2deg(radians: number): number {
    return (radians * 180) / Math.PI
}

export function movementDistance(speed: number, time: number): number {
    return speed * (time / 50)
}

export function linearDistance(a: number, b: number): number {
    return Math.abs(b - a)
}

export function positionDistance(pos1: Position, pos2: Position): number {
    const differenceX = pos2.x - pos1.x
    const differenceY = pos2.y - pos1.y
    const distance = Math.sqrt(differenceX * differenceX + differenceY * differenceY)
    return distance
}

export function randomBetween(min: number, max: number): number {
    const difference = max - min
    const baseRandom = difference * Math.random()
    return baseRandom + min
}