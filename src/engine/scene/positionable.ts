import { Coordinate } from "./coordinate"

export default interface Positionable {
    position: Position
}

export type Position = Coordinate

export function origin(): Position {
    return {
        x: 0,
        y: 0
    }
}

export function addPositions(pos1: Position, pos2: Position): Position {
    return {
        x: pos1.x + pos2.x,
        y: pos1.y + pos2.y
    }
}

export function subtractPositions(pos1: Position, pos2: Position): Position {
    return {
        x: pos1.x - pos2.x,
        y: pos1.y - pos2.y
    }
}

export function dividePositions(pos1: Position, pos2: Position): Position {
    return {
        x: pos1.x / pos2.x,
        y: pos1.y / pos2.y
    }
}