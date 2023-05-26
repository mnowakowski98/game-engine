export interface Coordinate2d {
    x: number
    y: number
}

export interface Coordinate3d {
    x: number
    y: number
    z: number
}

type Coordinate = Coordinate2d | Coordinate3d
export default Coordinate

export const origin = (): Coordinate => ({
    x: 0,
    y: 0,
    z: 0
})

export function add(...coords: Coordinate[]): Coordinate {
    return coords.reduce((previous, current) => {
        let z = 0
        if ('z' in previous && 'z' in current) z = previous.z + current.z

        return {
            x: previous.x + current.x,
            y: previous.y + current.y,
            z: z
        }
    })
}

export function subtract(...coords: Coordinate[]): Coordinate {
    return coords.reduce((previous, current) => {
        let z = 0
        if ('z' in previous && 'z' in current) z = previous.z - current.z

        return {
            x: previous.x - current.x,
            y: previous.y - current.y,
            z: z
        }
    })
}

export function multiply(...coords: Coordinate[]): Coordinate {
    return coords.reduce((previous, current) => {
        let z = 0
        if ('z' in previous && 'z' in current) z = previous.z * current.z
        if ('z' in previous && !('z' in current)) z = previous.z

        return {
            x: previous.x * current.x,
            y: previous.y * current.y,
            z: z
        }
    })
}