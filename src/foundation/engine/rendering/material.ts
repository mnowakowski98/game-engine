export type Color = {
    red: number
    green: number
    blue: number
}

export default interface Material {
    diffuse: Color[]
}