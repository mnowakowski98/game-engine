import Unique from './unique'

export default interface Selectable extends Unique {
    onSelected: () => void
    onUnselected: () => void
}