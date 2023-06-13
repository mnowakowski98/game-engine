import { WebSocket, WebSocketServer } from 'ws'
import { Connection, ConnectionPool } from '../../foundation/engine/network/connections'
import { ClientMessage, isClientMessage } from '../../foundation/engine/network/p2p'

export type Host<ChannelType> = Connection<ChannelType> | null

export function startCoordinator(port: number) {
    console.log(`Starting signaling server on port ${port}`)

    const connectionPool: ConnectionPool<WebSocket> = []
    let host: Host<WebSocket>

    const server = new WebSocketServer({ port: port })
    let connectionId = 0

    server.addListener('connection', socket => {
        console.log(`New connection: ${connectionId}`)
        const connection: Connection<WebSocket> = {
            id: (connectionId++).toString(),
            channel: socket
        }

        connectionPool.push(connection)

        console.log(`Sending connection id to ${connection.id}`)
        socket.send(JSON.stringify({
            action: 'set-id',
            id: connection.id
        }))

        if (!host) {
            console.log(`Setting connection ${connection.id} as the host`)
            host = connection
            socket.send(JSON.stringify({ action: 'set-host' }))
        }
        else {
            console.log(`Sending host id (${host.id}) to ${connection.id}`)
            socket.send(JSON.stringify({
                action: 'call-host',
                id: host.id
            }))
        }

        socket.addEventListener('message', event => {
            const data = event.data
            if (!isClientMessage(data)) return

            const message = JSON.parse(event.data.toString()) as ClientMessage
            message.from = connection.id
            const forSocket = connectionPool.find(conn => message.for === conn.id)?.channel
            if (forSocket) {
                console.log(`Forwarding message from ${connection.id} to ${message.for}`)
                forSocket.send(event.data)
            }
        })

        socket.addEventListener('close', () => {
            console.log(`Connection ${connection.id} disconnected`)
            connectionPool.splice(connectionPool.findIndex(conn => conn === connection), 1)
        })
    })
}