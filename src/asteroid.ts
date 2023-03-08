import Collidable, { BaseCollidable } from './collidable'
import Position from './position'
import Renderable from './renderable'

export default class Asteroid extends BaseCollidable implements Renderable, Collidable {

    public readonly id: number

    private path = new Path2D()

    private readonly radius = 17

    protected boundingWidth = this.radius * 2
    protected boundingLength = this.radius * 2

    protected position: Position = {
        x: 250,
        y: 250
    }

    public constructor(id: number) {
        super()
        this.id = id
    }

    public render(context: CanvasRenderingContext2D): boolean {
        this.path = new Path2D()
        this.path.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        this.path.closePath()
        context.fillStyle = "#c2a07c"
        context.fill(this.path)
        context.stroke(this.path)
        return true
    }
}