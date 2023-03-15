export default interface Command {
    id: string
    execute: () => void
    undo?: () => void
}

const commands: Command[] = []

export function registerCommand(command: Command) {
    commands.push(command)
}

export function unregisterCommand(command: Command) {
    commands.splice(commands.findIndex(_ => command.id === _.id), 1)
}

export function clearCommands() {
    while (commands.length > 0) commands.pop()
}

const findCommand = (commandId: string) => commands.find(command => command.id === commandId)

export function executeCommand(commandId: string) {
    const command = findCommand(commandId)
    if (command) command.execute()
}

export function undoCommand(commandId: string) {
    const command = findCommand(commandId)
    if (command && command.undo) command.undo()
}