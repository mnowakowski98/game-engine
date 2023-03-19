import Renderable from './renderable'

export default interface Control extends Renderable {
    width: number
    height: number
    text?: string
}
