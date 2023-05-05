export default interface Command {
    id: string
    actions: (() => void)[]
    undo?: () => void
}

const commands: Command[] = []
const globalCommands: Command[] = []

export function addCommandAction(command: Command, action: () => void) {
    command.actions.push(action)
}

export function registerCommand(command: Command) {
    commands.push(command)
}

export function unregisterCommand(command: Command) {
    commands.splice(commands.findIndex(_ => command.id === _.id), 1)
}

export function clearCommands() {
    while (commands.length > 0) commands.pop()
    for (const command of globalCommands) commands.push(command)
}

export function addGlobalCommand(command: Command) {
    globalCommands.push(command)
}

const findCommand = (commandId: string) => commands.find(command => command.id === commandId)

export function executeCommand(commandId: string) {
    const command = findCommand(commandId)
    if (command)
        for (const action of command.actions) action()
}

export function undoCommand(commandId: string) {
    const command = findCommand(commandId)
    if (command && command.undo) command.undo()
}