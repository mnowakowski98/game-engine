type LedCommand = {
    led?: string
    on?: boolean
}

let socket: WebSocket

export function connectDevice(url: string) {
    socket = new WebSocket(url)
    socket.addEventListener('message', event => {
        console.log(event.data)
    })
}

export function sendLedCommand(command: LedCommand) {
    if (!socket) return

    const send = () => {
        const commandString = JSON.stringify(command)
        console.log(`Sending: ${commandString}`)
        socket.send(commandString)
    }

    const checkOpen = () => {
        if (socket.readyState !== 1) setTimeout(checkOpen, 500)
        else send()
    }

    checkOpen()
}