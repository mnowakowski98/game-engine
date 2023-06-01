import Unique from '../../foundation/base-types/unique'
import { originDistance } from '../../foundation/engine/space/distance'

type PressTypes = 'press' | 'press-release' | 'press-hold' | 'press-hold-release'
type HoldTypes = 'hold' | 'press-hold' | 'hold-release' | 'press-hold-release'
type ReleaseTypes = 'release' | 'press-release' | 'hold-release' | 'press-hold-release'
type ButtonEventTypes = PressTypes | HoldTypes | ReleaseTypes

type AxisEventsTypes = 'change'

type CommandTypes = ButtonEventTypes | AxisEventsTypes

export interface Command {
    type: CommandTypes
    code: string
    action: (value: boolean | number) => void
}

export interface InputContext extends Unique {
    commands?: Command[]
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

        if (!context.commands) return
        const executableCommands = context.commands.filter(command =>
            (command.type.includes('press') || command.type.includes('hold')) && command.code === event.code)
        executableCommands.forEach(command => command.action(true))
    }

    const onKeyUp = (event: KeyboardEvent) => {
        buttonStates.set(event.code, false)

        if (!context.commands) return
        const executableCommands = context.commands.filter(command =>
            (command.type.includes('release') || command.type.includes('hold')) && command.code === event.code)
        executableCommands.forEach(command => command.action(false))
    }

    const onMouseMove = (event: MouseEvent) => {
        axisStates.set('mouseX', event.movementX)
        axisStates.set('mouseY', event.movementY)

        if (!context.commands) return
        const executableCommands = context.commands.filter(command => command.type === 'change' && command.code === 'mouse')
        executableCommands.forEach(command => command.action(originDistance(event.movementX, event.movementY)))

        setTimeout(() => {
            axisStates.set('mouseX', 0)
            axisStates.set('mouseY', 0)
        }, 10)
    }

    addEventListener('keydown', onKeyDown)
    addEventListener('keyup', onKeyUp)
    addEventListener('mousemove', onMouseMove)

    const state: ContextState = {
        buttonStates: buttonStates,
        axisStates: axisStates,
        stop: () => {
            removeEventListener('keydown', onKeyDown)
            removeEventListener('keyup', onKeyUp)
            removeEventListener('mousemove', onMouseMove)
            state.buttonStates = new Map()
            state.axisStates = new Map()
        }
    }

    return state
}