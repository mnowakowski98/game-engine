export default interface Renderable {
    id: number
    render: (context: CanvasRenderingContext2D) => boolean
}