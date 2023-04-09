import Unique from './Unique'

export default interface Updatable extends Unique {
    update: (deltaTime: number) => void
}