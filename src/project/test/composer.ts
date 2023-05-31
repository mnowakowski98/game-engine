import { startScene } from '../../feature/scene/scene'
import { start } from './scenes/game'


export default function startGame(canvas: HTMLCanvasElement) {
    const gameScene = start(() => canvas.width, () => canvas.height)
    startScene(canvas, gameScene)
}