// Functions that should probably be replaced by an external library if there's a lot
// I'm not ever gonna do that tho probably

//#region Constants

export const pi2 = Math.PI * 2

//#endregion

//#region Randomization

export function randomBetween(min: number, max: number): number {
    const difference = max - min
    const baseRandom = difference * Math.random()
    return baseRandom + min
}

//#endregion