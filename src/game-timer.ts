import Renderable from './renderable';
import Updateable from './updatable';

export default interface GameTimer extends Updateable, Renderable {
    startTime: number
    endTime: number
    totalTime: () => number
}

export function renderGameTimer(timer: GameTimer, context: CanvasRenderingContext2D): boolean {
    context.fillText(timer.totalTime().toString(), 10, 10)
    return true
}