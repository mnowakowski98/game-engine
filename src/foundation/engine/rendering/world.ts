import Mesh from './mesh'

type Actor = Mesh

export default interface World {
    width: number
    height: number
    actors: () => Actor[]
}