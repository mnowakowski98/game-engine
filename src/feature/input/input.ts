import Unique from '../../foundation/base-types/unique'

type PressTypes = 'press' | 'press-release' | 'press-hold' | 'press-hold-release'
type HoldTypes = 'hold' | 'press-hold' | 'hold-release' | 'press-hold-release'
type ReleaseTypes = 'release' | 'press-release' | 'hold-release' | 'press-hold-release'
type ButtonEventTypes = PressTypes | HoldTypes | ReleaseTypes

type AxisEventsTypes = 'change'

type CommandTypes = ButtonEventTypes | AxisEventsTypes

export interface Command {
    type: CommandTypes
    code: string
    action: () => void
}

export interface InputContext extends Unique {
    commands: Command[]
}

interface ContextState {
    buttonStates: Map<string, boolean>
    axisStates: Map<string, number>
    stop: () => void
}

export function startInputContext(context: InputContext): ContextState {
    const buttonStates = new Map<string, boolean>()
    const axisStates = new Map<string, number>()

    const onKeyDown = (event: KeyboardEvent) => {
        if (event.repeat) return
        
        buttonStates.set(event.code, true)

        const executableCommands = context.commands.filter(command =>
            (command.type.includes('press') || command.type.includes('hold')) && command.code === event.code)
        executableCommands.forEach(command => command.action())
    }

    const onKeyUp = (event: KeyboardEvent) => {
        buttonStates.set(event.code, false)

        const executableCommands = context.commands.filter(command =>
            (command.type.includes('release') || command.type.includes('hold')) && command.code === event.code)
        executableCommands.forEach(command => command.action())
    }

    const onMouseMove = (event: MouseEvent) => {
        axisStates.set('mouseX', event.movementX)
        axisStates.set('mouseY', event.movementY)
    }

    addEventListener('keydown', onKeyDown)
    addEventListener('keyup', onKeyUp)
    addEventListener('mousemove', onMouseMove)

    return {
        buttonStates: buttonStates,
        axisStates: axisStates,
        stop: () => {
            removeEventListener('keydown', onKeyDown)
            removeEventListener('keyup', onKeyUp)
            removeEventListener('mousemove', onMouseMove)
        }
    }
}