// Functions that should probably be replaced by an external library if there's a lot
// I'm not ever gonna do that tho probably

export function deg2rad(degrees: number): number {
    return (degrees * Math.PI) / 180
}

export function rad2deg(radians: number): number {
    return (radians * 180) / Math.PI
}

export function movementDistance(speed: number, time: number): number {
    return speed / time
}
