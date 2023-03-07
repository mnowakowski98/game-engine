export default interface Updateable {
    id: number
    update: (deltaTime: number) => boolean
}