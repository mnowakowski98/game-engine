import Position from './position'

export default interface Collidable {
    isCollidingWith: (collidable: Collidable) => boolean
}

export abstract class BaseCollidable implements Collidable {
    protected abstract position: Position;
    protected abstract boundingWidth: number
    protected abstract boundingLength: number
    public isCollidingWith(collidable: Collidable): boolean {
        const other = collidable as BaseCollidable
        const otherWidthHalf = other.boundingWidth / 2
        const otherLengthHalf = other.boundingLength / 2
        return (this.position.x > other.position.x - otherWidthHalf && this.position.x < other.position.x + otherWidthHalf
            && this.position.y > other.position.y - otherLengthHalf && this.position.y < other.position.y + otherLengthHalf)
    }
}