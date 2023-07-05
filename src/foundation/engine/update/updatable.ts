export default interface Updatable {
    update: (deltaTime: number) => void
}

export function isUpdatable(object: any): object is Updatable {
    return (object as Updatable).update !== undefined
}