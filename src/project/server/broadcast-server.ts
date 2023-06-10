import { WebSocket, WebSocketServer } from 'ws'
import Unique from '../../foundation/base-types/unique'

type Connection = Unique & {
    socket: WebSocket
}

export function startBroadcastServer(port: number) {
    const connections: Connection[] = []

    const wss = new WebSocketServer({ port: port })
    let nextConnectionid = 0
    wss.addListener('connection', socket => {
        const thisConnection = {
            id: (nextConnectionid++).toString(),
            socket: socket
        }

        console.log(`New connection: ${thisConnection.id}`)

        socket.addEventListener('message', event => {
            connections.forEach(connection => {
                if(connection.id !== thisConnection.id) connection.socket.send(event.data)
            })
        })

        socket.addEventListener('close', () => console.log(`Connection dropped: ${thisConnection.id}`))
        socket.addEventListener('error', event => console.error(event.message))

        connections.push(thisConnection)
    })

}