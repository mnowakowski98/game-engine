export interface Coordinate2D {
    x: number
    y: number
}

export interface Coordinate3D {
    x: number
    y: number
    z: number
}

type Coordinate = Coordinate2D | Coordinate3D
export default Coordinate

export function add(...coords: Coordinate[]) {
    coords.reduce((previous, current) => ({
        x: previous.x + current.x,
        y: previous.y + current.y
    }))
}

export function subtract(...coords: Coordinate[]) {
    coords.reduce((previous, current) => ({
        x: previous.x - current.x,
        y: previous.y - current.y
    }))
}

export function multiply(...coords: Coordinate[]) {
    coords.reduce((previous, current) => ({
        x: previous.x * current.x,
        y: previous.y * current.y
    }))
}