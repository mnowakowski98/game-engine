export default interface Updatable {
    id: string
    update: (deltaTime: number) => void
}