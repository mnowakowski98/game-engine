import Updateable from './updatable'
import Renderable from './renderable'
import Position from './position'

export default class Ship implements Updateable, Renderable {
    private length = 50
    private width = 25

    public readonly id: number

    private position: Position = {
        x: 50,
        y: 50
    }

    private rotation = 90

    public constructor(id: number) {
        this.id = id
    }

    public setPosition(x: number, y: number) {
        this.position.x = x
        this.position.y = y
    }

    public update(deltaTime: number): boolean {
        return true
    }

    public render(context: CanvasRenderingContext2D): boolean {
        context.beginPath()

        context.translate(this.position.x, this.position.y)
        context.rotate((this.rotation * Math.PI) / 180)
        context.translate(-this.position.x, -this.position.y)

        context.moveTo(this.position.x - this.width / 2, this.position.y + this.length / 2)
        context.lineTo(this.position.x + this.width / 2, this.position.y + this.length / 2)
        context.lineTo(this.position.x, this.position.y - this.length / 2)

        context.closePath()

        context.lineWidth = 2
        context.fillStyle = "red"
        context.fill()
        context.stroke()
        return true
    }
}