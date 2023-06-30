import { WebSocket, WebSocketServer } from 'ws'
import { ConnectionPool } from '../../foundation/engine/network/connections'

export function startBroadcastServer(port: number) {
    const connections: ConnectionPool<WebSocket> = []

    const server = new WebSocketServer({ port: port })
    let nextConnectionId = 0
    server.addListener('connection', socket => {
        const thisConnection = {
            id: (nextConnectionId++).toString(),
            socket: socket
        }

        console.log(`New connection: ${thisConnection.id}`)

        socket.addEventListener('message', event => {
            connections.forEach(connection => {
                if(connection.id !== thisConnection.id) connection.channel?.send(event.data)
            })
        })

        socket.addEventListener('close', () => console.log(`Connection dropped: ${thisConnection.id}`))
        socket.addEventListener('error', event => console.error(event.message))

        connections.push(thisConnection)
    })

}