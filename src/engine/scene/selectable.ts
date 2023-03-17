export default interface Selectable {
    id: string
    onSelected: () => void
    onUnselected: () => void
}