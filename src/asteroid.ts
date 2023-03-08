import Collidable from './collidable'
import Renderable from './renderable'
import Updateable from './updatable'

export default interface Asteroid extends Collidable, Renderable, Updateable {
    boundingRadius: number
}

// export default class Asteroid extends RadialPositionDistanceCollidable implements Renderable, Collidable, Updateable {

//     private path = new Path2D()

//     private readonly radius = 17

//     private readonly rotation = 90

//     protected boundingRadius = this.radius

//     protected position: Position = {
//         x: 250,
//         y: 250
//     }

//     public constructor(public readonly id: number,
//         private readonly canvasWidth: number,
//         private readonly canvasHeight: number) {
//         super()
//     }

//     public update(deltaTime: number): boolean {
//         this.position.x += Math.sin(this.rotation)
//         this.position.y += Math.cos(this.rotation)

//         if ((this.position.x < 0 || this.position.x > this.canvasWidth + this.boundingRadius)
//         || (this.position.y < 0 || this.position.x > this.canvasHeight + this.boundingRadius)) {
            
//         }

//         return true
//     }

//     public render(context: CanvasRenderingContext2D): boolean {
//         this.path = new Path2D()
//         this.path.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
//         this.path.closePath()
//         context.fillStyle = "#c2a07c"
//         context.fill(this.path)
//         context.stroke(this.path)
//         return true
//     }
// }