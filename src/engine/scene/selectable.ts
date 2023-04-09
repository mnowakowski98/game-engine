import Unique from './Unique'

export default interface Selectable extends Unique {
    onSelected: () => void
    onUnselected: () => void
}