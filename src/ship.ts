import Updateable from './updatable'
import Renderable from './renderable'

export default class Ship implements Updateable, Renderable {
    private length = 50
    private width = 25

    public readonly id: number

    private positionX = 50
    private positionY = 50
    private rotation = 90

    public constructor(id: number) {
        this.id = id
    }

    public update(): boolean {
        return true
    }

    public render(context: CanvasRenderingContext2D): boolean {
        context.beginPath()

        context.translate(this.positionX, this.positionY)
        context.rotate((this.rotation * Math.PI) / 180)
        context.translate(-this.positionX, -this.positionY)

        context.moveTo(this.positionX - this.width / 2, this.positionY + this.length / 2)
        context.lineTo(this.positionX + this.width / 2, this.positionY + this.length / 2)
        context.lineTo(this.positionX, this.positionY - this.length / 2)

        context.closePath()

        context.lineWidth = 2
        context.fillStyle = "red"
        context.fill()
        context.stroke()
        return true
    }
}