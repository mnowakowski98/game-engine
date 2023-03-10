import Renderable from '../renderable';
import Updateable from '../updatable';

export default interface GameTimer extends Renderable, Updateable {
    time: number
}

export function renderGameTimer(timer: GameTimer, context: CanvasRenderingContext2D): boolean {
    context.fillText(timer.time.toString(), 10, 10)
    return true
}