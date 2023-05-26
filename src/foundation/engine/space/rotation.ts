import Coordinate from './coordinates'

export type Radians = number
export type Degrees = number

export type Rotation2d = {
    x: Radians,
    y: Radians
}

export type Rotation3d = {
    x: Radians,
    y: Radians,
    z: Radians
}

type Rotation = Rotation2d | Rotation3d
export default Rotation

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

export const origin = (): Rotation => ({
    x: 0,
    y: 0,
    z: 0
})

export function add(...rotations: Rotation[]): Rotation {
    return rotations.reduce((previous, current) => {
        let z = 0
        if ('z' in previous && 'z' in current) z = previous.z + current.z

        return {
            x: previous.x + current.x,
            y: previous.y + current.y,
            z: z
        }
    })
}

export function subtract(...coords: Rotation[]): Rotation {
    return coords.reduce((previous, current) => ({
        x: previous.x - current.x,
        y: previous.y - current.y
    }))
}

export function multiply(...coords: Rotation[]): Rotation {
    return coords.reduce((previous, current) => ({
        x: previous.x * current.x,
        y: previous.y * current.y
    }))
}