export default interface Renderable {
    id: string
    render: (context: CanvasRenderingContext2D) => void
}