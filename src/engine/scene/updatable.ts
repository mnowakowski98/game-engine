import Unique from './unique'

export default interface Updatable extends Unique {
    update: (deltaTime: number) => void
}