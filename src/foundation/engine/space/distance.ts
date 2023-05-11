import Coordinate from './coordinates'

export type Distance = number

export function movementDistance(speed: number, time: number): Distance {
    return speed * (time / 50)
}

export function linearDistance(a: number, b: number): Distance {
    return Math.abs(b - a)
}

export function coordinateDistance(pos1: Coordinate, pos2: Coordinate): Distance {
    const differenceX = pos2.x - pos1.x
    const differenceY = pos2.y - pos1.y
    const distance = Math.sqrt(differenceX * differenceX + differenceY * differenceY)
    return distance
}