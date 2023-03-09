export default interface Updateable {
    id: string
    update: (deltaTime: number) => boolean
}