import Material from './material'

export default interface Mesh {
    geometry: Buffer
    material?: Material
}