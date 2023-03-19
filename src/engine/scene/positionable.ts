export default interface Positionable {
    position: Position
}

export interface Position {
    x: number
    y: number
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