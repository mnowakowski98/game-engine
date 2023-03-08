import Position from './position'

export default interface Collidable {
    isCollidingWith: (collidable: Collidable) => boolean
}

export abstract class RadialPositionDistanceCollidable implements Collidable {
    protected abstract position: Position
    protected abstract boundingRadius: number

    public isCollidingWith(collidable: Collidable): boolean {
        const other = collidable as RadialPositionDistanceCollidable
        const differenceX = other.position.x - this.position.x
        const differenceY = other.position.y - this.position.y
        const distance = Math.sqrt(differenceX * differenceX + differenceY * differenceY)
        return distance <= this.boundingRadius
    }
}

export abstract class BadBoundingCollidable {
    protected abstract position: Position;
    protected abstract boundingWidth: number
    protected abstract boundingLength: number
    public isCollidingWith(collidable: Collidable): boolean {
        const other = collidable as BadBoundingCollidable
        const otherWidthHalf = other.boundingWidth / 2
        const otherLengthHalf = other.boundingLength / 2
        return (this.position.x > other.position.x - otherWidthHalf && this.position.x < other.position.x + otherWidthHalf
            && this.position.y > other.position.y - otherLengthHalf && this.position.y < other.position.y + otherLengthHalf)
    }
}