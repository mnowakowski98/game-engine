import Unique from '../../foundation/base-types/unique'
import Command from './command'

export default interface InputContext extends Unique {
    commands: () => Map<string, Command[]>
    active: () => boolean
}

export function startInputContext(context: InputContext): () => void {
    const onKeyUp = (event: KeyboardEvent) => {
        if (context.active() === false) return

        const commands = context.commands().get(event.code)
        if (!commands) return

        commands.forEach(command => command.execute())
    }

    addEventListener('keyup', onKeyUp)

    return () => removeEventListener('keyup', onKeyUp)
}