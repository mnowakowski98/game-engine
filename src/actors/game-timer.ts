import Renderable from '../renderable';
import Updatable from '../updatable';

export default interface GameTimer extends Renderable, Updatable {
    time: number
}

export function renderGameTimer(timer: GameTimer, context: CanvasRenderingContext2D) {
    context.fillText(timer.time.toString(), 0, 0)
}